/** *
 * This enum is used to map IAM roles 'cn' parameter.
 * This enum's labels have to be kept in lowercase for the comparison to work
 */
export enum IamRolesEnum {
  analistaoperacional = 1,
  analistasegempresarial = 2,
  admin = 3,
  paebm = 4,
  euc = 5,
}
export enum Roles {
  AnalistaOperacional = 1,
  AnalistaSegurancaEmpresarial = 2,
  Administrador = 3,
  Paebm = 4,
  Euc = 5,
}

export const IamRolesDescriptions = {
  AnalistaOperacional: 'Monitoramento de Dispositivos de Localização',
  AnalistaSegurancaEmpresarial: 'Segurança Empresarial',
  Administrador: 'Administrador do Sistema',
  Paebm: 'PAEBM',
  Euc: 'EUC',
};
