import { FC, useEffect, useState } from "react";
import APIS_CONFIG from "network/config.json";
import Service from "network/service";
import { APP_ENV, getCookie } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "app/store";
import { fetchBookmark, fetchBookmarkDefault } from "Slices/bookmark";
import { createPeuuid } from "utils/personalization";
import styles from "./styles.module.scss";
import { loginInitiatedGA4 } from "utils/common";

interface BookmarkProps {
  msid: string;
  hostId: string;
  type: string;
}

const Bookmark: FC<BookmarkProps> = ({ msid, hostId, type }) => {
  const [isBookmarked, setIsBookmarked] = useState(0);
  const dispatch = useDispatch();
  const { login, bookmark } = useSelector((state: AppState) => state);

  // use effect to fetch and check bookmark status
  useEffect(() => {
    if (!(login.userInfo && Object.keys(login.userInfo).length === 0)) {
      const Authorization = getCookie("peuuid");
      if (!Authorization) {
        createPeuuid(() => {
          dispatch(fetchBookmark(msid, type));
        });
      } else {
        dispatch(fetchBookmark(msid, type));
      }
    }
    return () => {
      dispatch(fetchBookmarkDefault());
      setIsBookmarked(0);
    };
  }, [login, msid]);

  // to update the code and current bookmark state
  useEffect(() => {
    if (bookmark?.bookmarkData?.details?.length) {
      setIsBookmarked(1);
    }
  }, [bookmark.bookmarkData]);

  //save book mark of current article api
  const saveBookmark = async (currentMSID, type) => {
    if (login.userInfo && Object.keys(login.userInfo).length === 0) {
      loginInitiatedGA4({
        isPaywalled: false,
        entrypoint: "Feature Login",
        screenName: "Bookmark"
      });
      if (typeof window != "undefined" && typeof window.objInts != "undefined" && window.objInts) {
        window.objInts.initSSOWidget();
      } else {
        const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
        window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`;
      }
    }
    const Authorization = getCookie("peuuid");
    const url = APIS_CONFIG.saveNews[APP_ENV];
    const channelId = hostId === "364" ? 4 : 0;
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
        setIsBookmarked(isBookmarked == 1 ? 0 : 1);
      }
    } catch (e) {
      return console.error(e.message);
    }
  };

  return (
    <span
      onClick={() => {
        saveBookmark(msid, type);
      }}
      className={`${styles.bookmark} ${styles.commonSprite} ${isBookmarked === 1 ? styles.bookmarkAdded : ""}`}
    ></span>
  );
};

export default Bookmark;
