import { FC, useEffect, useState } from "react";
import socialshare from "utils/socialshare";
import styles from "./styles.module.scss";
import APIS_CONFIG from "network/config.json";
import Service from "network/service";
import { APP_ENV, getCookie } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "app/store";
import { fetchBookmark, fetchBookmarkDefault } from "Slices/bookmark";
import { generateFpid } from "utils/personalization";

interface SocialShareProps {
  shareParam: {
    shareUrl: string;
    title: string;
    msid: string;
    hostId: string;
    type: string;
  };
}

const SocialShare: FC<SocialShareProps> = ({ shareParam }) => {
  const [isBookmarked, setIsBookmarked] = useState(0);
  const dispatch = useDispatch();
  const store = useSelector((state: AppState) => state);
  useEffect(() => {
    if (store && store.login.login && !store.bookmark.bookmarkStatus) {
      const Authorization = getCookie("peuuid") != undefined ? getCookie("peuuid") : getCookie("ssoid");
      if (!Authorization) {
        generateFpid(true, () => {
          dispatch(fetchBookmark(shareParam.msid, shareParam.type));
        });
      } else {
        dispatch(fetchBookmark(shareParam.msid, shareParam.type));
      }
    }
    console.log(store, "Store");
    if (
      store.bookmark.bookmarkStatus &&
      store.bookmark.bookmarkData &&
      store.bookmark.bookmarkData.details &&
      store.bookmark.bookmarkData.details.length
    ) {
      console.log(store, "updated Store post");
      store.bookmark.bookmarkData.details[0].status == 1 ? setIsBookmarked(1) : setIsBookmarked(0);
    }
    return () => {
      console.log("cleanup");
      dispatch(fetchBookmarkDefault());
    };
  }, [store.login, shareParam.msid]);

  //save book mark of current article api
  const saveArticle = async (currentMSID, type) => {
    console.log(store);
    const url = APIS_CONFIG.saveNews[APP_ENV];
    const Authorization = getCookie("peuuid") != undefined ? getCookie("peuuid") : getCookie("ssoid");
    if (!Authorization) {
      const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
      window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`;
      return false;
    }
    const channelId = shareParam.hostId === "364" ? 4 : 0;
    try {
      const res = await Service.post({
        url,
        headers: { "Content-Type": "application/json", Authorization: Authorization },
        withCredentials: true,
        payload: {
          source: 0,
          userSettings: [
            {
              stype: 0,
              msid: currentMSID,
              articletype: type,
              action: isBookmarked == 1 ? 0 : 1,
              channelId: channelId
            }
          ]
        },
        params: {
          type: "bookmark"
        }
      });
      const data = res.data || {};
      if (data && data[0].status == "success") {
        alert(`Video is ${isBookmarked === 1 ? "unsaved" : "saved"} successfully`);
        setIsBookmarked(isBookmarked == 1 ? 0 : 1);
        dispatch(fetchBookmark(shareParam.msid, shareParam.type));
      }
    } catch (e) {
      alert(e.message);
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
          onClick={() => {
            saveArticle(shareParam.msid, shareParam.type);
          }}
          className={`${styles.bookmark} ${styles.commonSprite} ${isBookmarked === 1 ? styles.bookmarkAdded : ""}`}
        ></span>
      </div>
    </div>
  );
};

export default SocialShare;
