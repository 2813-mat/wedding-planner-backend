import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { WeddingsService } from 'src/weddings/service/weddings.service';

@Injectable()
export class WeddingContextInterceptor implements NestInterceptor {
  constructor(private readonly weddingsService: WeddingsService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const userId = request.user?.userId;

    if (!userId) {
      return next.handle();
    }

    const wedding = await this.weddingsService.findByUser(userId);

    if (!wedding) {
      throw new NotFoundException('Wedding not found for this user');
    }

    request.weddingId = wedding.id;
    request.wedding = wedding;

    return next.handle();
  }
}
