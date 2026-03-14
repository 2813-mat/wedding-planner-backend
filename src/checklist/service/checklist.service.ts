import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChecklistItemDto } from '../dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from '../dto/update-checklist-item.dto';

const PERIOD_DESCRIPTIONS: Record<string, string> = {
  '12+ meses antes': 'Planejamento inicial',
  '9-12 meses antes': 'Reservas importantes',
  '6-9 meses antes': 'Detalhes do evento',
  '3-6 meses antes': 'Preparativos finais',
  '1-3 meses antes': 'Últimos detalhes',
  '1 mês antes': 'Semana final',
};

const PERIOD_ORDER = Object.keys(PERIOD_DESCRIPTIONS);

@Injectable()
export class ChecklistService {
  constructor(private prisma: PrismaService) {}

  private mapTask(item: any) {
    return {
      id: item.id,
      weddingId: item.weddingId,
      title: item.title,
      completed: item.completedAt !== null,
      category: item.category ?? '',
      period: item.period,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async listGrouped(weddingId: bigint) {
    const items = await this.prisma.checklistItem.findMany({
      where: { weddingId },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = new Map<string, any[]>();
    for (const item of items) {
      const period = item.period;
      if (!grouped.has(period)) grouped.set(period, []);
      grouped.get(period)!.push(this.mapTask(item));
    }

    const knownPeriods = PERIOD_ORDER.filter((p) => grouped.has(p));
    const unknownPeriods = [...grouped.keys()].filter(
      (p) => !PERIOD_ORDER.includes(p),
    );

    return [...knownPeriods, ...unknownPeriods].map((period) => ({
      period,
      description: PERIOD_DESCRIPTIONS[period] ?? '',
      tasks: grouped.get(period)!,
    }));
  }

  async createTask(dto: CreateChecklistItemDto, weddingId: bigint) {
    const item = await this.prisma.checklistItem.create({
      data: {
        weddingId,
        title: dto.title,
        category: dto.category,
        period: dto.period,
        completedAt: dto.completed ? new Date() : null,
      },
    });
    return this.mapTask(item);
  }

  async updateTask(id: string, dto: UpdateChecklistItemDto, weddingId: bigint) {
    const existing = await this.prisma.checklistItem.findFirst({
      where: { id: BigInt(id), weddingId },
    });
    if (!existing) throw new NotFoundException('Checklist task not found');

    const item = await this.prisma.checklistItem.update({
      where: { id: BigInt(id) },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.period !== undefined && { period: dto.period }),
        ...(dto.completed !== undefined && {
          completedAt: dto.completed ? new Date() : null,
        }),
      },
    });
    return this.mapTask(item);
  }

  async deleteTask(id: string, weddingId: bigint) {
    const existing = await this.prisma.checklistItem.findFirst({
      where: { id: BigInt(id), weddingId },
    });
    if (!existing) throw new NotFoundException('Checklist task not found');

    await this.prisma.checklistItem.delete({ where: { id: BigInt(id) } });
  }
}
