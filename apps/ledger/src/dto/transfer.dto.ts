import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../interface/ledger.interface';
import { IsEmail, IsEnum, Min, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class TransferDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsEnum(Currency)
  @Transform(({ value }) => ('' + value).toLowerCase())
  currency: Currency;
}
