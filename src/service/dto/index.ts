import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ServiceCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: true,
  })
  duration!: number;

  @ApiProperty({
    required: true,
  })
  price!: number;

  @ApiProperty({
    required: true,
  })
  sex!: number;

  @ApiProperty({
    required: false,
  })
  company!: number;

  @ApiProperty({
    required: true,
  })
  staff!: string[];
}

export class ServiceUpdateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: true,
  })
  duration!: number;

  @ApiProperty({
    required: true,
  })
  price!: number;

  @ApiProperty({
    required: true,
  })
  sex!: number;

  @ApiProperty({
    required: false,
  })
  company!: number;

  @ApiProperty({
    required: true,
  })
  staff!: string[];
}
