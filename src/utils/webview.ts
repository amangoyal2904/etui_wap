declare global {
  interface Window {
    initiateAppToWebConnection: any;
    isAppReady: any;
    onLoginSuccess: any;
    onLoginFailed: any;
    messageFromApp: any;
    tilAppWebBridge: any;
    webkit: any;
  }
}
export function initializeUnifiedAppLoginHandlers(fromApp, callback) {
  const invokeAfterIsAppReadySuccess = () => {
    if (
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad") ||
      navigator.userAgent.includes("iPod") ||
      fromApp == "ios"
    ) {
      if (typeof window.webkit.messageHandlers.tilAppWebBridge != "undefined") {
        const loginCommand = `checkLoggedInUser('unifiedLoginCheck', 'unifiedLoginCheck')`;
        window.webkit.messageHandlers.tilAppWebBridge.postMessage(loginCommand);
      }
    } else {
      if (typeof window.tilAppWebBridge != "undefined") {
        window.tilAppWebBridge.checkLoggedInUser("unifiedLoginCheck", "unifiedLoginCheck");
      }
    }
  };
  window.initiateAppToWebConnection = (response) => {
    invokeAfterIsAppReadySuccess();
  };
  window.isAppReady = () => {
    invokeAfterIsAppReadySuccess();
  };

  window.onLoginSuccess = (reqId, userInfo, extraInfo) => {
    console.log("data on login success", reqId, userInfo, extraInfo);
    userInfo = JSON.parse(userInfo);
    if (userInfo.ssoid && userInfo.ticketid && userInfo.otr) {
      callback(userInfo);
    }
  };
  window.onLoginFailed = (reqId, userInfo, extraInfo) => {
    if (extraInfo == "unifiedLoginCheck") {
      requestUnifiedAppLogin();
      console.log("unifiedLoginCheck");
    } else if (extraInfo == "unifiedLoginRequest") {
      console.log("unifiedLoginRequest");
    }
  };

  window.messageFromApp = (response) => {
    window.location.reload();
  };
}

export function requestUnifiedAppLogin() {
  if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")) {
    if (typeof window.webkit.messageHandlers.tilAppWebBridge != "undefined") {
      const loginCommand = `requestLogin('unifiedLoginRequest', 'unifiedLoginRequest')`;
      window.webkit.messageHandlers.tilAppWebBridge.postMessage(loginCommand);
    }
  } else {
    if (typeof window.tilAppWebBridge != "undefined") {
      window.tilAppWebBridge.requestLogin("unifiedLoginRequest", "unifiedLoginRequest");
    }
  }
}
export function unifiedOpenDeepLinkUrl(urlObj, fromApp) {
  const deep_link_url_obj = JSON.stringify(urlObj);
  if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") || fromApp == "ios") {
    if (typeof window.webkit.messageHandlers.tilAppWebBridge != "undefined") {
      window.webkit.messageHandlers.tilAppWebBridge.postMessage(`${deep_link_url_obj}`);
    }
  } else {
    if (typeof window.tilAppWebBridge != "undefined") {
      window.tilAppWebBridge.postMessage(`${deep_link_url_obj}`);
    }
  }
}
