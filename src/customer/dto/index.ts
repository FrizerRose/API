import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CustomerCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: false,
  })
  // @IsEmail()
  email!: string;

  @ApiProperty({
    required: false,
  })
  phone!: string;

  @ApiProperty({
    required: true,
  })
  company!: number;
}

export class CustomerUpdateDto {
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
  // @IsEmail()
  email!: string;

  @ApiProperty({
    required: false,
  })
  phone!: string;

  @ApiProperty({
    required: true,
  })
  company!: number;
}
