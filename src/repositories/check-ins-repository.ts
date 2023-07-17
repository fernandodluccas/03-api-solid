import { Prisma, Checkin } from '@prisma/client';

export interface CheckinsRepository {
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>;
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>;
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
}
