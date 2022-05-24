import { FC, useEffect, useState } from "react";
import socialshare from "utils/socialshare";
import styles from "./styles.module.scss";
import APIS_CONFIG from "network/config.json";
import Service from "network/service";
import { getCookie } from "utils";
import { APP_ENV } from "../../utils";

interface SocialShareProps {
  shareParam: {
    shareUrl: string;
    title: string;
    msid: string;
    hostId: string;
  };
}

const SocialShare: FC<SocialShareProps> = ({ shareParam }) => {
  const [isBookmarked, setIsBookmarked] = useState(0);

  useEffect(() => {
    getBookMarkStatus();
  }, []);

  const getBookMarkStatus = () => {
    const Authorization = getCookie("peuuid") != undefined ? getCookie("peuuid") : getCookie("ssoid");
    const api = APIS_CONFIG.getSavedNewsStatus[APP_ENV];
    const params = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: Authorization
    };
    Service.get({ api, params })
      .then((res) => {
        setIsBookmarked(1);
      })
      .catch((err) => {
        console.error("Get Book Mark Status Error", err.message);
      });
  };
  const saveArticle = async (currentMSID) => {
    const api = APIS_CONFIG.saveNews[APP_ENV];
    const Authorization = getCookie("peuuid") != undefined ? getCookie("peuuid") : getCookie("ssoid");
    const channelId = shareParam.hostId === "364" ? 4 : 0;
    try {
      const res = await Service.post({
        api,
        params: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: Authorization,
          source: 0,
          userSettings: [
            {
              stype: 0,
              msid: currentMSID,
              articletype: "5", //for videoshow only
              action: isBookmarked,
              channelId: channelId
            }
          ]
        }
      });

      const data = res.data || {};
    } catch (e) {
      return console.error(e.message);
    }
  };

  return (
    <div className={styles.socialShare}>
      <div className={styles.shareText}>Share this Video</div>
      <div className={styles.socialLinks}>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "wa" })}
          className={`${styles.wa} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "fb" })}
          className={`${styles.fb} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "twt" })}
          className={`${styles.twt} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "lin" })}
          className={`${styles.in} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "email" })}
          className={`${styles.email} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "sms" })}
          className={`${styles.sms} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={(e) => socialshare.Share(e, { ...shareParam, type: "bm" })}
          className={`${styles.bookmark} ${styles.commonSprite}`}
        ></span>
        <span
          onClick={() => {
            saveArticle(shareParam.msid);
          }}
          className={`${styles.bookmark} ${isBookmarked === 1 ? styles.bookmarkAdded : ""}`}
        ></span>
      </div>
    </div>
  );
};

export default SocialShare;
