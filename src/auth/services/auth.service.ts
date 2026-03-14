import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertUserFromAuth0(auth0Payload: any): Promise<User> {
    const { sub, email, name } = auth0Payload;

    if (!sub) {
      throw new UnauthorizedException('ID do provedor ausente no token');
    }

    if (!email) {
      throw new UnauthorizedException('Email ausente no perfil do usuário');
    }

    const provider = sub.includes('|') ? sub.split('|')[0] : 'auth0';
    const providerId = sub;

    try {
      let user = await this.prisma.user.findUnique({ where: { providerId } });

      if (!user) {
        user = await this.prisma.user.findUnique({ where: { email } });
      }

      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            email,
            fullName: name || email.split('@')[0],
            provider,
            providerId,
            updatedAt: new Date(),
          },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            email,
            fullName: name || email.split('@')[0],
            provider,
            providerId,
            role: 'noivo',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      await this.prisma.weddingUser.upsert({
        where: {
          weddingId_userId: {
            weddingId: BigInt(1),
            userId: user.id,
          },
        },
        update: {},
        create: {
          weddingId: BigInt(1),
          userId: user.id,
          isOwner: true,
          canEdit: true,
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

  async findUserByProviderId(providerId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { providerId },
    });
  }

  async updateUserRole(
    userId: bigint,
    newRole: 'noivo' | 'convidado' | 'admin',
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  getUserIdFromPayload(payload: any): string {
    return payload.sub;
  }
}
