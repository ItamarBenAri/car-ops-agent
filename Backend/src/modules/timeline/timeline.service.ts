import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense, MaintenanceEvent, Issue } from '@/database/entities';
import { QueryTimelineDto } from './dto/query-timeline.dto';

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  km: string;
  vendor: string;
  amount: string;
  category: string;
  type: 'receipt' | 'issue' | 'maintenance';
  documentLink?: string;
}

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @InjectRepository(MaintenanceEvent)
    private maintenanceRepository: Repository<MaintenanceEvent>,
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
  ) {}

  async getTimeline(query: QueryTimelineDto, userId: string): Promise<TimelineEvent[]> {
    const events: TimelineEvent[] = [];

    // Fetch expenses (receipts)
    if (!query.type || query.type === 'receipt') {
      const expenses = await this.fetchExpenses(query, userId);
      events.push(...expenses);
    }

    // Fetch maintenance events
    if (!query.type || query.type === 'maintenance') {
      const maintenance = await this.fetchMaintenance(query, userId);
      events.push(...maintenance);
    }

    // Fetch issues
    if (!query.type || query.type === 'issue') {
      const issues = await this.fetchIssues(query, userId);
      events.push(...issues);
    }

    // Sort by date (newest first)
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return events;
  }

  private async fetchExpenses(
    query: QueryTimelineDto,
    userId: string,
  ): Promise<TimelineEvent[]> {
    const queryBuilder = this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.car', 'car')
      .where('car.ownerId = :userId', { userId });

    // Apply filters
    if (query.carId && query.carId !== 'all') {
      queryBuilder.andWhere('expense.carId = :carId', { carId: query.carId });
    }

    if (query.fromDate) {
      queryBuilder.andWhere('expense.date >= :fromDate', {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      queryBuilder.andWhere('expense.date <= :toDate', { toDate: query.toDate });
    }

    if (query.category) {
      queryBuilder.andWhere('expense.category = :category', {
        category: query.category,
      });
    }

    const expenses = await queryBuilder.getMany();

    return expenses.map((expense) => ({
      id: expense.id,
      title: `קבלה - ${expense.vendor}`,
      date: new Date(expense.date).toISOString(),
      km: expense.odometerKm
        ? Number(expense.odometerKm).toLocaleString('he-IL') + ' ק״מ'
        : '-',
      vendor: expense.vendor,
      amount: `₪${Number(expense.amount).toLocaleString('he-IL')}`,
      category: expense.category,
      type: 'receipt' as const,
      documentLink: expense.documentId || undefined,
    }));
  }

  private async fetchMaintenance(
    query: QueryTimelineDto,
    userId: string,
  ): Promise<TimelineEvent[]> {
    const queryBuilder = this.maintenanceRepository
      .createQueryBuilder('maintenance')
      .leftJoinAndSelect('maintenance.car', 'car')
      .where('car.ownerId = :userId', { userId });

    // Apply filters
    if (query.carId && query.carId !== 'all') {
      queryBuilder.andWhere('maintenance.carId = :carId', { carId: query.carId });
    }

    if (query.fromDate) {
      queryBuilder.andWhere('maintenance.date >= :fromDate', {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      queryBuilder.andWhere('maintenance.date <= :toDate', {
        toDate: query.toDate,
      });
    }

    if (query.category) {
      queryBuilder.andWhere('maintenance.category = :category', {
        category: query.category,
      });
    }

    const maintenanceEvents = await queryBuilder.getMany();

    return maintenanceEvents.map((event) => ({
      id: event.id,
      title: event.title,
      date: new Date(event.date).toISOString(),
      km: event.odometerKm
        ? Number(event.odometerKm).toLocaleString('he-IL') + ' ק״מ'
        : '-',
      vendor: event.vendor || '-',
      amount: event.cost ? `₪${Number(event.cost).toLocaleString('he-IL')}` : '-',
      category: event.category,
      type: 'maintenance' as const,
      documentLink: event.documentId || undefined,
    }));
  }

  private async fetchIssues(
    query: QueryTimelineDto,
    userId: string,
  ): Promise<TimelineEvent[]> {
    const queryBuilder = this.issuesRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.car', 'car')
      .where('car.ownerId = :userId', { userId });

    // Apply filters
    if (query.carId && query.carId !== 'all') {
      queryBuilder.andWhere('issue.carId = :carId', { carId: query.carId });
    }

    if (query.fromDate) {
      queryBuilder.andWhere('issue.reportedDate >= :fromDate', {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      queryBuilder.andWhere('issue.reportedDate <= :toDate', {
        toDate: query.toDate,
      });
    }

    // Issues don't have category, so skip category filter

    const issues = await queryBuilder.getMany();

    return issues.map((issue) => ({
      id: issue.id,
      title: `תקלה - ${issue.title}`,
      date: new Date(issue.reportedDate).toISOString(),
      km: issue.odometerKm
        ? Number(issue.odometerKm).toLocaleString('he-IL') + ' ק״מ'
        : '-',
      vendor: '-',
      amount: '-',
      category: `חומרה: ${issue.severity}`,
      type: 'issue' as const,
      documentLink: issue.documentId || undefined,
    }));
  }
}
