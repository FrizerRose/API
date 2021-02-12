import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class StaffCreateDto {
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
  company!: number;
}
