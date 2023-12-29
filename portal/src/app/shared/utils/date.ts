import * as moment from 'moment';

/**
 * formata uma data com moment para manter padrão. eg. resposta: 2020-07-08
 * @param date data a ser formatada
 * @param format formato da formatação. default: "YYYY-MM-DD"
 */
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  try {
    return moment(new Date(date)).format(format);
  } catch {
    return moment().format(format);
  }
}

/**
 * formata uma data unindo data + hora no formato UTC. eg. resposta: 2020-07-08T14:13:00.000Z
 * @param date data a ser formatada
 * @param hour hora a ser formatada. eg.: 11:13
 */
export function formatDateAsUTC(date: string | Date, hour?: string): string {
  const offSetTimeZone = new Date().getTimezoneOffset();

  return moment(`${date}${hour ? ` ${hour}` : ''}`)
    .utcOffset(offSetTimeZone)
    .utc()
    .toISOString();
}

/**
 * Retorna as horas da data, com 2 casas
 * @param date data para parse
 */
export function getHoursString(date: Date): string {
  const hours = date.getHours();
  return hours > 9 ? hours.toString() : `0${hours}`;
}

/**
 * Retorna os minutos da data, com 2 casas
 * @param date data para parse
 */
export function getMinutesString(date: Date): string {
  const minutes = date.getMinutes();
  return minutes > 9 ? minutes.toString() : `0${minutes}`;
}
