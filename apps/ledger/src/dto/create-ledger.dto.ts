import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Currency } from '../interface/ledger.interface';

export class CreateLedgerDto {
  @ApiProperty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  initialBalance: number;
}
