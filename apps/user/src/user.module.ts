import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './service/user.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { UserEntity } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { TokenService } from './service/token.service';
import { TokenModule } from '@app/token';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
    }),
    DatabaseModule.register(),
    DatabaseModule.forEntity([UserEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.USER),
    RabbitModule.forClientProxy(RabbitServiceName.LEDGER),
    TokenModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService],
})
export class UserModule {}
