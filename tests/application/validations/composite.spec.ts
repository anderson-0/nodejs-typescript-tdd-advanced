import { mock, MockProxy } from 'jest-mock-extended';

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
  let sut: ValidationComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;
  let validators: Validator[];

  beforeEach(() => {
    validator1 = mock<Validator>();
    validator2 = mock<Validator>();
    validators = [validator1, validator2];
    validator1.validate.mockReturnValue(undefined);
    validator2.validate.mockReturnValue(undefined);
    sut = new ValidationComposite(validators);
  });
  it('should return undefined if all Validators return undefined', async () => {
    const error = sut.validate();

    expect(error).toBeUndefined()
  });
});
