import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail(
    {}, { message: 'Por favor seleccione un email valido' }
  )
  email: string;

  @IsString()
  @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nickname es obligatorio' })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Matches(/^[0-9+\-\s]+$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;
}
