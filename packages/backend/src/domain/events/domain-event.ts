export interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  occurredOn: Date;
  eventVersion: number;
}

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly aggregateId: string;
  public readonly occurredOn: Date;
  public readonly eventVersion: number;

  constructor(aggregateId: string, eventVersion: number = 1) {
    this.eventId = this.generateEventId();
    this.eventType = this.getEventType();
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
    this.eventVersion = eventVersion;
  }

  private generateEventId(): string {
    return `${this.getEventType()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected abstract getEventType(): string;
}