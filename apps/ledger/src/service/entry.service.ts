import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { IPagination } from '@app/common';
import { FindEntiresDto } from '../dto/find-entry.dto';
import { EntryEntity } from '../entity/entry.entity';
import { EntryType } from '../interface/ledger.interface';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(EntryEntity)
    private entryRepository: Repository<EntryEntity>,
  ) {}

  async createTransferEntries(
    fromLedger,
    toLedger,
    amount,
    currency,
  ): Promise<IServiceResponse<EntryEntity[]>> {
    const entries = [
      this.entryRepository.create({
        ledger: fromLedger,
        amount,
        type: EntryType.CREDIT,
        currency,
      }),
      this.entryRepository.create({
        ledger: toLedger,
        amount,
        type: EntryType.DEBIT,
        currency,
      }),
    ];
    await this.entryRepository.save(entries);
    return {
      state: true,
      data: entries,
    };
  }

  async findEntries(
    { limit, page, type, currency }: FindEntiresDto,
    user: UserEntity,
  ): Promise<IServiceResponse<IPagination<EntryEntity>>> {
    const where = [
      type ? { type } : null,
      currency ? { currency } : null,
      { ledger: { user: { id: user.id } } },
    ];
    const entries = await this.entryRepository.find({
      relations: ['ledger.user'],
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    const entiresCount = await this.entryRepository.count({ where });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: entries,
        total: Math.ceil(entiresCount / limit),
      },
    };
  }
}
