/**
 * Obtém todos os valores numéricos de um determinado enum.
 * @param enumerator enum a ter os valores mapeados
 */
export function getAllEnumNumberValues(enumerator): number[] {
  return Object.values(enumerator)
    .filter(o => !Number.isNaN(Number(o)))
    .map(o => Number(o));
}
