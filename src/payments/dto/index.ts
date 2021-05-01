import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class PaymentCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  date!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  status!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  status!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  company!: number;
}
