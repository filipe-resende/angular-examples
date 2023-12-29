/**
 * Clona um objeto para um novo, removendo a referência do anterior
 * @param object objeto a ser clonado
 */
export function cloneObject(object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Clona um array para um novo, removendo a referência do anterior
 * @param object objeto a ser clonado
 */
export function cloneArray(arr) {
  return JSON.parse(JSON.stringify(arr));
}
