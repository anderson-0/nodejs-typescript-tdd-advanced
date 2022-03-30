/* eslint-disable prefer-const */

import { ILoadFacebookUserApi } from '@/domain/contracts/apis';
import { ITokenGenerator } from '@/domain/contracts/crypto';
import { ISaveFacebookAccountRepository, ILoadUserAccountRepository } from '@/domain/contracts/repositories/user-account-repository';
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases';
import { AuthenticationError } from '@/domain/entities/errors';
import { AccessToken, FacebookAccount } from '@/domain/entities';

import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'jest-mock';

jest.mock('@/domain/entities/facebook-account-model');

describe('Facebook Authentication Use Case', () => {
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  let crypto: MockProxy<ITokenGenerator>;
  let userAccountRepository: MockProxy<ILoadUserAccountRepository & ISaveFacebookAccountRepository>;
  let sut: FacebookAuthentication;

  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    });

    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock();
    crypto.generateToken.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    // clear all mocks is configured in jest.config.js
    sut = setupFacebookAuthentication(
      facebookApi,
      userAccountRepository,
      crypto
    )
  })
  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should throw AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError());
  })

  it('Should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_email@mail.com' });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  })

  it('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }));
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);
    await sut({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should call TokenGenerator with correct params', async () => {
    await sut({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('Should return an AccessToken on success', async () => {
    const authResult = await sut({ token })

    expect(authResult).toEqual({ accessToken: 'any_generated_token' });
  });

  it('Should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('facebook_error'));
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('facebook_error'));
  });

  it('Should rethrow if LoadUserAccountRepository throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('load_error'));
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'));
  });

  it('Should rethrow if SaveFacebookAccountRepository throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('save_error'));
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'));
  });

  it('Should rethrow if TokenGenerator throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('token_error'));
    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
