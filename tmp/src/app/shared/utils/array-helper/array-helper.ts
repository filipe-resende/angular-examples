export const ArrayHelper = {
  includesMany(array: any[], values: any[]) {
    let result = false;
    values.forEach(value => {
      if (array.includes(value)) {
        result = true;
      }
    });
    return result;
  },
};
