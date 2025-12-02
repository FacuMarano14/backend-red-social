import { IsString, IsEmail, MinLength, IsOptional, Matches } from 'class-validator';

export class CreateUserAdminDTO {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @IsString()
  nombre_usuario: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/)
  password: string;

  @IsOptional()
  @IsString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  perfil: 'usuario' | 'administrador';
}
