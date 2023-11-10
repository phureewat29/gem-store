import { UserEntity } from 'apps/user/src/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from '../interface/ledger.interface';
import { EntryEntity } from './entry.entity';

@Entity({
  name: 'ledger',
})
export class LedgerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @ManyToOne(() => UserEntity, (user) => user.ledgers)
  user: UserEntity;

  @RelationId((ledgerEntity: LedgerEntity) => ledgerEntity.user)
  userId: string;

  @OneToMany(() => EntryEntity, (entryEntity) => entryEntity.ledger)
  entries: LedgerEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
