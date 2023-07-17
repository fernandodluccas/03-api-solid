import { Prisma, Checkin } from '@prisma/client';
import { CheckinsRepository } from '../check-ins-repository';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

export class InMemoryCheckinsRepository implements CheckinsRepository {
  public items: Checkin[] = [];

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<Checkin | null> {
    const startOfDay = dayjs(date).startOf('day');
    const endOfDay = dayjs(date).endOf('day');

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);

      const isOnSameDate =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async findManyByUserId(userId: string, page: number): Promise<Checkin[]> {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((checkIn) => checkIn.user_id === userId).length;
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
