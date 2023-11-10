import { Module } from '@nestjs/common';
import { LedgerController } from './ledger.controller';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { DatabaseModule } from '@app/database';
import { LedgerEntity } from './entity/ledger.entity';
import { EntryEntity } from './entity/entry.entity';
import { LedgerService } from './service/ledger.service';
import { EntryService } from './service/entry.service';

@Module({
  imports: [
    DatabaseModule.register(),
    DatabaseModule.forEntity([LedgerEntity, EntryEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.LEDGER),
  ],
  controllers: [LedgerController],
  providers: [LedgerService, EntryService],
})
export class LedgerModule {}
