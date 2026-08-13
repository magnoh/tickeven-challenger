import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, Min, IsUrl } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsUrl({}, { message: 'A URL da imagem deve ser um formato de URL válido' })
  @IsOptional()
  imageUrl?: string;

  @IsDateString({}, { message: 'A data deve ser um formato ISO válido' })
  @IsNotEmpty({ message: 'A data do evento é obrigatória' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'O local do evento é obrigatório' })
  location: string;

  @IsNumber({}, { message: 'A capacidade deve ser um número' })
  @Min(1, { message: 'A capacidade deve ser de pelo menos 1 ingresso' })
  capacity: number;

  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  price: number;

  @IsString()
  @IsOptional()
  externalId?: string;
}
