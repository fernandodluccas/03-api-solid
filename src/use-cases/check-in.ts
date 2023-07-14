import { Checkin } from '@prisma/client';
import { CheckinsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-two-coordinates';

interface CheckinUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckinUseCaseResponse {
  checkin: Checkin;
}

export class CheckinUseCase {
  constructor(
    private readonly checkinsRepository: CheckinsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckinUseCaseRequest) {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const MAX_DISTANCE_IN_KM = 1;

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new Error('You are too far from the gym');
    }

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
