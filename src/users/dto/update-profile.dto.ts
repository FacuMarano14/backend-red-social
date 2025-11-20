// import { IsEmail, IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';

// export class UpdateProfileDto {
//   @IsOptional()
//   @IsString()
//   @MaxLength(50)
//   name?: string;

//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @IsOptional()
//   @IsString()
//   @MaxLength(200)
//   bio?: string;

//   @IsOptional()
//   @IsUrl({}, { message: 'El avatar debe ser una URL válida' })
//   avatar?: string;
// }
import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  apellido?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre_usuario?: string;
}
