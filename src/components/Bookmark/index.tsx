import { FC, useEffect, useState } from "react";
import APIS_CONFIG from "network/config.json";
import Service from "network/service";
import { APP_ENV, getCookie } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "app/store";
import { fetchBookmark, fetchBookmarkDefault } from "Slices/bookmark";
import { generateFpid } from "utils/personalization";
import styles from "./styles.module.scss";

interface BookmarkProps {
  bookmarkProps: {
    msid: string;
    hostId: string;
    type: string;
  };
}

const Bookmark: FC<BookmarkProps> = ({ bookmarkProps }) => {
  const [isBookmarked, setIsBookmarked] = useState(0);
  const dispatch = useDispatch();
  const { login, bookmark } = useSelector((state: AppState) => state);

  // use effect to fetch and check bookmark status
  useEffect(() => {
    if (login.login) {
      const Authorization = getCookie("peuuid");
      if (!Authorization) {
        generateFpid(() => {
          dispatch(fetchBookmark(bookmarkProps.msid, bookmarkProps.type));
        });
      } else {
        dispatch(fetchBookmark(bookmarkProps.msid, bookmarkProps.type));
      }
    }
    return () => {
      dispatch(fetchBookmarkDefault());
      setIsBookmarked(0);
    };
  }, [login, bookmarkProps.msid]);

  // to update the code and current bookmark state
  useEffect(() => {
    if (bookmark?.bookmarkData?.details?.length) {
      setIsBookmarked(1);
    }
  }, [bookmark.bookmarkData]);

  //save book mark of current article api
  const saveBookmark = async (currentMSID, type) => {
    console.log(bookmark);
    const url = APIS_CONFIG.saveNews[APP_ENV];
    const Authorization = getCookie("peuuid");
    if (!Authorization) {
      const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
      window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`;
      return false;
    }
    const channelId = bookmarkProps.hostId === "364" ? 4 : 0;
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
        // dispatch(fetchBookmark(shareParam.msid, shareParam.type));
      }
    } catch (e) {
      return console.error(e.message);
    }
  };

  return (
    <span
      onClick={() => {
        saveBookmark(bookmarkProps.msid, bookmarkProps.type);
      }}
      className={`${styles.bookmark} ${styles.commonSprite} ${isBookmarked === 1 ? styles.bookmarkAdded : ""}`}
    ></span>
  );
};

export default Bookmark;
