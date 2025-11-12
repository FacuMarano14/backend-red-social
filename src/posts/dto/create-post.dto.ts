import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(100)
  titulo: string;

  @IsString()
  @MaxLength(500)
  contenido: string;

  @IsOptional()
  imagen?: string;
}
