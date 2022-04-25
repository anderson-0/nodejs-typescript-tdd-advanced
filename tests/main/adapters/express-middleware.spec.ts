import { HttpResponse } from '@/application/helpers';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { RequestHandler } from 'express';
import { mock } from 'jest-mock-extended';

type Adapter = (middleware: IMiddleware) => RequestHandler;

const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    await middleware.handle({ ...req.headers });
  };
}

interface IMiddleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

describe('Express Middleware', () => {
  it('should call handle with correct request', async () => {
    const req = getMockReq({ headers: { any: 'any' } });
    const res = getMockRes().res;
    const next = getMockRes().next;

    const middleware = mock<IMiddleware>();
    const sut = adaptExpressMiddleware(middleware);

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    const req = getMockReq();
    const res = getMockRes().res;
    const next = getMockRes().next;

    const middleware = mock<IMiddleware>();
    const sut = adaptExpressMiddleware(middleware);

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('', () => {

  });
})
