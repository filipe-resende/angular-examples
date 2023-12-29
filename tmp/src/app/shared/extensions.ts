export class Extensions {
  public static isMobile = {
    Android: (): RegExpMatchArray => {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: (): RegExpMatchArray => {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: (): RegExpMatchArray => {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: (): RegExpMatchArray => {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: (): RegExpMatchArray => {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: (): RegExpMatchArray => {
      return (
        Extensions.isMobile.Android() ||
        Extensions.isMobile.BlackBerry() ||
        Extensions.isMobile.iOS() ||
        Extensions.isMobile.Opera() ||
        Extensions.isMobile.Windows()
      );
    },
  };
}
