import { removeBackSlash } from "utils";
import { grxEvent } from "./ga";

export const socialUrl = {
  fb: "https://www.facebook.com/sharer.php",
  twt: "https://twitter.com/share?",
  gp: "https://plus.google.com/share?url=",
  lin: "https://www.linkedin.com/cws/share?url=",
  whatsapp: "whatsapp://send?text=",
  message: "sms:" + "&body=",
  pinit: "https://pinterest.com/pin/create/link/?url=",
  openerName: "sharer",
  popUpSettings: "toolbar=0,status=0,width=626,height=436"
};
export const Share = (evt, shareParam) => {
  console.log(shareParam);
  try {
    let shareTitle = shareParam.title || "";
    let shareUrl = shareParam.shareUrl;
    const type = shareParam.type;
    fireGAEvent(evt, type, shareUrl);
    if (type == "wa") {
      shareUrl =
        socialUrl.whatsapp +
        encodeURIComponent(removeBackSlash(shareTitle).replace(" - The Economic Times on Mobile", "")) +
        " - " +
        shareUrl +
        encodeURIComponent("?utm_source=whatsapp_pwa&utm_medium=social&utm_campaign=socialsharebuttons");
      window.location.href = shareUrl;
    }
    if (type == "sms") {
      shareUrl =
        socialUrl.message +
        encodeURIComponent(removeBackSlash(shareTitle).replace(" - The Economic Times on Mobile", "")) +
        " - " +
        shareUrl +
        encodeURIComponent("?utm_source=sms&utm_medium=social&utm_campaign=socialsharebuttons");
      window.location.href = shareUrl;
    }
    if (type == "fb") {
      const fbUrl =
        socialUrl.fb +
        "?u=" +
        encodeURIComponent(shareUrl + "?utm_source=facebook_pwa&utm_medium=social&utm_campaign=socialsharebuttons") +
        "&t=" +
        encodeURIComponent(shareTitle);
      console.log(fbUrl);
      openDialog({ url: fbUrl, name: socialUrl.openerName });
    } else if (type == "twt") {
      shareTitle = shareTitle.replace(" - The Economic Times on Mobile", "") || "";
      shareTitle = shareTitle.length <= 110 ? shareTitle : shareTitle.substring(0, 107) + "...";

      const text = encodeURIComponent(removeBackSlash(shareTitle).replace("|", "-"));
      const url = encodeURIComponent(
        shareUrl + "?utm_source=twitter_pwa&utm_medium=social&utm_campaign=socialsharebuttons"
      );
      shareUrl = socialUrl.twt + "text=" + text + "&url=" + url + "&via=economictimes";
      openDialog({ url: shareUrl, name: socialUrl.openerName });
    } else if (type == "lin") {
      shareUrl =
        socialUrl.lin + shareUrl + "?utm_source=linkedin_pwa&utm_medium=social&utm_campaign=socialsharebuttons";
      openDialog({ url: shareUrl, name: socialUrl.openerName });
    } else if (type == "gp") {
      shareUrl =
        socialUrl.gp + shareUrl + "?utm_source=googleplus_pwa&utm_medium=social&utm_campaign=socialsharebuttons";
      openDialog({ url: shareUrl, name: socialUrl.openerName });
    } else if (type == "email") {
      const urltoshare = shareUrl.replace("slideshow_new", "slideshow");
      const body = encodeURIComponent(
        urltoshare + "?utm_source=email_pwa&utm_medium=social&utm_campaign=socialsharebuttons"
      );
      shareUrl = "mailto:?subject=ET: " + encodeURIComponent(removeBackSlash(shareTitle));
      window.location.href = shareUrl + "&body=" + body;
    }
  } catch (e) {
    console.log("error in SocialShare::share::", e);
  }
};
const openDialog = (config) => {
  try {
    const settings = config.settings ? config.settings : socialUrl.popUpSettings;
    window.open(config.url, config.name, settings);
  } catch (e) {
    console.log("error in SocialShare::openDialog::" + e);
  }
};
const fireGAEventSocialShare = (network, action, url) => {
  try {
    const socialPayload = {
      hitType: "social",
      socialNetwork: network,
      socialAction: action,
      socialTarget: url
    };
    window.ga("send", socialPayload);
    grxEvent("socialshare", socialPayload);
  } catch (e) {
    console.log("error in SocialShare::fireGAEventSocialShare::" + e);
  }
};
const fireGAEvent = (e, type, shareurl) => {
  try {
    let utm_source = "";
    let network = "";
    switch (type) {
      case "wa":
        utm_source = "Whatsapp_PWA";
        network = "Whatsapp";
        break;
      case "fb":
        utm_source = "Facebook_PWA";
        network = "Facebook";
        break;
      case "twt":
        utm_source = "Twitter_PWA";
        network = "Twitter";
        break;
      case "lin":
        utm_source = "Linkedin_PWA";
        network = "Linkedin";
        break;
      case "email":
        utm_source = "Email_PWA";
        network = "Email";
        break;
      default:
        utm_source = "";
        network = "";
    }
    const url = shareurl + "?utm_source=" + utm_source + "&utm_medium=social&utm_campaign=socialsharebuttons";
    fireGAEventSocialShare(network, "Share", url);
  } catch (e) {
    console.log("error in SocialShare::fireGAEvent::" + e);
  }
};
export default { Share };
