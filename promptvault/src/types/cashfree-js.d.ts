declare module '@cashfreepayments/cashfree-js' {
  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_parent' | '_top';
    returnUrl?: string;
  }
  export interface Cashfree {
    checkout(options: CheckoutOptions): unknown;
  }
  export function load(opts: { mode: 'sandbox' | 'production' }): Promise<Cashfree>;
}
