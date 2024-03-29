import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  oldPassword!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password!: string;
}
export class ResetPasswordDTO {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;
}

export class LoginDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  company!: number;
}

export class RegisterDto {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: false,
  })
  isAdminAccount!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password!: string;
}

export class UpdateUserDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: false,
  })
  isAdminAccount!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password?: string;
}
