export const getParameterByName = (name) => {
  if (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  } else {
    return "";
  }
};

export const isLiveApp = () => {
  const lh = window.location.host,
    isLive = lh.indexOf("localhost:3000") !== -1 || lh.indexOf("dev8243") != -1 || lh.indexOf("etpwa") != -1 ? 0 : 1;
  return isLive;
};

export const fetchAllMetaInfo = async (msid) => {
  try {
    const response = await fetch(
      `https://${
        isLiveApp() ? "economictimes" : "etdev8243"
      }.indiatimes.com/feed_meta_all.cms?msid=${msid}&feedtype=etjson`
    );
    if (response.ok) {
      const data = await response.json();
      if (
        data.info &&
        data.info.feed_meta_all &&
        data.info.feed_meta_all.allmetalist &&
        data.info.feed_meta_all.allmetalist.sec
      ) {
        const metaArray = data.info.feed_meta_all.allmetalist.sec;
        const metaObj = {};
        for (const meta of metaArray) {
          metaObj[meta.mname] = meta.minfo;
        }
        return metaObj;
      }
    } else {
      throw new Error("Network response was not OK");
    }
  } catch (err) {
    console.error("Error fetch Abound Banner", err);
  }
};
export default {
  getParameterByName,
  fetchAllMetaInfo,
  isLiveApp
};
