export class Price {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Price cannot be negative');
    }
    if (!Number.isFinite(value)) {
      throw new Error('Price must be a finite number');
    }
    // Round to 2 decimal places to avoid floating point precision issues
    this.value = Math.round(value * 100) / 100;
  }

  getValue(): number {
    return this.value;
  }

  add(other: Price): Price {
    return new Price(this.value + other.value);
  }

  multiply(quantity: number): Price {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    return new Price(this.value * quantity);
  }

  applyDiscount(percentage: number): Price {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    const discountAmount = (this.value * percentage) / 100;
    return new Price(this.value - discountAmount);
  }

  isGreaterThan(other: Price): boolean {
    return this.value > other.value;
  }

  isLessThan(other: Price): boolean {
    return this.value < other.value;
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return `$${this.value.toFixed(2)}`;
  }
}