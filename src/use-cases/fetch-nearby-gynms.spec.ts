import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch user check-ins history', async () => {
    await gymsRepository.create({
      title: 'Nearby gym',
      description: 'gym-01',
      phone: 'gym-01',
      latitude: -3.743673,
      longitude: -38.535736,
    });

    await gymsRepository.create({
      title: 'Far away gym',
      description: 'gym-02',
      phone: 'gym-02',
      latitude: -3.743673,
      longitude: -38.535736,
    });

    const { gyms } = await sut.execute({
      userLatitude: -3.743673,
      userLongitude: -38.535736,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'gym-01',
      }),
      expect.objectContaining({
        title: 'gym-02',
      }),
    ]);
  });

  //teste de paginação
  it('shoud be able to fetch paginated gyms', async () => {
    for (let i = 0; i < 22; i++) {
      await gymsRepository.create({
        title: `gym-${i}`,
        description: `gym-${i}`,
        phone: `gym-${i}`,
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({ userLatitude: 0, userLongitude: 0 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'gym-20',
      }),
      expect.objectContaining({
        title: 'gym-21',
      }),
    ]);
  });
});
