type HttpResponse = {
  statusCode: number
  data: any
}

class FacebookLoginController {
  async handle (httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('Token is required')
    }
  }
}

describe('Facebook Login Controller', () => {
  it('should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController();

    const response = await sut.handle({ token: '' });

    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token is required')
    })
  });

  it('should return 400 if token is null', async () => {
    const sut = new FacebookLoginController();

    const response = await sut.handle({ token: null });

    expect(response).toEqual({
      statusCode: 400,
      data: new Error('Token is required')
    })
  });
});
