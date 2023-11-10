import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import { ClientProxy } from '@nestjs/microservices';
import { IPagination, PaginationDto } from '@app/common';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateLedgerDto } from 'apps/ledger/src/dto/create-ledger.dto';
import { LedgerEntity } from 'apps/ledger/src/entity/ledger.entity';
import { LEDGER_MESSAGE_PATTERNS } from 'apps/ledger/src/constant/ledger-patterns.dto';
import { Currency } from 'apps/ledger/src/interface/ledger.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(RabbitServiceName.LEDGER) private ledgerClient: ClientProxy,
  ) {}

  async create(
    createDto: CreateUserDto,
  ): Promise<IServiceResponse<UserEntity>> {
    const existRequest = await this.userRepository.findOneBy({
      email: createDto.email,
    });
    if (existRequest) {
      return {
        state: false,
        data: existRequest,
      };
    } else {
      let user = this.userRepository.create(createDto);
      user = await this.userRepository.save(user);
      await firstValueFrom(
        this.ledgerClient.send<
          IServiceResponse<LedgerEntity>,
          { createLedgerDto: CreateLedgerDto; user: UserEntity }
        >(LEDGER_MESSAGE_PATTERNS.CREATE, {
          createLedgerDto: { currency: Currency.GEM, initialBalance: 100 },
          user,
        }),
      );

      return {
        state: true,
        data: user,
      };
    }
  }

  async findAll({
    limit,
    page,
  }: PaginationDto): Promise<IServiceResponse<IPagination<UserEntity>>> {
    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit - 1,
    });
    const usersCount = await this.userRepository.count();
    return {
      state: true,
      data: {
        items: users,
        limit: limit,
        page: page,
        total: usersCount,
      },
    };
  }

  async findById(id: string): Promise<IServiceResponse<UserEntity>> {
    const user = await this.userRepository
      .createQueryBuilder('row')
      .select(['row.id', 'row.email'])
      .where('row.id = :id', { id })
      .getOne();

    return {
      state: !!user,
      data: user,
    };
  }

  async findByEmail(email: string): Promise<IServiceResponse<UserEntity>> {
    const user = await this.userRepository
      .createQueryBuilder('row')
      .select(['row.password', 'row.id', 'row.email'])
      .where('row.email = :email', { email })
      .getOne();

    return {
      state: !!user,
      data: user,
    };
  }
}
