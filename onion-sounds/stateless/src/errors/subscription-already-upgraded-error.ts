export class SubscriptionAlreadyUpgradedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubscriptionAlreadyUpgradedError';
  }
}
