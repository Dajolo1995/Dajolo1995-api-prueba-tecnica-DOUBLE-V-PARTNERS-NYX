import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorService } from '../error/error.service';

export enum DebtStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

@Injectable()
export class DebtParticipantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorService: ErrorService,
  ) {}

  /**
   * Agregar un participante a una deuda
   * Reglas:
   * - El monto debe ser mayor a 0
   * - No se puede agregar si la deuda está PAGADA
   * - No se puede duplicar usuario + deuda
   */
  async addParticipant(debtId: string, userId: string, amount: number) {
    try {
      if (amount <= 0) {
        throw new BadRequestException(
          'El monto del participante debe ser mayor a cero',
        );
      }

      const debt = await this.prisma.debt.findUnique({
        where: { id: debtId },
      });

      if (!debt) {
        throw new BadRequestException('La deuda no existe');
      }

      if (debt.status === DebtStatus.PAID) {
        throw new ConflictException(
          'No se pueden agregar participantes a una deuda pagada',
        );
      }

      const exists = await this.prisma.debtParticipant.findUnique({
        where: {
          userId_debtId: {
            userId,
            debtId,
          },
        },
      });

      if (exists) {
        throw new ConflictException(
          'El usuario ya es participante de esta deuda',
        );
      }

      // 🔹 Obtener suma actual de participantes
      const participants = await this.prisma.debtParticipant.findMany({
        where: { debtId },
        select: { amount: true },
      });

      const totalParticipantsAmount = participants.reduce(
        (sum, p) => sum + p.amount,
        0,
      );

      const remainingAmount = debt.totalAmount - totalParticipantsAmount;

      // 🔒 Validación clave
      if (amount > remainingAmount) {
        throw new BadRequestException(
          `El monto excede el total de la deuda. Solo faltan $${remainingAmount} por asignar`,
        );
      }

      return await this.prisma.debtParticipant.create({
        data: {
          userId,
          debtId,
          amount,
          status: DebtStatus.PENDING,
        },
      });
    } catch (error) {
      this.errorService.handleError(
        'Error al agregar participante',
        'DebtParticipantService.addParticipant',
        error,
      );
    }
  }

  /**
   * Listar participantes de una deuda
   */
  async listParticipants(debtId?: string) {
    try {
      return await this.prisma.debtParticipant.findMany({
        where: { debtId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              nickname: true,
              name: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      this.errorService.handleError(
        'Error al listar participantes',
        'DebtParticipantService.listParticipants',
        error,
      );
    }
  }

  /**
   * Marcar como pagado un participante
   * Regla extra:
   * - Si TODOS los participantes están PAID, la deuda pasa a PAID
   */
  async markParticipantAsPaid(debtId: string, userId: string) {
    try {
      const participant = await this.prisma.debtParticipant.findUnique({
        where: {
          userId_debtId: {
            userId,
            debtId,
          },
        },
      });

      if (!participant) {
        throw new BadRequestException(
          'El participante no existe en esta deuda',
        );
      }

      if (participant.status === DebtStatus.PAID) {
        throw new ConflictException(
          'El participante ya marcó esta deuda como pagada',
        );
      }

      // 🔹 Marcar participante como pagado
      await this.prisma.debtParticipant.update({
        where: {
          userId_debtId: {
            userId,
            debtId,
          },
        },
        data: {
          status: DebtStatus.PAID,
          paidAt: new Date(),
        },
      });

      // 🔥 Verificar si todos los participantes pagaron
      const pendingCount = await this.prisma.debtParticipant.count({
        where: {
          debtId,
          status: DebtStatus.PENDING,
        },
      });

      // ✅ Solo cuando TODOS pagaron, la deuda pasa a PAID
      if (pendingCount === 0) {
        await this.prisma.debt.update({
          where: { id: debtId },
          data: {
            status: DebtStatus.PAID,
          },
        });
      }

      return {
        message: 'Pago registrado correctamente',
        debtPaid: pendingCount === 0,
      };
    } catch (error) {
      this.errorService.handleError(
        'Error al marcar participante como pagado',
        'DebtParticipantService.markParticipantAsPaid',
        error,
      );
    }
  }
}
