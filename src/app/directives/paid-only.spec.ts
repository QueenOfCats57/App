import { PaidOnly } from './paid-only';

describe('PaidOnly', () => {
  it('should create an instance', () => {
    const directive = new PaidOnly();
    expect(directive).toBeTruthy();
  });
});
