import { Prisma, Checkin } from '@prisma/client';

export interface CheckinsRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
}
