import { Injectable } from '@nestjs/common';
import { IServiceResponse } from '@app/rabbit';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload, IJwtToken } from '@app/token';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async create(payload: IJwtPayload): Promise<IServiceResponse<IJwtToken>> {
    const token = await this.jwtService.signAsync(payload);
    return {
      state: !!token,
      data: { token },
    };
  }

  async validate({ token }: IJwtToken): Promise<IServiceResponse<boolean>> {
    let isValid: boolean;

    await this.jwtService
      .verifyAsync(token)
      .then(() => {
        isValid = true;
      })
      .catch(() => {
        isValid = false;
      });

    return {
      state: isValid,
      data: isValid,
    };
  }
}
