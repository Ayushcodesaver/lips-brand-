import { describe, expect, it } from 'vitest';
import { bagSchema, codOrderSchema, money, onlineOrderSchema, products, totals } from '../lib/catalog';
import { gatewayOrderId, usdCentsToInr } from '../lib/cashfree';

describe('catalog', () => {
  it('exposes six products with correct ids', () => {
    expect(products).toHaveLength(6);
    products.forEach((p, i) => expect(p.id).toBe(i));
  });

  it('formats money in USD', () => {
    expect(money(2800)).toBe('$28.00');
    expect(money(500)).toBe('$5.00');
  });

  it('computes totals with free shipping over $60', () => {
    const one = totals([{ productId: 0, quantity: 1 }]);
    expect(one.subtotal).toBe(2800);
    expect(one.shipping).toBe(500);
    expect(one.total).toBe(3300);

    const big = totals([{ productId: 0, quantity: 3 }]);
    expect(big.subtotal).toBe(8400);
    expect(big.shipping).toBe(0);
    expect(big.total).toBe(8400);

    expect(totals([]).total).toBe(0);
  });
});

describe('cashfree conversion', () => {
  it('converts USD cents to whole rupees', () => {
    expect(usdCentsToInr(2800)).toBe(2324); // $28 * 83
    expect(usdCentsToInr(3300)).toBe(2739); // $33 * 83
    expect(usdCentsToInr(0)).toBe(0);
  });

  it('honours a custom rate and guards bad input', () => {
    expect(usdCentsToInr(2800, 90)).toBe(2520);
    expect(usdCentsToInr(2800, 0)).toBe(0);
    expect(usdCentsToInr(-1, 83)).toBe(0);
  });

  it('derives a safe alphanumeric gateway order id', () => {
    const id = gatewayOrderId('123e4567-e89b-12d3-a456-426614174000');
    expect(id.startsWith('mv')).toBe(true);
    expect(id).toMatch(/^[a-z0-9]{1,40}$/);
    expect(gatewayOrderId('!!!!')).toBe('mv');
  });
});

describe('order validation', () => {
  const address = {
    full_name: 'Test Buyer',
    phone: '9999999999',
    line1: '1 Rose Lane',
    line2: '',
    city: 'Mumbai',
    region: 'MH',
    postal_code: '400001',
    country: 'India',
  };

  it('accepts a valid COD order', () => {
    const parsed = codOrderSchema.safeParse({
      requestId: '123e4567-e89b-12d3-a456-426614174000',
      items: [{ productId: 0, quantity: 2 }],
      address,
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects an empty bag and duplicate products', () => {
    const base = { requestId: '123e4567-e89b-12d3-a456-426614174000', address };
    expect(codOrderSchema.safeParse({ ...base, items: [] }).success).toBe(false);
    expect(
      codOrderSchema.safeParse({
        ...base,
        items: [
          { productId: 0, quantity: 1 },
          { productId: 0, quantity: 1 },
        ],
      }).success,
    ).toBe(false);
  });

  it('rejects out-of-range product ids and quantities', () => {
    expect(bagSchema.safeParse([{ productId: 6, quantity: 1 }]).success).toBe(false);
    expect(bagSchema.safeParse([{ productId: 0, quantity: 21 }]).success).toBe(false);
  });

  it('requires an email for online orders', () => {
    const payload = {
      requestId: '123e4567-e89b-12d3-a456-426614174000',
      items: [{ productId: 1, quantity: 1 }],
      address,
    };
    expect(onlineOrderSchema.safeParse(payload).success).toBe(false);
    expect(onlineOrderSchema.safeParse({ ...payload, customerEmail: 'buyer@example.com' }).success).toBe(true);
  });

  it('rejects incomplete addresses', () => {
    const bad = codOrderSchema.safeParse({
      requestId: '123e4567-e89b-12d3-a456-426614174000',
      items: [{ productId: 1, quantity: 1 }],
      address: { ...address, city: '' },
    });
    expect(bad.success).toBe(false);
  });
});
