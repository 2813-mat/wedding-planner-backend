// src/auth/auth.controller.ts (gere com nest g controller auth)
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sync-user')
  async syncUser(@Request() req) {
    // req.user vem da JwtStrategy validate()
    const user = await this.authService.upsertUserFromAuth0(req.user);
    return {
      message: 'Usuário sincronizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
