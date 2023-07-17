import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchUserCheckInsHistoryCase } from './fetch-user-check-ins.history';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository';
import { SearchGymUseCase } from './search-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search gyms', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it('should be able to fetch user check-ins history', async () => {
    await gymsRepository.create({
      title: 'gym-01',
      description: 'gym-01',
      phone: 'gym-01',
      latitude: 0,
      longitude: 0,
    });

    await gymsRepository.create({
      title: 'gym-02',
      description: 'gym-02',
      phone: 'gym-02',
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({ query: 'gym', page: 1 });

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
  it("shoud be able to fetch paginated gyms", async () => {

    for(let i = 0; i < 22; i++) {
      await gymsRepository.create({
        title: `gym-${i}`,
        description: `gym-${i}`,
        phone: `gym-${i}`,
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({ query: 'gym', page: 2 });

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
