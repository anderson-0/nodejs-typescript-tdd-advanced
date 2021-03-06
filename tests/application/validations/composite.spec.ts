import { mock, MockProxy } from 'jest-mock-extended';
import { ValidationComposite, IValidator } from '@/application/validations';

describe('Validation Composite', () => {
  let sut: ValidationComposite;
  let validator1: MockProxy<IValidator>;
  let validator2: MockProxy<IValidator>;
  let validators: IValidator[];

  beforeEach(() => {
    validator1 = mock<IValidator>();
    validator2 = mock<IValidator>();
    validators = [validator1, validator2];
    validator1.validate.mockReturnValue(undefined);
    validator2.validate.mockReturnValue(undefined);
    sut = new ValidationComposite(validators);
  });
  it('should return undefined if all Validators return undefined', async () => {
    const error = sut.validate();

    expect(error).toBeUndefined()
  });

  it('should return the first error if there is more than one', async () => {
    validator1.validate.mockReturnValueOnce(new Error('error1'));
    validator2.validate.mockReturnValueOnce(new Error('error2'));
    const error = sut.validate();

    expect(error).toEqual(new Error('error1'));
  });

  it('should return the first error if there is more than 1 validator', async () => {
    validator2.validate.mockReturnValueOnce(new Error('error2'));
    const error = sut.validate();

    expect(error).toEqual(new Error('error2'));
  });
});
