import APIS_CONFIG from "../../network/Apis";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoggedIn, setLoggedOut } from "../../Slices/LoginSlice";
import styles from "./Login.module.scss";

declare global {
  interface Window {
    objUser: any;
    objInts: any;
    customDimension: object;
    __APP: {
      env?: string;
      login?: any;
    };
  }
}

interface IUser {
  isLogin: boolean;
  userInfo: any;
}

const Login = () => {
  const [auth, setAuth] = useState<IUser>({ isLogin: false, userInfo: {} });
  const dispatch = useDispatch();

  const authCallback = () => {
    const objUser = window.objUser || {};
    console.log("login: authCallback - objUser: ", objUser);
    if (objUser.info && objUser.info.isLogged) {
      setLogin(objUser.info);
    } else {
      dispatch(setLoggedOut());
    }
  };
  useEffect(() => {
    if (typeof window.objUser !== "undefined") {
      window.objUser.afterLoginCall(authCallback);
    }
  }, []);

  const setLogin = (userInfo) => {
    userInfo = userInfo || {};
    const objInts = window.objInts;
    console.log("Login: -> objInts", objInts);
    dispatch(setLoggedIn(userInfo));

    setAuth({
      isLogin: true,
      userInfo
    });

    typeof objInts != "undefined" &&
      objInts.afterPermissionCall(() => {
        console.log("Login: -> afterPermissionCall", objInts.permissions);
        let permissionType = "free";
        if (objInts.permissions.indexOf("subscribed") > -1) {
          permissionType = "subscribed";
        }
        if (objInts.permissions.indexOf("expired_subscription") > -1) {
          permissionType = "expired";
        }
        if (
          objInts.permissions.indexOf("subscribed") > -1 &&
          objInts.permissions.indexOf("cancelled_subscription") > -1 &&
          objInts.permissions.indexOf("can_buy_subscription") > -1
        ) {
          permissionType = "can_renew";
        }
        const userData = { ...userInfo, permissions: objInts.permissions, permissionType };
        dispatch(setLoggedIn(userData));
        setAuth({ isLogin: true, userInfo: { ...userInfo, permissions: objInts.permission || [] } });
      });

    window.customDimension = { ...window.customDimension, email: userInfo.primaryEmail };
    window.__APP.login = {
      status: true,
      ssoid: userInfo.ssoid,
      email: userInfo.primaryEmail,
      firstName: userInfo.firstName
    };
  };

  const setLogout = (cb = null) => {
    dispatch(setLoggedOut());
    setAuth({
      userInfo: {},
      isLogin: false
    });
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
    const NODE_ENV = process.env.NODE_ENV || "production";
    if (auth.isLogin) {
      setLogout();
    } else {
      const loginUrl = APIS_CONFIG.login[NODE_ENV];
      console.log("Login: -> loginUrl", loginUrl);
      window.location.href = `${loginUrl}${NODE_ENV == "development" ? `?ru=${window.location.href}` : ""}`;
    }
  };
  const firstName: string = auth.isLogin ? auth.userInfo && auth.userInfo.firstName : "";
  const isSubscribed: boolean =
    (auth.userInfo && auth.userInfo.permissions && auth.userInfo.permissions.indexOf("subscribed") > -1) || false;

  console.log("login comp called");
  return (
    <div className={styles.user}>
      <div className={styles.userName}>
        {!isSubscribed && <div>Welcome</div>}
        <div>{auth.isLogin ? firstName : "User"}</div>
        {isSubscribed && (
          <img
            src="https://img.etimg.com/photo/77066493.cms"
            className={styles.primeUserLogo}
            data-testId="primeUserLogo"
          />
        )}
      </div>
      <div className={styles.signIn}>
        <div className={`${styles.userIcon} ${styles.commonSprite}`}></div>
        <div onClick={handleLoginToggle} id="loginButton">
          {auth.isLogin ? "Sign out" : "Sign In"}
        </div>
      </div>
    </div>
  );
};

export default Login;
