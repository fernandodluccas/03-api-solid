import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchUserCheckInsHistoryCase } from './fetch-user-check-ins.history';

let checkInRepository: InMemoryCheckinsRepository;
let sut: FetchUserCheckInsHistoryCase;

describe('Fetch user check-ins history', async () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckinsRepository();
    sut = new FetchUserCheckInsHistoryCase(checkInRepository);
  });

  it('should be able to fetch user check-ins history', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-01',
      }),
      expect.objectContaining({
        gym_id: 'gym-02',
      }),
    ]);
  });

  it('should be able to fetch paginated user check-ins history', async () => {
    for (let i = 0; i < 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      });
    }

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 });
  });
});
