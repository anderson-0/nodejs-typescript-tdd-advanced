import { Request, Response, NextFunction, RequestHandler } from 'express';

import { HttpResponse } from '@/application/helpers';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy } from 'jest-mock-extended';

type Adapter = (middleware: IMiddleware) => RequestHandler;

const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers });
    if (statusCode === 200) {
      const dataEntries = Object.entries(data).filter(entry => entry[1]);

      req.locals = { ...req.locals, ...Object.fromEntries(dataEntries) };
      next();
    }
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
      statusCode: 200,
      data: {
        emptyProperty: '',
        nullProperty: null,
        undefinedProperty: undefined,
        prop: 'any_value'
      }
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

  it('should respond with corret error and status code', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: { error: 'any_error' }
    });

    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should add data to req.locals', async () => {
    await sut(req, res, next);

    expect(req.locals).toEqual({ prop: 'any_value' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should valid data to req.locals', async () => {
    await sut(req, res, next);

    expect(req.locals).toEqual({ prop: 'any_value' });
    expect(next).toHaveBeenCalledTimes(1);
  });
})
