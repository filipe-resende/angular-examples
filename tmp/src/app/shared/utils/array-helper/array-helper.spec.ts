import { ArrayHelper } from './array-helper';

describe('Array Helper', () => {
  it('should return false when none of the elements exists in array', () => {
    const array = [1, 3, 5];
    const valuesToBeSearched = [2, 4];
    const result = ArrayHelper.includesMany(array, valuesToBeSearched);
    expect(result).toBe(false);
  });

  it('should return true when at least one of the elements exists in array', () => {
    const array = [1, 2, 3, 5];
    const valuesToBeSearched = [2, 4];
    const result = ArrayHelper.includesMany(array, valuesToBeSearched);
    expect(result).toBe(true);
  });

  it('should return false when array is empty', () => {
    const array = [];
    const valuesToBeSearched = [2, 4];
    const result = ArrayHelper.includesMany(array, valuesToBeSearched);
    expect(result).toBe(false);
  });

  it('should return false when array and values to be searched are empty', () => {
    const array = [];
    const valuesToBeSearched = [];
    const result = ArrayHelper.includesMany(array, valuesToBeSearched);
    expect(result).toBe(false);
  });
});
