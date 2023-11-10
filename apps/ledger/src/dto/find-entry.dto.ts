import { PaginationDto } from '@app/common';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Currency, EntryType } from '../interface/ledger.interface';

export class FindEntiresDto extends IntersectionType(PaginationDto) {
  @ApiProperty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(EntryType)
  type: EntryType;

  @ApiProperty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(Currency)
  currency: Currency;
}
