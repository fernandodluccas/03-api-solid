import { expect, describe, it, beforeEach } from 'vitest';
import { CheckinUseCase } from './check-in';
import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkinRepository: InMemoryCheckinsRepository;
let sut: CheckinUseCase;

describe('Check-in use case', () => {
  beforeEach(() => {
    checkinRepository = new InMemoryCheckinsRepository();
    sut = new CheckinUseCase(checkinRepository);
  });

  it('should be able to create a new check-in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
