import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class DayOffCreateDto {
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
  company!: number;
}

export class DayOffUpdateDto {
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
  company!: number;
}
