import { mock } from 'jest-mock-extended';

interface Validator {
  validate: () => Error | undefined
}

export class ValidationComposite {
  constructor (private readonly validators: Validator[]) {}
  validate (): undefined {
    return undefined
  }
}

describe('Validation Composite', () => {
  it('should return undefined if all Validators return undefined', async () => {
    const validator1 = mock<Validator>();
    validator1.validate.mockReturnValue(undefined);
    const validator2 = mock<Validator>();
    validator2.validate.mockReturnValue(undefined);
    const sut = new ValidationComposite([validator1, validator2]);

    const error = sut.validate();

    expect(error).toBeUndefined()
  });
});
