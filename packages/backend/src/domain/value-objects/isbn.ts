export class ISBN {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValidISBN(value)) {
      throw new Error('Invalid ISBN format');
    }
    this.value = value.replace(/-/g, '').toUpperCase();
  }

  private isValidISBN(isbn: string): boolean {
    const cleanIsbn = isbn.replace(/-/g, '');
    if (cleanIsbn.length === 10) {
      return this.isValidISBN10(cleanIsbn);
    } else if (cleanIsbn.length === 13) {
      return this.isValidISBN13(cleanIsbn);
    }
    return false;
  }

  private isValidISBN10(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(isbn[i]!) * (10 - i);
    }
    const checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9]!);
    sum += checkDigit;
    return sum % 11 === 0;
  }

  private isValidISBN13(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(isbn[i]!) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(isbn[12]!);
  }

  getValue(): string {
    return this.value;
  }

  getFormattedValue(): string {
    if (this.value.length === 10) {
      return `${this.value.slice(0, 1)}-${this.value.slice(1, 4)}-${this.value.slice(4, 9)}-${this.value.slice(9)}`;
    } else {
      return `${this.value.slice(0, 3)}-${this.value.slice(3, 4)}-${this.value.slice(4, 6)}-${this.value.slice(6, 12)}-${this.value.slice(12)}`;
    }
  }

  equals(other: ISBN): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.getFormattedValue();
  }
}