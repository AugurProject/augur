export function isMobileBrowser(): boolean {
    return (
      navigator.userAgent.indexOf('Android') > -1 ||
      navigator.userAgent.indexOf('webOS') > -1 ||
      navigator.userAgent.indexOf('Windows Phone') > -1
    );
  }
  
  export function isMobileBrowserTall(): boolean {
    return (
      navigator.userAgent.indexOf('iPhone') > -1 ||
      navigator.userAgent.indexOf('iPad') > -1
    );
  }