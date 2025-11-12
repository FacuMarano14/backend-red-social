import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  identificador: string; // puede ser email o nombre_usuario

  @IsNotEmpty()
  @IsString()
  password: string;
}
