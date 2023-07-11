import { Prisma, Checkin } from '@prisma/client';
import { CheckinsRepository } from '../check-ins-repository';
import { randomUUID } from 'crypto';

export class InMemoryCheckinsRepository implements CheckinsRepository {
  public items: Checkin[] = [];

  async create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
