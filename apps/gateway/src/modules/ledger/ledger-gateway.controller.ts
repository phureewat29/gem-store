import { Auth, CurrentUser } from '@app/authentication';
import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { IPagination } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { LEDGER_MESSAGE_PATTERNS } from 'apps/ledger/src/constant/ledger-patterns.dto';
import { FindEntiresDto } from 'apps/ledger/src/dto/find-entry.dto';
import { TransferDto } from 'apps/ledger/src/dto/transfer.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { LedgerEntity } from 'apps/ledger/src/entity/ledger.entity';
import { EntryEntity } from 'apps/ledger/src/entity/entry.entity';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { firstValueFrom } from 'rxjs';

@ApiTags('Ledger Gateway')
@Controller({ path: '/ledgers' })
@Auth()
export class LedgerGatewayController {
  constructor(
    @Inject(RabbitServiceName.LEDGER) private ledgerClient: ClientProxy,
  ) {}

  @Get('/')
  async getUserLedgers(
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<LedgerEntity[]>> {
    const { state, data } = await firstValueFrom(
      this.ledgerClient.send<IServiceResponse<LedgerEntity[]>, string>(
        LEDGER_MESSAGE_PATTERNS.FIND_ALL_BY_USER,
        user.id,
      ),
    );
    return {
      state,
      data,
    };
  }

  @Post('/transfer')
  async login(
    @Body() transferDto: TransferDto,
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<IPagination<LedgerEntity>>> {
    const { state, data, message } = await firstValueFrom(
      this.ledgerClient.send<
        IServiceResponse<IPagination<LedgerEntity>>,
        { transferDto: TransferDto; user: UserEntity }
      >(LEDGER_MESSAGE_PATTERNS.TRANSFER, { transferDto, user }),
    );
    return {
      state,
      data,
      message,
    };
  }

  @Get('/entries')
  async getEntries(
    @Query() findEntriesDto: FindEntiresDto,
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<IPagination<EntryEntity>>> {
    const { state, data, message } = await firstValueFrom(
      this.ledgerClient.send<
        IServiceResponse<IPagination<EntryEntity>>,
        { findEntriesDto: FindEntiresDto; user: UserEntity }
      >(LEDGER_MESSAGE_PATTERNS.FIND_ENTRIES, {
        findEntriesDto,
        user,
      }),
    );
    return {
      state,
      data,
      message,
    };
  }
}
