import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class PaymentCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  date!: string;

  @ApiProperty({
    required: true,
  })
  amount!: number;

  @ApiProperty({
    required: true,
  })
  company!: number;
}

export class PaymentUpdateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  date!: string;

  @ApiProperty({
    required: true,
  })
  amount!: string;

  @ApiProperty({
    required: true,
  })
  company!: number;
}
