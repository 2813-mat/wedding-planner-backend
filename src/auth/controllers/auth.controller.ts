import {
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('sync-user')
  async syncUser(@Request() req) {
    const accessToken = req.headers.authorization.split(' ')[1];

    const userInfoResponse = await axios.get(
      `https://${this.configService.get('AUTH0_DOMAIN')}/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const userInfo = userInfoResponse.data;

    console.log('UserInfo do Auth0:', userInfo);

    if (!userInfo.sub || !userInfo.email) {
      throw new UnauthorizedException('Dados essenciais ausentes no userinfo');
    }

    const user = await this.authService.upsertUserFromAuth0(userInfo);
    return {
      message: 'Usuário sincronizado com sucesso',
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
