import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AppointmentCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

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
