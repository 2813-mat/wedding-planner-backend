import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ← Isso torna o PrismaService disponível em QUALQUER módulo sem precisar importar
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta para injeção
})
export class PrismaModule {}
