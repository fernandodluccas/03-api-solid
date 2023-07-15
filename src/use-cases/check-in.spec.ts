import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckinUseCase } from './check-in';
import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository';

let checkinRepository: InMemoryCheckinsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinUseCase;

describe('Check-in use case', () => {
  beforeEach(() => {
    checkinRepository = new InMemoryCheckinsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckinUseCase(checkinRepository, gymsRepository);

    gymsRepository.items.push({
      id: 'gym-1',
      title: 'Gym 1',
      description: 'Gym 1 description',
      phone: '88888888888',
      latitude: new Decimal(-3.8371328),
      longitude: new Decimal(-38.5220608),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -3.8371328,
      userLongitude: -38.5220608,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should be able to check-in again', async () => {
    vi.setSystemTime(new Date(2023, 6, 12, 8, 0, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -3.8371328,
      userLongitude: -38.5220608,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitude: -3.8371328,
        userLongitude: -38.5220608,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check-in again on a different day', async () => {
    vi.setSystemTime(new Date(2023, 6, 12, 8, 0, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -3.8371328,
      userLongitude: -38.5220608,
    });

    vi.setSystemTime(new Date(2023, 6, 13, 8, 0, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -3.8371328,
      userLongitude: -38.5220608,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should be able to check-in on a distance of 1km', async () => {
    gymsRepository.items.push({
      id: 'gym-2',
      title: 'Gym 2',
      description: 'Gym 2 description',
      phone: '88888888888',
      latitude: new Decimal(-3.7573324),
      longitude: new Decimal(-38.4892899),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-2',
        userId: 'user-1',
        userLatitude: -3.8371328,
        userLongitude: -38.5220608,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
