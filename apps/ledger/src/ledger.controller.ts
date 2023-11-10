import { Controller } from '@nestjs/common';
import { LedgerService } from './service/ledger.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEDGER_MESSAGE_PATTERNS } from './constant/ledger-patterns.dto';
import { TransferDto } from './dto/transfer.dto';
import { IServiceResponse } from '@app/rabbit';
import { LedgerEntity } from './entity/ledger.entity';
import { IPagination } from '@app/common';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { FindEntiresDto } from './dto/find-entry.dto';
import { EntryEntity } from './entity/entry.entity';
import { EntryService } from './service/entry.service';
import { CreateLedgerDto } from './dto/create-ledger.dto';

@Controller()
export class LedgerController {
  constructor(
    private ledgerService: LedgerService,
    private entryService: EntryService,
  ) {}

  @MessagePattern(LEDGER_MESSAGE_PATTERNS.CREATE)
  async createLedger(
    @Payload('createLedgerDto') createLedgerDto: CreateLedgerDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<LedgerEntity>> {
    return await this.ledgerService.create(createLedgerDto, user);
  }

  @MessagePattern(LEDGER_MESSAGE_PATTERNS.FIND_ALL_BY_USER)
  async getUserLedgers(
    @Payload() userId: string,
  ): Promise<IServiceResponse<LedgerEntity[]>> {
    return await this.ledgerService.findAllByUser(userId);
  }

  @MessagePattern(LEDGER_MESSAGE_PATTERNS.TRANSFER)
  async transfer(
    @Payload('transferDto') transferDto: TransferDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<LedgerEntity>> {
    return await this.ledgerService.transfer(transferDto, user);
  }

  @MessagePattern(LEDGER_MESSAGE_PATTERNS.FIND_ENTRIES)
  async getEntries(
    @Payload('findEntriesDto') findEntriesDto: FindEntiresDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<IPagination<EntryEntity>>> {
    return await this.entryService.findEntries(findEntriesDto, user);
  }
}
