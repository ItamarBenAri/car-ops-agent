import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder, ReminderType, ReminderStatus } from '@/database/entities';

// Category → { intervalKm, intervalDays } maintenance schedule
const CATEGORY_INTERVALS: Record<string, { intervalKm?: number; intervalDays?: number }> = {
  'שמן ומסננים': { intervalKm: 10000, intervalDays: 365 },
  'צמיגים': { intervalKm: 40000, intervalDays: 730 },
  'בלמים': { intervalKm: 30000, intervalDays: 730 },
  'תחזוקה שוטפת': { intervalKm: 15000, intervalDays: 365 },
  'מבחן רכב': { intervalDays: 365 },
  'אבחון': { intervalDays: 180 },
};

const CATEGORY_TITLES: Record<string, string> = {
  'שמן ומסננים': 'החלפת שמן ומסנן',
  'צמיגים': 'בדיקת/החלפת צמיגים',
  'בלמים': 'בדיקת בלמים',
  'תחזוקה שוטפת': 'טיפול תקופתי',
  'מבחן רכב': 'טסט רכב',
  'אבחון': 'אבחון רכב',
};

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: Repository<Reminder>,
  ) {}

  async findByCarId(carId: string): Promise<Reminder[]> {
    const reminders = await this.remindersRepository.find({
      where: { carId },
      order: { dueDate: 'ASC' },
    });

    // Update statuses based on current date/odometer
    return reminders.map((r) => this.updateReminderStatus(r));
  }

  async findDueSoon(carId: string, currentOdometerKm?: number): Promise<Reminder[]> {
    const reminders = await this.findByCarId(carId);
    return reminders.filter(
      (r) =>
        r.status === ReminderStatus.DUE_SOON || r.status === ReminderStatus.OVERDUE,
    );
  }

  /**
   * Auto-create reminder after an expense is saved.
   * Called by the document processing processor after parsing a receipt.
   */
  async autoCreateFromExpense(
    carId: string,
    category: string,
    currentOdometerKm?: number,
  ): Promise<Reminder | null> {
    const intervals = CATEGORY_INTERVALS[category];
    if (!intervals) {
      this.logger.log(`No reminder interval defined for category: ${category}`);
      return null;
    }

    const title = CATEGORY_TITLES[category] || category;

    // Check if an active reminder already exists for this category
    const existing = await this.remindersRepository.findOne({
      where: {
        carId,
        title,
        status: ReminderStatus.PENDING,
      },
    });

    if (existing) {
      this.logger.log(`Reminder already exists for ${category} on car ${carId}`);
      return existing;
    }

    const now = new Date();
    const reminder = this.remindersRepository.create({
      carId,
      title,
      description: `תזכורת אוטומטית על בסיס קבלה: ${category}`,
      lastCompletedDate: now,
      lastCompletedOdometerKm: currentOdometerKm || null,
      status: ReminderStatus.PENDING,
    });

    // Set odometer-based fields
    if (intervals.intervalKm && currentOdometerKm) {
      reminder.type = ReminderType.ODOMETER_BASED;
      reminder.intervalKm = intervals.intervalKm;
      reminder.dueOdometerKm = currentOdometerKm + intervals.intervalKm;
      reminder.alertThresholdKm = Math.floor(intervals.intervalKm * 0.1); // Alert at 10% before due
    }

    // Set time-based fields (always set date as fallback)
    if (intervals.intervalDays) {
      if (!intervals.intervalKm) {
        reminder.type = ReminderType.TIME_BASED;
      }
      reminder.intervalDays = intervals.intervalDays;
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + intervals.intervalDays);
      reminder.dueDate = dueDate;
      reminder.alertThresholdDays = Math.floor(intervals.intervalDays * 0.1); // Alert at 10% before due
    }

    const saved = await this.remindersRepository.save(reminder);
    this.logger.log(`Created reminder "${title}" for car ${carId}`);
    return saved;
  }

  async markCompleted(id: string, currentOdometerKm?: number): Promise<Reminder> {
    const reminder = await this.remindersRepository.findOneOrFail({ where: { id } });

    const now = new Date();
    reminder.lastCompletedDate = now;
    reminder.lastCompletedOdometerKm = currentOdometerKm || reminder.lastCompletedOdometerKm;
    reminder.status = ReminderStatus.COMPLETED;

    // Schedule next occurrence
    if (reminder.intervalDays) {
      const nextDue = new Date(now);
      nextDue.setDate(nextDue.getDate() + reminder.intervalDays);
      reminder.dueDate = nextDue;
      reminder.status = ReminderStatus.PENDING;
    }

    if (reminder.intervalKm && currentOdometerKm) {
      reminder.dueOdometerKm = currentOdometerKm + reminder.intervalKm;
      reminder.lastCompletedOdometerKm = currentOdometerKm;
      reminder.status = ReminderStatus.PENDING;
    }

    return await this.remindersRepository.save(reminder);
  }

  private updateReminderStatus(reminder: Reminder): Reminder {
    const now = new Date();

    if (reminder.status === ReminderStatus.COMPLETED) {
      return reminder;
    }

    if (reminder.dueDate) {
      const msUntilDue = reminder.dueDate.getTime() - now.getTime();
      const daysUntilDue = Math.floor(msUntilDue / (1000 * 60 * 60 * 24));

      if (daysUntilDue < 0) {
        reminder.status = ReminderStatus.OVERDUE;
      } else if (daysUntilDue <= (reminder.alertThresholdDays || 7)) {
        reminder.status = ReminderStatus.DUE_SOON;
      }
    }

    return reminder;
  }
}