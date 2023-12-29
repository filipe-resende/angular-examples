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
  groupByProperty(array: any[], property: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[property]] =
        result[currentValue[property]] || []).push(currentValue);
      return result;
    }, {});
  }
};
