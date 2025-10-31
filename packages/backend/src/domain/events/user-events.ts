import { BaseDomainEvent } from './domain-event';

export class UserRegisteredEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {
    super(userId);
  }

  protected getEventType(): string {
    return 'UserRegistered';
  }
}

export class UserLoggedInEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly loginTime: Date
  ) {
    super(userId);
  }

  protected getEventType(): string {
    return 'UserLoggedIn';
  }
}

export class UserPasswordChangedEvent extends BaseDomainEvent {
  constructor(public readonly userId: string) {
    super(userId);
  }

  protected getEventType(): string {
    return 'UserPasswordChanged';
  }
}

export class UserProfileUpdatedEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly updatedFields: string[]
  ) {
    super(userId);
  }

  protected getEventType(): string {
    return 'UserProfileUpdated';
  }
}