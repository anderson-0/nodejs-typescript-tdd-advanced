import { Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy } from 'jest-mock-extended';
import { Controller } from '@/application/controllers';
export class ExpressRouterAdapter {
  constructor (private readonly controller: Controller) {}

  async adapt (req: Request, res: Response): Promise<void> {
    const response = await this.controller.handle({ ...req.body });
    if (response.statusCode === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.statusCode).json({ error: response.data.message });
    }
  }
}

describe('Express Router Adapter', () => {
  let req: Request;
  let res: Response;
  let controller: MockProxy<Controller>;
  let sut: ExpressRouterAdapter
  beforeEach(() => {
    res = getMockRes({ body: { any: 'any' } }).res;
    req = getMockReq({ body: { any: 'any' } });
    controller = mock<Controller>();
    controller.handle.mockResolvedValue({ statusCode: 200, data: { data: 'any_data' } });
    sut = new ExpressRouterAdapter(controller);
  });

  it('should call controller handle with correct request', async () => {
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledTimes(1);
    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' });
  });

  it('should call controller handle with empty request', async () => {
    req = getMockReq();

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledTimes(1);
    expect(controller.handle).toHaveBeenCalledWith({});
  });

  it('should respond with HTTP 200 and correct data', async () => {
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should respond with HTTP 400 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error')
    });

    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should respond with HTTP 400 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    });

    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);

    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
})
