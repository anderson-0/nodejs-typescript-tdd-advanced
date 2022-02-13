export interface ILoadFacebookUserApi {
  loadUser: (params: ILoadFacebookUserApi.Params) => Promise<void>
}

export namespace ILoadFacebookUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}
