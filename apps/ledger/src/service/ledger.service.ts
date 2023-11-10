import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LedgerEntity } from '../entity/ledger.entity';
import { Repository } from 'typeorm';
import { TransferDto } from '../dto/transfer.dto';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { EntryService } from './entry.service';
import { CreateLedgerDto } from '../dto/create-ledger.dto';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntity)
    private ledgerRepository: Repository<LedgerEntity>,
    private entryService: EntryService,
  ) {}

  async create(
    createLedgerDto: CreateLedgerDto,
    user: UserEntity,
  ): Promise<IServiceResponse<LedgerEntity>> {
    const ledger = await this.ledgerRepository.create({
      currency: createLedgerDto.currency,
      balance: createLedgerDto.initialBalance,
      user,
    });
    const result = await this.ledgerRepository.save(ledger);
    return {
      state: !!result,
      data: result,
    };
  }

  async findAllByUser(
    userId: string,
  ): Promise<IServiceResponse<LedgerEntity[]>> {
    const ledgers = await this.ledgerRepository.findBy({
      user: { id: userId },
    });
    return {
      state: true,
      data: ledgers,
    };
  }

  async transfer(
    transferDto: TransferDto,
    user: UserEntity,
  ): Promise<IServiceResponse<LedgerEntity>> {
    const currency = transferDto.currency;
    const amount = +transferDto.amount;

    const fromLedger = await this.ledgerRepository.findOneBy({
      user: { id: user.id },
      currency,
    });
    if (fromLedger.balance < amount)
      return { state: false, data: null, message: 'insufficient balance' };

    const toLedger = await this.ledgerRepository.findOneBy({
      user: { email: transferDto.email },
      currency,
    });

    await this.entryService.createTransferEntries(
      fromLedger,
      toLedger,
      amount,
      currency,
    );

    fromLedger.balance = +fromLedger.balance - amount;
    toLedger.balance = +toLedger.balance + amount;
    await this.ledgerRepository.save([fromLedger, toLedger]);

    return {
      state: true,
      data: fromLedger,
    };
  }
}
