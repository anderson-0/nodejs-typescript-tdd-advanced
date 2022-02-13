export interface ILoadUserAccountRepository {
  load: (params: ILoadUserAccountRepository.Params) => Promise<ILoadUserAccountRepository.Result>
}

export namespace ILoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined
}

export interface ICreateFacebookAccountRepository {
  createFromFacebook: (params: ICreateFacebookAccountRepository.Params) => Promise<void>
}

export namespace ICreateFacebookAccountRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }

  // export type Result = undefined
}
