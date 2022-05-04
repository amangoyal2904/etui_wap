import { FC, useEffect, useState } from "react";
import socialshare from "utils/socialshare";
import styles from "./styles.module.scss";
import APIS_CONFIG from "network/config.json";
import { getCookie } from "utils/utils";
import Service from "network/service";

interface SocialShareProps {
  shareParam: {
    shareUrl: string;
    title: string;
    msid: string;
  };
}
const Authorization = getCookie("peuuid") != undefined ? getCookie("peuuid") : getCookie("ssoid");

const SocialShare: FC<SocialShareProps> = ({ shareParam }) => {
  const Authorization = getCookie("peuuid") != undefined ? getCookie("peuuid") : getCookie("ssoid");

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const api = APIS_CONFIG.getSavedNewsStatus["development"];
    const params = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: Authorization
    };
    Service.get({ api, params })
      .then((res) => {
        console.log(res);
        setIsBookmarked(true);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);
  const saveArticle = async (isprime, currentMSID) => {
    const api = APIS_CONFIG.saveNews["development"];
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
              articletype: "5",
              // action: this.props.bookmarkstatus[currentMSID] ? 0 : 1,
              action: isBookmarked
            }
          ]
        }
      });
      // if (isprime) {
      //   param['userSettings'][0]['channelid'] = 1;
      // }
      const data = res.data || {};
    } catch (e) {
      return console.error(e.message);
    }
  };

  return (
    <div className={styles.socialShare}>
      <div className={styles.shareText}>Share this Video</div>
      <div className={styles.socialLinks}>
        <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "wa" })} className={styles.wa}></span>
        <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "fb" })} className={styles.fb}></span>
        <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "twt" })} className={styles.twt}></span>
        <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "lin" })} className={styles.in}></span>
        <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "email" })} className={styles.email}></span>
        <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "sms" })} className={styles.sms}></span>
        {/* <span onClick={(e) => socialshare.Share(e, { ...shareParam, type: "bm" })} className={styles.bookmark}></span> */}
        <span
          onClick={() => {
            saveArticle(0, shareParam.msid);
          }}
          className={`${styles.bookmark} ${isBookmarked ? styles.bookmarkAdded : ""}`}
        ></span>
      </div>
    </div>
  );
};

export default SocialShare;
