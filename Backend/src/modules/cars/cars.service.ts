import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car, Expense, Issue, IssueStatus, DriveFolders } from '@/database/entities';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto, UpdateOdometerDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
    @InjectRepository(DriveFolders)
    private driveFoldersRepository: Repository<DriveFolders>,
  ) {}

  async create(createCarDto: CreateCarDto, ownerId: string): Promise<Car> {
    // Create car entity
    const car = this.carsRepository.create({
      ...createCarDto,
      ownerId,
      currentOdometerKm: createCarDto.currentOdometerKm || 0,
    });

    const savedCar = await this.carsRepository.save(car);

    // Create stub Drive folders entry (will be populated in Phase 2)
    const driveFolders = this.driveFoldersRepository.create({
      carId: savedCar.id,
      isSetup: false,
    });
    await this.driveFoldersRepository.save(driveFolders);

    return savedCar;
  }

  async findAll(ownerId: string): Promise<any[]> {
    const cars = await this.carsRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });

    // Get stats for each car
    const carsWithStats = await Promise.all(
      cars.map(async (car) => {
        const stats = await this.getCarStats(car.id);
        return this.formatCarResponse(car, stats);
      }),
    );

    return carsWithStats;
  }

  async findOne(id: string, ownerId: string): Promise<any> {
    const car = await this.carsRepository.findOne({
      where: { id, ownerId },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    const stats = await this.getCarStats(id);
    return this.formatCarResponse(car, stats);
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
    ownerId: string,
  ): Promise<any> {
    const car = await this.carsRepository.findOne({
      where: { id, ownerId },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    Object.assign(car, updateCarDto);
    const updatedCar = await this.carsRepository.save(car);

    const stats = await this.getCarStats(id);
    return this.formatCarResponse(updatedCar, stats);
  }

  async updateOdometer(
    id: string,
    updateOdometerDto: UpdateOdometerDto,
    ownerId: string,
  ): Promise<any> {
    const car = await this.carsRepository.findOne({
      where: { id, ownerId },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    car.currentOdometerKm = updateOdometerDto.currentOdometerKm;
    const updatedCar = await this.carsRepository.save(car);

    const stats = await this.getCarStats(id);
    return this.formatCarResponse(updatedCar, stats);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const car = await this.carsRepository.findOne({
      where: { id, ownerId },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    await this.carsRepository.remove(car);
  }

  private async getCarStats(carId: string) {
    // Calculate total expenses
    const expensesResult = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.carId = :carId', { carId })
      .getRawOne();

    // Count open issues
    const openIssuesCount = await this.issuesRepository.count({
      where: { carId, status: IssueStatus.OPEN },
    });

    // Get last maintenance date
    const lastExpense = await this.expensesRepository.findOne({
      where: { carId },
      order: { date: 'DESC' },
    });

    return {
      totalExpenses: expensesResult?.total || 0,
      openIssues: openIssuesCount,
      lastMaintenance: lastExpense?.date || null,
    };
  }

  private formatCarResponse(car: Car, stats: any) {
    return {
      id: car.id,
      manufacturer: car.manufacturer,
      model: car.model,
      year: car.year,
      engine: car.engine,
      transmission: car.transmission,
      nickname: car.nickname,
      driveStatus: 'disconnected', // TODO: Phase 2 - check actual Drive sync status
      km: car.currentOdometerKm.toLocaleString('he-IL') + ' ק״מ',
      stats: {
        totalExpenses: parseFloat(stats.totalExpenses.toFixed(2)),
        openIssues: stats.openIssues,
        lastMaintenance: stats.lastMaintenance,
      },
    };
  }
}
