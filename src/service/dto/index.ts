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
    required: false,
  })
  company!: number;
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
    required: false,
  })
  company!: number;
}
