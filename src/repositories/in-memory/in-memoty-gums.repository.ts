import { Gym } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';

export class InMemeoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const user = this.items.find((gym) => gym.id === id);

    if (!user) {
      return null;
    }

    return user;
  }
}
