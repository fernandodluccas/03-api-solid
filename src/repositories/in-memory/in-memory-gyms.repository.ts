import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-two-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const user = this.items.find((gym) => gym.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findManyNearby(params: { latitude: number; longitude: number }) {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        }
      );

      return distance <= 10;
    });
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }
}
