import { FacebookAccount } from '@/domain/models';

describe('FacebookAccount', () => {
  const facebookData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  it('Should create with facebook data only if account data is not provided', () => {
    const sut = new FacebookAccount(facebookData)

    expect(sut).toEqual(facebookData)
  });

  it('Should update name with facebook data if account exists and does not have a name', () => {
    const accountData = { id: 'any_id' }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  });

  it('Should not update name with facebook data if account exists and has a name', () => {
    const accountData = { id: 'any_id', name: 'any_name' }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  });
});
