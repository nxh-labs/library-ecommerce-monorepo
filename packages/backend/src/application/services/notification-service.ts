// Observer pattern for notifications
export interface NotificationObserver {
  notify(event: NotificationEvent): Promise<void>;
}

export interface NotificationEvent {
  type: string;
  userId?: string;
  data: any;
}

export class NotificationService {
  private observers: NotificationObserver[] = [];

  subscribe(observer: NotificationObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: NotificationObserver): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  async notify(event: NotificationEvent): Promise<void> {
    const promises = this.observers.map(observer => observer.notify(event));
    await Promise.all(promises);
  }
}

// Concrete notification observers
export class EmailNotificationObserver implements NotificationObserver {
  async notify(event: NotificationEvent): Promise<void> {
    switch (event.type) {
      case 'order.created':
        await this.sendOrderConfirmationEmail(event.userId!, event.data);
        break;
      case 'order.status.updated':
        await this.sendOrderStatusUpdateEmail(event.userId!, event.data);
        break;
      case 'user.registered':
        await this.sendWelcomeEmail(event.userId!, event.data);
        break;
      // Add more notification types as needed
    }
  }

  private async sendOrderConfirmationEmail(userId: string, orderData: any): Promise<void> {
    // Implementation would send email
    console.log(`Sending order confirmation email to user ${userId}`, orderData);
  }

  private async sendOrderStatusUpdateEmail(userId: string, orderData: any): Promise<void> {
    // Implementation would send email
    console.log(`Sending order status update email to user ${userId}`, orderData);
  }

  private async sendWelcomeEmail(userId: string, userData: any): Promise<void> {
    // Implementation would send email
    console.log(`Sending welcome email to user ${userId}`, userData);
  }
}

export class SMSNotificationObserver implements NotificationObserver {
  async notify(event: NotificationEvent): Promise<void> {
    switch (event.type) {
      case 'order.shipped':
        await this.sendShippingSMS(event.userId!, event.data);
        break;
      case 'order.delivered':
        await this.sendDeliverySMS(event.userId!, event.data);
        break;
    }
  }

  private async sendShippingSMS(userId: string, orderData: any): Promise<void> {
    // Implementation would send SMS
    console.log(`Sending shipping SMS to user ${userId}`, orderData);
  }

  private async sendDeliverySMS(userId: string, orderData: any): Promise<void> {
    // Implementation would send SMS
    console.log(`Sending delivery SMS to user ${userId}`, orderData);
  }
}

export class PushNotificationObserver implements NotificationObserver {
  async notify(event: NotificationEvent): Promise<void> {
    switch (event.type) {
      case 'order.created':
        await this.sendOrderPushNotification(event.userId!, event.data);
        break;
      case 'review.received':
        await this.sendReviewNotification(event.userId!, event.data);
        break;
    }
  }

  private async sendOrderPushNotification(userId: string, orderData: any): Promise<void> {
    // Implementation would send push notification
    console.log(`Sending order push notification to user ${userId}`, orderData);
  }

  private async sendReviewNotification(userId: string, reviewData: any): Promise<void> {
    // Implementation would send push notification
    console.log(`Sending review notification to user ${userId}`, reviewData);
  }
}