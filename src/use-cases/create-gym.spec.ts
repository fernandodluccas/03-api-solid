import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository';

describe('Create Gym Use Case', () => {
  let gymsRepository: InMemoryGymsRepository;
  let sut: CreateGymUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create a new gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia',
      description: 'Academia de musculação',
      phone: '123456789',
      latitude: 123.123,
      longitude: 123.123,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
