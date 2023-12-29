export enum ValeColor {
  LightGreen = '#6cb535',
  Green = '#008f83',
  Blue = '#00a6c9',
  Violet = '#4085c5',
  Red = '#d10340',
  Orange = '#ee7517',
  Yellow = '#f1b600',
  Grey = '#7c7b7b',
}

export enum ValeColorNames {
  LightGreen = 'VALE_OFFICIAL_COLORS.LIGHT_GREEN',
  Green = 'VALE_OFFICIAL_COLORS.GREEN',
  Blue = 'VALE_OFFICIAL_COLORS.BLUE',
  Violet = 'VALE_OFFICIAL_COLORS.VIOLET',
  Red = 'VALE_OFFICIAL_COLORS.RED',
  Orange = 'VALE_OFFICIAL_COLORS.ORANGE',
  Yellow = 'VALE_OFFICIAL_COLORS.YELLOW',
  Grey = 'VALE_OFFICIAL_COLORS.GREY',
}

export const OFFICIAL_PERIMETER_COLOR = ValeColor.Yellow;

/**
 * Retorna um array com todas cores da Vale
 */
export function getValeColors(): ValeColor[] {
  return [
    ValeColor.LightGreen,
    ValeColor.Green,
    ValeColor.Blue,
    ValeColor.Violet,
    ValeColor.Red,
    ValeColor.Orange,
    ValeColor.Yellow,
    ValeColor.Grey,
  ];
}

/**
 * Retorna um array com todas cores da vale e seu respectivo nome
 */
export function getValeColorsAndNames(): Array<{
  color: ValeColor;
  name: string;
}> {
  const systemLanguage = localStorage.getItem('_culture');

  if (systemLanguage === 'pt-BR') {
    return [
      { color: ValeColor.LightGreen, name: 'Vale Verde-Claro' },
      { color: ValeColor.Green, name: 'Vale Verde' },
      { color: ValeColor.Blue, name: 'Vale Azul' },
      { color: ValeColor.Violet, name: 'Vale Violeta' },
      { color: ValeColor.Red, name: 'Vale Vermelho' },
      { color: ValeColor.Orange, name: 'Vale Laranja' },
      { color: ValeColor.Yellow, name: 'Vale Amarelo' },
      { color: ValeColor.Grey, name: 'Vale Cinza' },
    ];
  }
  return [
    { color: ValeColor.LightGreen, name: 'Vale Light-Green' },
    { color: ValeColor.Green, name: 'Vale Green' },
    { color: ValeColor.Blue, name: 'Vale Blue' },
    { color: ValeColor.Violet, name: 'Vale Violet' },
    { color: ValeColor.Red, name: 'Vale Red' },
    { color: ValeColor.Orange, name: 'Vale Orange' },
    { color: ValeColor.Yellow, name: 'Vale Yellow' },
    { color: ValeColor.Grey, name: 'Vale Grey' },
  ];
}

/**
 * obtém o enum da cor Vale segundo uma cor hexadecimal. null caso não encontrado
 * @param hexColor cor em hexadecimal. eg: #6CB535
 */
export function getEquivalentValeColor(hexColor: string): ValeColor {
  if (!hexColor) {
    return null;
  }

  const hexColorFormated = (hexColor.includes('#')
    ? hexColor
    : `#${hexColor}`
  ).toUpperCase();

  switch (hexColorFormated) {
    case '#6CB535':
      return ValeColor.LightGreen;
    case '#008F83':
      return ValeColor.Green;
    case '#00A6C9':
      return ValeColor.Blue;
    case '#4085C5':
      return ValeColor.Violet;
    case '#D10340':
      return ValeColor.Red;
    case '#EE7517':
      return ValeColor.Orange;
    case '#F1B600':
      return ValeColor.Yellow;
    case '#7C7B7B':
      return ValeColor.Grey;
    default:
      return null;
  }
}

/**
 * Retorna o nome da cor
 */
export function getValeColorName(valeColor: ValeColor) {
  switch (valeColor) {
    case ValeColor.LightGreen:
      return 'VALE_OFFICIAL_COLORS.LIGHT_GREEN';
    case ValeColor.Green:
      return 'VALE_OFFICIAL_COLORS.GREEN';
    case ValeColor.Blue:
      return 'VALE_OFFICIAL_COLORS.BLUE';
    case ValeColor.Violet:
      return 'VALE_OFFICIAL_COLORS.VIOLET';
    case ValeColor.Red:
      return 'VALE_OFFICIAL_COLORS.RED';
    case ValeColor.Orange:
      return 'VALE_OFFICIAL_COLORS.ORANGE';
    case ValeColor.Yellow:
      return 'VALE_OFFICIAL_COLORS.YELLOW';
    case ValeColor.Grey:
      return 'VALE_OFFICIAL_COLORS.GREY';
    default:
      return valeColor;
  }
}
