import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CompanyPreferencesCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  leadTimeWindow!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  schedulingWindow!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  cancellationWindow!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  hasStaffPick!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  canCancel!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  clientReminderEmail!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  staffReminderEmail!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  staffCancellationNotice!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  colorVariant!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  facebookLink!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  instagramLink!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  websiteLink!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  termsLink!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  company!: number;
}

export class CompanyPreferencesUpdateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  leadTimeWindow!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  schedulingWindow!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  cancellationWindow!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  hasStaffPick!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  canCancel!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  clientReminderEmail!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  staffReminderEmail!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  staffCancellationNotice!: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  clientReminderTime!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  staffReminderTime!: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  colorVariant!: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  company!: number;
}
