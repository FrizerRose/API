import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class StaffCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: false,
  })
  isPublic!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
  })
  hours!: string;

  @ApiProperty({
    required: true,
  })
  company!: number;

  @ApiProperty({
    required: false,
  })
  user!: number;

  @ApiProperty({
    required: true,
  })
  services!: string[];
}

export class StaffUpdateDto {
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
    required: false,
  })
  isPublic!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
  })
  hours!: string;

  @ApiProperty({
    required: true,
  })
  company!: number;

  @ApiProperty({
    required: false,
  })
  user!: number;

  @ApiProperty({
    required: true,
  })
  services!: string[];
}
