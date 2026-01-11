import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDebtInput } from './dto/createDebt.dto';
import { ErrorService } from 'src/error/error.service';

export enum DebtStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

@Injectable()
export class DebtService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorService: ErrorService,
  ) {}

  /* ======================================================
   * CREATE
   * ====================================================== */

  /**
   * Crear una deuda
   * Reglas:
   * - El monto debe ser mayor a 0
   * - El estado inicial siempre es PENDING
   */
  async createDebt(input: CreateDebtInput) {
    try {
      const { description, totalAmount, createdById } = input;

      if (totalAmount <= 0) {
        throw new BadRequestException(
          'El valor de la deuda debe ser mayor a cero',
        );
      }

      const debt = await this.prisma.debt.create({
        data: {
          description,
          totalAmount,
          status: DebtStatus.PENDING,
          createdById,
        },
      });

      return debt;
    } catch (error) {
      this.errorService.handleError(
        'Error al crear una deuda',
        'DebtService.createDebt',
        error,
      );
    }
  }

  /* ======================================================
   * READ
   * ====================================================== */

  /**
   * Listar deudas de un usuario
   * - Pendientes y pagadas
   */
  async listDebtsByUser(userId: string) {
    try {
      return await this.prisma.debt.findMany({
        where: {
          createdById: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.errorService.handleError(
        'Error al listar deudas del usuario',
        'DebtService.listDebtsByUser',
        error,
      );
    }
  }

  /**
   * Obtener deuda por ID
   */
  async getDebtById(debtId: string) {
    const debt = await this.prisma.debt.findUnique({
      where: { id: debtId },
    });

    if (!debt) {
      throw new NotFoundException('La deuda no existe');
    }

    return debt;
  }

  /* ======================================================
   * UPDATE
   * ====================================================== */

  /**
   * Marcar deuda como pagada
   * Reglas:
   * - Una deuda pagada no puede volver a modificarse
   */
  async markDebtAsPaid(debtId: string) {
    try {
      const debt = await this.getDebtById(debtId);

      if (debt.status === DebtStatus.PAID) {
        throw new BadRequestException('La deuda ya se encuentra pagada');
      }

      return await this.prisma.debt.update({
        where: { id: debtId },
        data: {
          status: DebtStatus.PAID,
        },
      });
    } catch (error) {
      this.errorService.handleError(
        'Error al marcar la deuda como pagada',
        'DebtService.markDebtAsPaid',
        error,
      );
    }
  }

  /**
   * Editar deuda
   * Reglas:
   * - No se puede editar si está pagada
   * - El valor no puede ser negativo
   */
  async updateDebt(
    debtId: string,
    data: { description?: string; totalAmount?: number },
  ) {
    try {
      const debt = await this.getDebtById(debtId);

      if (debt.status === DebtStatus.PAID) {
        throw new BadRequestException('No se puede modificar una deuda pagada');
      }

      if (data.totalAmount !== undefined && data.totalAmount <= 0) {
        throw new BadRequestException(
          'El valor de la deuda debe ser mayor a cero',
        );
      }

      return await this.prisma.debt.update({
        where: { id: debtId },
        data,
      });
    } catch (error) {
      this.errorService.handleError(
        'Error al actualizar la deuda',
        'DebtService.updateDebt',
        error,
      );
    }
  }

  /* ======================================================
   * DELETE
   * ====================================================== */

  /**
   * Eliminar deuda
   * Regla:
   * - No se puede eliminar si está pagada
   */
  async deleteDebt(debtId: string) {
    try {
      const debt = await this.getDebtById(debtId);

      if (debt.status === DebtStatus.PAID) {
        throw new BadRequestException('No se puede eliminar una deuda pagada');
      }

      await this.prisma.debt.delete({
        where: { id: debtId },
      });

      return true;
    } catch (error) {
      this.errorService.handleError(
        'Error al eliminar la deuda',
        'DebtService.deleteDebt',
        error,
      );
    }
  }

  /* ======================================================
   * AGGREGATIONS (EXTRA PUNTOS)
   * ====================================================== */

  /**
   * Resumen de deudas de un usuario
   * - Total pagado
   * - Total pendiente
   */
  async debtSummaryByUser(userId: string) {
    try {
      const debts = await this.prisma.debt.findMany({
        where: { createdById: userId },
        select: {
          totalAmount: true,
          status: true,
        },
      });

      let totalPaid = 0;
      let totalPending = 0;

      for (const debt of debts) {
        if (debt.status === DebtStatus.PAID) {
          totalPaid += Number(debt.totalAmount);
        } else {
          totalPending += Number(debt.totalAmount);
        }
      }

      return {
        totalPaid,
        totalPending,
      };
    } catch (error) {
      this.errorService.handleError(
        'Error al calcular resumen de deudas',
        'DebtService.debtSummaryByUser',
        error,
      );
    }
  }
}
