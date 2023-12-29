export class Extensions {
  public static isMobile = {
    Android: () => {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: () => {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: () => {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: () => {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: () => {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: () => {
      return (
        Extensions.isMobile.Android() ||
        Extensions.isMobile.BlackBerry() ||
        Extensions.isMobile.iOS() ||
        Extensions.isMobile.Opera() ||
        Extensions.isMobile.Windows()
      );
    }
  };
}
