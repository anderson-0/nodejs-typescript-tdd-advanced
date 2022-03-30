import { AccessToken } from '@/domain/entities';

describe('AccessToken', () => {
  it('Should expire in 1800000ms (30 minutes)', async () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
});
