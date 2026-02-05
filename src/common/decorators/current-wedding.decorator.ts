import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentWedding = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.weddingId;
  },
);
