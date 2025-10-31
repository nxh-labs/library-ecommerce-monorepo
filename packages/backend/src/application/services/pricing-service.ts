import { Price } from "@/domain";

export interface PricingRule {
  apply(bookPrice: Price, quantity: number, context?: any): Price;
}

export class BasePriceRule implements PricingRule {
  apply(bookPrice: Price, quantity: number): Price {
    return bookPrice.multiply(quantity);
  }
}

export class BulkDiscountRule implements PricingRule {
  constructor(
    private readonly threshold: number,
    private readonly discountPercentage: number
  ) {}

  apply(bookPrice: Price, quantity: number): Price {
    const basePrice = bookPrice.multiply(quantity);

    if (quantity >= this.threshold) {
      return basePrice.applyDiscount(this.discountPercentage);
    }

    return basePrice;
  }
}

export class CategoryDiscountRule implements PricingRule {
  constructor(
    private readonly categoryId: string,
    private readonly discountPercentage: number
  ) {}

  apply(bookPrice: Price, quantity: number, context?: any): Price {
    const basePrice = bookPrice.multiply(quantity);

    if (context?.categoryId === this.categoryId) {
      return basePrice.applyDiscount(this.discountPercentage);
    }

    return basePrice;
  }
}

export class LoyaltyDiscountRule implements PricingRule {
  constructor(
    private readonly userLoyaltyLevel: string,
    private readonly discountPercentage: number
  ) {}

  apply(bookPrice: Price, quantity: number, context?: any): Price {
    const basePrice = bookPrice.multiply(quantity);

    if (context?.userLoyaltyLevel === this.userLoyaltyLevel) {
      return basePrice.applyDiscount(this.discountPercentage);
    }

    return basePrice;
  }
}

export class SeasonalDiscountRule implements PricingRule {
  constructor(
    private readonly discountPercentage: number,
    private readonly startDate: Date,
    private readonly endDate: Date
  ) {}

  apply(bookPrice: Price, quantity: number): Price {
    const basePrice = bookPrice.multiply(quantity);
    const now = new Date();

    if (now >= this.startDate && now <= this.endDate) {
      return basePrice.applyDiscount(this.discountPercentage);
    }

    return basePrice;
  }
}

export class PricingService {
  private rules: PricingRule[] = [];

  addRule(rule: PricingRule): void {
    this.rules.push(rule);
  }

  removeRule(rule: PricingRule): void {
    this.rules = this.rules.filter(r => r !== rule);
  }

  clearRules(): void {
    this.rules = [];
  }

  calculatePrice(bookPrice: Price, quantity: number, context?: any): Price {
    let finalPrice = bookPrice.multiply(quantity);

    // Apply all applicable rules
    for (const rule of this.rules) {
      finalPrice = rule.apply(bookPrice, quantity, context);
    }

    return finalPrice;
  }

  calculateTotalPrice(items: Array<{ price: Price; quantity: number; context?: any }>): Price {
    return items.reduce((total, item) => {
      const itemPrice = this.calculatePrice(item.price, item.quantity, item.context);
      return total.add(itemPrice);
    }, new Price(0));
  }

  // Tax calculation (simplified)
  calculateTax(amount: Price, taxRate: number): Price {
    return amount.multiply(taxRate / 100);
  }

  // Shipping cost calculation (simplified)
  calculateShippingCost(totalAmount: Price, weight?: number): Price {
    // Free shipping over certain amount
    if (totalAmount.getValue() >= 50) {
      return new Price(0);
    }

    // Basic shipping cost
    return new Price(5.99);
  }

  calculateFinalTotal(
    items: Array<{ price: Price; quantity: number; context?: any }>,
    taxRate: number = 8.5,
    includeShipping: boolean = true
  ): { subtotal: Price; tax: Price; shipping: Price; total: Price } {
    const subtotal = this.calculateTotalPrice(items);
    const tax = this.calculateTax(subtotal, taxRate);
    const shipping = includeShipping ? this.calculateShippingCost(subtotal) : new Price(0);
    const total = subtotal.add(tax).add(shipping);

    return {
      subtotal,
      tax,
      shipping,
      total
    };
  }
}

// Predefined pricing strategies
export class PricingStrategyFactory {
  static createStandardPricing(): PricingService {
    const service = new PricingService();
    service.addRule(new BasePriceRule());
    return service;
  }

  static createBulkDiscountPricing(): PricingService {
    const service = new PricingService();
    service.addRule(new BasePriceRule());
    service.addRule(new BulkDiscountRule(5, 10)); // 10% off for 5+ items
    service.addRule(new BulkDiscountRule(10, 20)); // 20% off for 10+ items
    return service;
  }

  static createSeasonalPricing(seasonalDiscount: number): PricingService {
    const service = new PricingService();
    service.addRule(new BasePriceRule());
    service.addRule(new SeasonalDiscountRule(seasonalDiscount, new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))); // 30 days
    return service;
  }
}