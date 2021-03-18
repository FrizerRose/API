import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class FaqCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  question!: string;

  @ApiProperty({
    required: true,
  })
  answer!: string;

  @ApiProperty({
    required: true,
  })
  order!: number;
}

export class FaqUpdateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  question!: string;

  @ApiProperty({
    required: true,
  })
  answer!: string;

  @ApiProperty({
    required: true,
  })
  order!: number;
}
