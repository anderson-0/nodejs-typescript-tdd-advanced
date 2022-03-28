import { Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy } from 'jest-mock-extended';
import { Controller } from '@/application/controllers';
export class ExpressRouterAdapter {
  constructor (private readonly controller: Controller) {}

  async adapt (req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body });
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
    sut = new ExpressRouterAdapter(controller);
  });

  it('should call controller handle with correct request', async () => {
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' });
  });

  it('should call controller handle with empty request', async () => {
    req = getMockReq({ body: undefined });

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({});
  });
})
