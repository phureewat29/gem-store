import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '@app/authentication';
import { LedgerGatewayController } from './modules/ledger/ledger-gateway.controller';
import { UserGatewayController } from './modules/user/user-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env',
    }),
    RabbitModule.forClientProxy(RabbitServiceName.USER),
    RabbitModule.forClientProxy(RabbitServiceName.LEDGER),
    AuthenticationModule.register(),
  ],
  controllers: [UserGatewayController, LedgerGatewayController],
})
export class GatewayModule {}
