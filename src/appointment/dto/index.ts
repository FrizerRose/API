import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AppointmentCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  date!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  time!: string;

  @ApiProperty({
    required: true,
  })
  message!: string;

  @ApiProperty({
    required: true,
  })
  hasCustomerArrived!: boolean;

  @ApiProperty({
    required: true,
  })
  company!: number;

  @ApiProperty({
    required: true,
  })
  staff!: number;

  @ApiProperty({
    required: true,
  })
  service!: number;

  @ApiProperty({
    required: true,
  })
  customer!: number;
}

export class AppointmentUpdateDto {
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
  time!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  hasCustomerArrived!: boolean;

  @ApiProperty({
    required: true,
  })
  message!: string;

  @ApiProperty({
    required: true,
  })
  company!: number;

  @ApiProperty({
    required: true,
  })
  staff!: number;

  @ApiProperty({
    required: true,
  })
  service!: number;

  @ApiProperty({
    required: true,
  })
  customer!: number;
}
