import { RequiredFieldError } from '@/application/errors';

export class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (['', null, undefined].includes(this.value)) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
