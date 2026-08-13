import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ValidateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'O token/código do ingresso é obrigatório' })
  token: string;

  @IsString()
  @IsOptional()
  eventId?: string;
}
