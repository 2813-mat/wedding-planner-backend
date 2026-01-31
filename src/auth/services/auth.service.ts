import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sincroniza ou cria o usuário no banco baseado nos dados do token Auth0.
   * Chame isso na primeira vez que o usuário loga (ex: após login no frontend).
   * @param auth0Payload - O payload validado do JWT (de req.user na strategy)
   * @returns O usuário do Prisma (criado ou atualizado)
   */
  async upsertUserFromAuth0(auth0Payload: any): Promise<User> {
    const { sub, email, name, picture } = auth0Payload;

    if (!sub || !email) {
      this.logger.warn('Payload Auth0 incompleto', { sub, email });
      throw new UnauthorizedException('Dados de autenticação inválidos');
    }

    // sub do Auth0 é algo como "auth0|123abc..." ou "google-oauth2|..."
    const provider = sub.includes('|') ? sub.split('|')[0] : 'auth0';
    const providerId = sub;

    try {
      const user = await this.prisma.user.upsert({
        where: {
          providerId, // @unique no schema
        },
        update: {
          email,
          fullName: name || email.split('@')[0], // fallback se name não vier
          // Opcional: atualizar picture se quiser salvar URL da foto do provedor
          // picture: picture,
          updatedAt: new Date(),
        },
        create: {
          email,
          fullName: name || email.split('@')[0],
          provider,
          providerId,
          role: 'noivo', // default para novos usuários (ajuste se quiser)
          // passwordHash: null, // já é null por default para SSO
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      this.logger.log(
        `Usuário sincronizado/criado: ${user.id} (${user.email})`,
      );
      return user;
    } catch (error) {
      this.logger.error('Erro ao upsert usuário', error);
      throw new Error('Falha ao sincronizar usuário com o banco');
    }
  }

  /**
   * Busca o usuário atual pelo providerId (sub do Auth0).
   * Útil em guards ou interceptors para injetar user no request.
   */
  async findUserByProviderId(providerId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { providerId },
    });
  }

  /**
   * Exemplo: método para atualizar role ou outros dados (admin actions)
   */
  async updateUserRole(
    userId: bigint,
    newRole: 'noivo' | 'convidado' | 'admin',
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  // Futuro: se quiser fallback local (email/senha)
  // async validateLocalUser(email: string, password: string): Promise<User | null> { ... }

  // Método auxiliar para extrair userId do payload (útil em controllers)
  getUserIdFromPayload(payload: any): string {
    return payload.sub;
  }
}
