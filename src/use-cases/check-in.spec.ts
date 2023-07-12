import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckinUseCase } from './check-in';
import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkinRepository: InMemoryCheckinsRepository;
let sut: CheckinUseCase;

describe('Check-in use case', () => {
  beforeEach(() => {
    checkinRepository = new InMemoryCheckinsRepository();
    sut = new CheckinUseCase(checkinRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to create a new check-in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should be able to check-in again', async () => {
    vi.setSystemTime(new Date(2023, 6, 12, 8, 0, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check-in again on a different day', async () => {
    vi.setSystemTime(new Date(2023, 6, 12, 8, 0, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    });

    vi.setSystemTime(new Date(2023, 6, 13, 8, 0, 0, 0));

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
