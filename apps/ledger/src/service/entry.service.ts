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

  async buildTransferEntries(
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

    return {
      state: true,
      data: entries,
    };
  }

  async findEntries(
    { limit, page, type, currency }: FindEntiresDto,
    user: UserEntity,
  ): Promise<IServiceResponse<IPagination<EntryEntity>>> {
    const query = this.entryRepository
      .createQueryBuilder('entries')
      .leftJoin('entries.ledger', 'ledger')
      .where([type ? { type } : null, currency ? { currency } : null])
      .andWhere('ledger.userId = :userId', { userId: user.id })
      .skip((page - 1) * limit)
      .take(limit);

    const entries = await query.execute();
    const entiresCount = await query.getCount();

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
