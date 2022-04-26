import { Request, Response, NextFunction, RequestHandler } from 'express';

import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy } from 'jest-mock-extended';
import { IMiddleware } from '@/application/middlewares';
import { adaptExpressMiddleware } from '@/main/adapters';

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
      data: new Error('any_error')
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
