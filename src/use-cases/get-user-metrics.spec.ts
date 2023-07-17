import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInRepository: InMemoryCheckinsRepository;
let sut: GetUserMetricsUseCase;

describe('Get user metrics', async () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckinsRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
  });
  it('should be able to get check-ins count', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { checkInsCount } = await sut.execute({ userId: 'user-01' });

    expect(checkInsCount).toEqual(2);
  });
});
