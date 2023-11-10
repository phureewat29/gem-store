import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import {
  Body,
  ConflictException,
  Controller,
  Inject,
  Post,
  Get,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { Auth, CurrentUser } from '@app/authentication';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
import { LoginDto } from 'apps/user/src/dto/login.dto';
import { firstValueFrom } from 'rxjs';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { USER_MESSAGE_PATTERNS } from 'apps/user/src/constant/user-patterns.constant';
import { IJwtPayload, IJwtToken } from '@app/token';

@ApiTags('User Gateway')
@Controller({ path: '/users' })
export class UserGatewayController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClient: ClientProxy,
  ) {}

  @Post('/register')
  async register(@Body() createDto: CreateUserDto): Promise<IGatewayResponse> {
    const { state, data, message } = await firstValueFrom(
      this.userClient.send<IServiceResponse<UserEntity>>(
        USER_MESSAGE_PATTERNS.CREATE,
        createDto,
      ),
    );
    if (state) {
      return {
        state,
        data,
      };
    } else {
      throw new ConflictException(message);
    }
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<IGatewayResponse<IJwtToken>> {
    const {
      state,
      data: user,
      message,
    } = await firstValueFrom(
      this.userClient.send<IServiceResponse<UserEntity>, string>(
        USER_MESSAGE_PATTERNS.FIND_BY_EMAIL,
        loginDto.email,
      ),
    );

    if (state && user && bcrypt.compare(loginDto.password, user.password)) {
      const {
        state,
        data: jwtToken,
        message,
      } = await firstValueFrom(
        this.userClient.send<IServiceResponse<IJwtToken>, IJwtPayload>(
          USER_MESSAGE_PATTERNS.CREATE_TOKEN,
          { id: user.id, email: user.email },
        ),
      );

      return {
        state,
        data: jwtToken,
        message,
      };
    } else {
      throw new ConflictException(message);
    }
  }

  @Get('/me')
  @Auth()
  async me(
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<UserEntity>> {
    return {
      state: true,
      data: user,
    };
  }
}
