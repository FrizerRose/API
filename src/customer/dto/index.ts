import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CustomerCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
  })
  phone!: string;

  @ApiProperty({
    required: true,
  })
  company!: number;
}
