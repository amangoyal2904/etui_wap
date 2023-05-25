import { APP_ENV } from "utils";
import { ET_WAP_URL } from "utils/common";

const env = APP_ENV || "production";

const playerEvents = {
  onPlayerError: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
  },
  onInit: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoStarted: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
    // if(!slikePlayerProps.isamp && isPwa == null) {
    //     parent && parent.onVideoStart && parent.onVideoStart();
    // }
  },
  onVideoResumed: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoPaused: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
  },
  onVolumeChange: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoMuted: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoCompleted: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData, player);
  },
  onVideoEnded: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData, player);
  },
  onVideoProgress: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoFullscreenchange: (player, eventName, eventData) => {
    //console.log('Player event ', eventName, eventData);
  },
  onVideoNext: (player, eventName, eventData) => {
    //console.log('Player event Next Video ', eventName, eventData);
    if (window.top.fromIframeNewVideo) {
      window.top.fromIframeNewVideo(eventData);
    }
  },
  onVideoPrev: (player, eventName, eventData) => {
    //console.log('Player event Prev Video  ', eventName, eventData);
    if (window.top.fromIframeNewVideo) {
      window.top.fromIframeNewVideo(eventData);
    }
  }
};

const adEvents = {
  onAdComplete: (player, eventName, eventData) => {
    //console.log('Ad Event ', eventName, eventData);
    // if(!slikePlayerProps.isamp && isPwa == null) {
    //     parent && parent.onadComplete && parent.onadComplete();
    // }
  },
  onAdSkip: (player, eventName, eventData) => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdLoaded: (player, eventName, eventData) => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdRequest: (player, eventName, eventData) => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdError: (player, eventName, eventData) => {
    // if(!slikePlayerProps.isamp && isPwa == null) {
    //     parent && parent.onadComplete && parent.onadComplete();
    // }
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdResume: (player, eventName, eventData) => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdStart: (player, eventName, eventData) => {
    //console.log('Ad Event ', eventName, eventData);
  },
  onAdPause: (player, eventName, eventData) => {
    //console.log('Ad Event ', eventName, eventData);
  }
};

export function handlePlayerEvents(player) {
  function eventToFunction(player, eventName, data) {
    const funcName = eventName.replace("spl", "on");
    data = Object.assign({}, data, player.store.video);
    if (playerEvents && typeof playerEvents[funcName] === "function") {
      playerEvents[funcName](player, funcName, data);
    }
  }
  Object.keys(window.SlikePlayer.Events).forEach((eventKey) => {
    const eventName = window.SlikePlayer.Events[eventKey];
    player.on(eventName, eventToFunction.bind(null, player));
  });
}

export function handleAdEvents(player) {
  function eventToFunction(player, eventName, data) {
    //console.log(eventName);
    const funcName = eventName.replace("spl", "on");
    const eventData = data || {};
    if (adEvents && typeof adEvents[funcName] === "function") {
      adEvents[funcName](player, funcName, eventData);
    }
  }
  Object.keys(window.SlikePlayer.AdEvents).forEach((eventKey) => {
    const eventName = window.SlikePlayer.AdEvents[eventKey];
    player.on(eventName, eventToFunction.bind(null, player));
  });
}

export const dynamicPlayerConfig = {
  apiKey: "etmweb46324htoi24",
  contEl: "id_",
  debug: false,
  video: {
    id: "",
    playerType: "",
    shareUrl: "",
    image: "https://img.etimg.com/photo/60882360.cms",
    title: "video title"
  },
  controls: {
    dock: {
      fallback: true,
      type: "native"
    }
  },
  player: {
    msid: "",
    autoPlay: false,
    adSection: "default",
    fallbackMute: 0,
    mute: true,
    skipAd: 0,
    volume: 100,
    shareOptions: ["t", "f", "w", "e"],
    playlistUrl: "",
    playlist: false,
    pagetpl: "videoshow",
    pageSection: "",
    sg: "",
    ppid: "",
    playInBackground: true,
    transmit: false,
    scrollBehaviour: {
      inViewPercent: 100,
      dock: false,
      autoPlay: true,
      autoPause: true
    },
    showTitle: true
  },
  gaId: "UA-198011-5"
};

export function setGetPlayerConfig({ dynamicPlayerConfig, result, autoPlay, pageTpl, isPrimeUser, subSecs }) {
  const playerConfig = JSON.parse(JSON.stringify(dynamicPlayerConfig));
  playerConfig.contEl = "id_" + result.msid;
  playerConfig.video.id = result.slikeid;
  playerConfig.video.playerType = result.playertype;
  playerConfig.video.shareUrl = ET_WAP_URL + result.url;
  playerConfig.video.description_url = ET_WAP_URL + result.url; // no need to modify; added specifically for tracking purpose by Slike team
  playerConfig.video.image = result.img;
  playerConfig.video.title = result.title;
  playerConfig.player.msid = result.msid;
  playerConfig.player.autoPlay = autoPlay;
  playerConfig.player.pagetpl = pageTpl;
  playerConfig.player.skipAd = isPrimeUser;
  playerConfig.player.isPrime = Boolean(isPrimeUser);
  playerConfig.player.pageSection = subSecs;

  return playerConfig;
}
