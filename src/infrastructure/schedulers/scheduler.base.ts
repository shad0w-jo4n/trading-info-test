import cron, { ScheduledTask } from 'node-cron';

/**
 * Scheduler Base Class.
 */
export abstract class SchedulerBase {
  private readonly task: ScheduledTask;

  /**
   * Create scheduler and start.
   *
   * @param cronExpression
   */
  protected constructor(cronExpression: string) {
    this.task = cron.schedule(cronExpression, this.work.bind(this));
  }

  /**
   * Some job.
   *
   * @protected
   */
  protected abstract work(): Promise<void>;
}
