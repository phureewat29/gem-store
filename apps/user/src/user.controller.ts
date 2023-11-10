import { Controller } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TokenService } from './service/token.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from './constant/user-patterns.constant';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IServiceResponse } from '@app/rabbit';
import { IPagination, PaginationDto } from '@app/common';
import { IJwtPayload, IJwtToken } from '@app/token';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.CREATE)
  async createUser(
    @Payload() createDto: CreateUserDto,
  ): Promise<IServiceResponse<UserEntity>> {
    return await this.userService.create(createDto);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_ALL)
  async getUsers(
    @Payload() paginationDto: PaginationDto,
  ): Promise<IServiceResponse<IPagination<UserEntity>>> {
    return await this.userService.findAll(paginationDto);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_BY_ID)
  async getUserById(
    @Payload() id: string,
  ): Promise<IServiceResponse<UserEntity>> {
    return await this.userService.findById(id);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_BY_EMAIL)
  async getUserByEmail(
    @Payload() email: string,
  ): Promise<IServiceResponse<UserEntity>> {
    return await this.userService.findByEmail(email);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.CREATE_TOKEN)
  async createToken(
    @Payload() payload: IJwtPayload,
  ): Promise<IServiceResponse<IJwtToken>> {
    return await this.tokenService.create(payload);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.VALIDATE_TOKEN)
  async validateToken(
    @Payload() token: IJwtToken,
  ): Promise<IServiceResponse<boolean>> {
    return await this.tokenService.validate(token);
  }
}
