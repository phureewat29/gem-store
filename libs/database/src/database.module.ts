import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { LedgerEntity } from 'apps/ledger/src/entity/ledger.entity';
import { EntryEntity } from 'apps/ledger/src/entity/entry.entity';

export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [
            ConfigModule.forRoot({
              envFilePath: './.env',
            }),
          ],
          useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
            // @ts-ignore
            return {
              type: 'postgres',
              host: configService.get('POSTGRES_DB_HOST'),
              port: +configService.get('POSTGRES_DB_PORT'),
              database: configService.get('POSTGRES_DB_NAME'),
              username: configService.get('POSTGRES_DB_USERNAME'),
              password: configService.get<string>('POSTGRES_DB_PASSWORD'),
              entities: [UserEntity, LedgerEntity, EntryEntity],
              synchronize: configService.get('NODE_ENV') != 'production',
            };
          },
          inject: [ConfigService],
        }),
      ],
      exports: [TypeOrmModule],
    };
  }

  static forEntity(entities: EntityClassOrSchema[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forFeature(entities)],
      exports: [TypeOrmModule],
    };
  }
}
