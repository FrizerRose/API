import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class BreakCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  start!: string;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  end!: string;

  @ApiProperty({
    required: true,
  })
  staff!: number;
}

export class BreakUpdateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  start!: string;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  end!: string;

  @ApiProperty({
    required: true,
  })
  staff!: number;
}
