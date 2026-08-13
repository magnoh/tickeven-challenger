import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum PaymentResult {
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

export class ProcessPaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID da reserva é obrigatório' })
  reservationId: string;

  @IsEnum(PaymentResult, { message: 'O resultado deve ser APPROVED ou DECLINED' })
  result: PaymentResult;
}
