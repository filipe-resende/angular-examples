import moment from 'moment';

moment.locale('Pt-br');

export const Labels = (): string[] => {
  const lastDay =
    moment().format('D') === '1'
      ? `${moment().subtract(1, 'days').format('DD/MMM/YY')}`
      : `1-${moment().subtract(1, 'days').format('DD/MMM/YY')}`;
  return [
    `${moment().subtract(2, 'months').format('MMM/YY')}`,
    `${moment().subtract(1, 'months').format('MMM/YY')}`,
    lastDay,
  ];
};
