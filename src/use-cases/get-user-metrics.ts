import { Checkin } from '@prisma/client';
import { CheckinsRepository } from '@/repositories/check-ins-repository';

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private readonly checkinsRepository: CheckinsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkinsRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
