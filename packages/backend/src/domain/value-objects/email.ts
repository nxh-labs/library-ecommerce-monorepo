import { ValidationError } from '../errors';

export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new ValidationError('Invalid email format');
    }
    this.value = value.toLowerCase().trim();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}