import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CompanyCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: true,
  })
  isPublic!: boolean;

  @ApiProperty({
    required: true,
  })
  bookingPageSlug!: string;

  @ApiProperty({
    required: true,
  })
  contactEmail!: string;

  @ApiProperty({
    required: true,
  })
  streetName!: string;

  @ApiProperty({
    required: true,
  })
  city!: string;

  @ApiProperty({
    required: true,
  })
  phoneNumber!: string;

  @ApiProperty({
    required: true,
  })
  about!: string;

  @ApiProperty({
    required: true,
  })
  hours!: string;

  @ApiProperty({
    required: true,
  })
  user!: number;
}

export class CompanyUpdateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    required: true,
  })
  isPublic!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: true,
  })
  bookingPageSlug!: string;

  @ApiProperty({
    required: true,
  })
  contactEmail!: string;

  @ApiProperty({
    required: true,
  })
  streetName!: string;

  @ApiProperty({
    required: true,
  })
  city!: string;

  @ApiProperty({
    required: true,
  })
  phoneNumber!: string;

  @ApiProperty({
    required: true,
  })
  about!: string;

  @ApiProperty({
    required: true,
  })
  hours!: string;

  @ApiProperty({
    required: true,
  })
  user!: number;
}
