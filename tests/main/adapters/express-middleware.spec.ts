import { Request, Response, NextFunction, RequestHandler } from 'express';

import { HttpResponse } from '@/application/helpers';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy } from 'jest-mock-extended';

type Adapter = (middleware: IMiddleware) => RequestHandler;

const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, _next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers });
    return res.status(statusCode).json(data);
  };
}

interface IMiddleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

describe('Express Middleware', () => {
  let req: Request
  let res: Response;
  let next: NextFunction;

  let middleware: MockProxy<IMiddleware>;
  let sut: RequestHandler;

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' } });
    res = getMockRes().res;
    next = getMockRes().next;

    middleware = mock<IMiddleware>();

    middleware.handle.mockResolvedValue({
      statusCode: 500,
      data: { error: 'any_error' }
    });
  });

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware);
  });
  it('should call handle with correct request', async () => {
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    req = getMockReq();
    res = getMockRes().res;
    next = getMockRes().next;

    const sut = adaptExpressMiddleware(middleware);

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond with corret error and  ', async () => {
    const sut = adaptExpressMiddleware(middleware);

    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
})
