import { UsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';
import { Checkin } from '@prisma/client';
import { CheckinsRepository } from '@/repositories/check-ins-repository';

interface CheckinUseCaseRequest {
  userId: string;
  gymId: string;
}

interface CheckinUseCaseResponse {
  checkin: Checkin;
}

export class CheckinUseCase {
  constructor(private readonly checkinsRepository: CheckinsRepository) {}

  async execute({ userId, gymId }: CheckinUseCaseRequest) {
    const checkInExists = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInExists) {
      throw new Error('Check-in already exists');
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
