import APIS_CONFIG from "../../network/config.json";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoggedIn, setLoggedOut, setIsPrime } from "../../Slices/login";
import { APP_ENV } from "../../utils";
import styles from "./Login.module.scss";

interface IUser {
  firstName?: string;
  ssoid?: string;
  primaryEmail?: string;
}

const Login = () => {
  const [userInfo, setUserInfo] = useState<IUser>({});
  const [isLogin, setIsLogin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(0);
  const dispatch = useDispatch();

  const loginCallback = () => {
    const objUser = (window.objUser && window.objUser.info) || {};
    if (Object.keys(objUser).length) {
      setUserInfo(objUser);
      setIsLogin(true);
      dispatch(
        setLoggedIn({
          userInfo: objUser,
          login: true,
          permissions: [],
          isprimeuser: 0
        })
      );
      window.customDimension = { ...window.customDimension, email: objUser.primaryEmail };
      window.__APP.login = {
        status: true,
        ssoid: objUser.ssoid,
        email: objUser.primaryEmail,
        firstName: objUser.firstName
      };
    }
  };
  const permissionCallback = () => {
    const permissions = (window.objInts && window.objInts.permissions) || [];
    const objUser = (window.objUser && window.objUser.info) || {};
    if (permissions.includes("subscribed")) {
      // set state
      setIsSubscribed(1);
      // set prime status in redux
      // dispatch(setIsPrime(1));
      // add isprimeuser class in the body
      document.body.classList.add("isprimeuser");
    } else {
      // remove isprimeuser class from the body
      document.body.classList.remove("isprimeuser");
    }
    dispatch(
      setLoggedIn({
        login: true,
        userInfo: objUser,
        permissions,
        isprimeuser: isSubscribed
      })
    );
  };

  useEffect(() => {
    document.addEventListener("objIntsLoaded", () => {
      if (typeof window.objUser !== "undefined") {
        window.objUser.afterLoginCall(loginCallback);
      }
      window.objInts.afterPermissionCall(permissionCallback);
    });
  }, []);

  const setLogout = (cb = null) => {
    dispatch(setLoggedOut());
    setUserInfo({});
    window.__APP.login = {
      status: false,
      ssoid: "",
      email: "",
      firstName: ""
    };
    if (typeof cb == "function") {
      cb();
    } else {
      window.objUser.logout(() => {
        window.location.reload();
      });
    }
  };

  const handleLoginToggle = (): void => {
    if (isLogin) {
      setLogout();
    } else {
      const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
      window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`;
    }
  };
  const firstName: string = (isLogin && userInfo.firstName) || "User";

  return (
    <div className={styles.user}>
      <div className={styles.userName}>
        {isSubscribed == 0 && <div>Welcome</div>}
        <div>{firstName}</div>
        {isSubscribed == 1 && (
          <img
            src="https://img.etimg.com/photo/77066493.cms"
            className={styles.primeUserLogo}
            data-testId="primeUserLogo"
          />
        )}
      </div>
      <div className={styles.signIn} onClick={handleLoginToggle}>
        <div className={`${styles.userIcon} ${styles.commonSprite}`}></div>
        <div id="loginButton">{isLogin ? "Sign out" : "Sign In"}</div>
      </div>
    </div>
  );
};

export default Login;
