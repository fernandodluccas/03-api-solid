import { Checkin } from '@prisma/client';
import { CheckinsRepository } from '@/repositories/check-ins-repository';

interface FetchUserCheckInsHistoryCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryCaseResponse {
  checkIns: Checkin[];
}

export class FetchUserCheckInsHistoryCase {
  constructor(private readonly checkinsRepository: CheckinsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryCaseRequest): Promise<FetchUserCheckInsHistoryCaseResponse> {
    const checkIns = await this.checkinsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkIns,
    };
  }
}
