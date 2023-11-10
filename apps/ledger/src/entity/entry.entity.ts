import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Currency, EntryType } from '../interface/ledger.interface';
import { LedgerEntity } from './ledger.entity';

@Entity({
  name: 'entry',
})
export class EntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EntryType,
  })
  type: EntryType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @ManyToOne(() => LedgerEntity, (ledger) => ledger.entries)
  ledger: LedgerEntity;

  @RelationId((entryEntity: EntryEntity) => entryEntity.ledger)
  ledgerId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
