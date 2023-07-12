import { Prisma, Checkin } from '@prisma/client';
import { CheckinsRepository } from '../check-ins-repository';
import { randomUUID } from 'crypto';

export class InMemoryCheckinsRepository implements CheckinsRepository {
  public items: Checkin[] = [];

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<Checkin | null> {
    const checkIn = this.items.find(
      (checkIn) =>
        checkIn.user_id === userId &&
        checkIn.created_at.getDate() === date.getDate() &&
        checkIn.created_at.getMonth() === date.getMonth() &&
        checkIn.created_at.getFullYear() === date.getFullYear()
    );

    if (!checkIn) return null;
    
    return checkIn;
  }

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
