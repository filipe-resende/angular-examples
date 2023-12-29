import { StatusLoadEnum } from '../../enums/statusLoad.enums';

export const translateStatusLoad = (
  statusLoad: StatusLoadEnum,
  statusLoadTranslation: any,
): string => {
  let status = '';

  switch (statusLoad) {
    case StatusLoadEnum.Aquisicao:
      status = statusLoadTranslation.ACQUISITION;
      break;
    case StatusLoadEnum.AtivacaoDeLicenca:
      status = statusLoadTranslation.LICENSE_ACTIVATION;
      break;
    case StatusLoadEnum.Descarte:
      status = statusLoadTranslation.DISPOSAL;
      break;
    case StatusLoadEnum.Perda:
      status = statusLoadTranslation.LOSS;
      break;
    case StatusLoadEnum.EnvioAssistenciaTecnica:
      status = statusLoadTranslation.SENDING_TECHNICAL_ASSISTANCE;
      break;
    case StatusLoadEnum.Devolucao:
      status = statusLoadTranslation.RETURN;
      break;
    case StatusLoadEnum.RetornoAssistenciaTecnica:
      status = statusLoadTranslation.RETUNR_TECHNICAL_ASSISTANCE;
      break;
    case StatusLoadEnum.TransferenciaDeLocal:
      status = statusLoadTranslation.LOCATION_TRANSFER;
      break;
    case StatusLoadEnum.TransferenciaDePropriedade:
      status = statusLoadTranslation.OWNERSHIP_TRANSFER;
      break;
    case StatusLoadEnum.RetornoAssistenciaTecnicaNovo:
      status = statusLoadTranslation.RETURN_TECHNICAL_ASSISTANCE_NEW;
      break;
    case StatusLoadEnum.RetornoAssistenciaTecnicaSubstituido:
      status = statusLoadTranslation.RETUNR_TECHNICAL_ASSISTANCE_REPLACED;
      break;
  }
  return status;
};
