import { HttpResponse } from '@/application/helpers';

export interface IMiddleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
