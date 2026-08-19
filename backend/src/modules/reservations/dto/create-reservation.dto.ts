import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do evento é obrigatório' })
  eventId: string;

  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @Min(1, { message: 'A quantidade mínima para reserva é 1 ingresso' })
  @Max(10, { message: 'A quantidade máxima para reserva é 10 ingressos por vez' })
  quantity: number;

  @IsString({ each: true })
  @IsOptional()
  seats?: string[];
}

