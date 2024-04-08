import APIS_CONFIG from "../../network/config.json";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoggedIn, setLoggedOut, setIsPrime } from "../../Slices/login";
import { APP_ENV } from "../../utils";
import { loginInitiatedGA4 } from "utils/common";

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
      window.__APP.login = {
        status: true,
        ssoid: objUser.ssoid,
        email: objUser.primaryEmail,
        firstName: objUser.firstName
      };

      window.customDimension["dimension3"] = "LOGGEDIN";
      window.customDimension["email"] = objUser.primaryEmail;
      if (objUser.ssoid) window.customDimension["userId"] = objUser.ssoid;
    } else {
      window.customDimension["dimension3"] = "NONLOGGEDIN";
    }
  };
  const permissionCallback = () => {
    const permissions = (window.objInts && window.objInts.permissions) || [];
    if (permissions.includes("subscribed")) {
      // set state
      setIsSubscribed(1);
      // set prime status in redux
      dispatch(setIsPrime(1));
      // add isprimeuser class in the body
      document.body.classList.add("isprimeuser");
      window.customDimension["dimension37"] = "paid";
    } else {
      window.customDimension["dimension37"] = "free";
      // remove isprimeuser class from the body
      document.body.classList.remove("isprimeuser");
    }
  };
  const intsCallback = () => {
    if (typeof window.objUser !== "undefined") {
      window.objUser?.afterLoginCall(loginCallback);
    }
    window.objInts?.afterPermissionCall(permissionCallback);
  };
  useEffect(() => {
    if (typeof window.objInts !== "undefined") {
      intsCallback();
    } else {
      document.addEventListener("objIntsLoaded", intsCallback);
    }
    return () => {
      document.removeEventListener("objIntsLoaded", intsCallback);
    };
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
      loginInitiatedGA4({
        isPaywalled: false,
        entrypoint: "Hamburger",
        screenName: "Login"
      });
      if (typeof window != "undefined" && typeof window.objInts != "undefined" && window.objInts) {
        window.objInts.initSSOWidget();
      } else {
        const loginUrl = APIS_CONFIG.LOGIN[APP_ENV];
        window.location.href = `${loginUrl}${APP_ENV == "development" ? `?ru=${window.location.href}` : ""}`;
      }
    }
  };
  const firstName: string = (isLogin && userInfo.firstName) || "User";

  return (
    <>
      <div className="user">
        <div className="userName">
          {isSubscribed == 0 && <div>Welcome</div>}
          <div>{firstName}</div>
          {isSubscribed == 1 && (
            <img
              src="https://img.etimg.com/photo/77066493.cms"
              loading="lazy"
              decoding="async"
              className="primeUserLogo"
              data-testId="primeUserLogo"
            />
          )}
        </div>
        <div className="signIn" onClick={handleLoginToggle}>
          <div className={`userIcon commonSprite`}></div>
          <div id="loginButton">{isLogin ? "Sign out" : "Sign In"}</div>
        </div>
      </div>
      <style jsx>
        {`
          .loginDetails .primeUserLogo {
            margin-top: 4px;
            width: 55px;
            display: block;
          }
          .user {
            position: sticky;
            top: 0;
            font-size: 16px;
            font-weight: 600;
            color: #000000;
            line-height: 15px;
            height: 72px;
            padding: 20px 20px;
            background-color: #f6f6f6;
            border: solid 1px #e6e6e6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1;
          }

          .userName {
            float: left;
            line-height: 1.31em;
            position: relative;
            bottom: 3px;
          }
          .userName img {
            margin-top: 4px;
            width: 55px;
            display: block;
          }

          .signIn {
            float: right;
            font-size: 13px;
            font-weight: normal;
            position: relative;
            bottom: 5px;
            text-align: center;
          }
          .userIcon {
            background-position: -327px -51px;
            height: 32px;
            width: 34px;
            transform: scale(0.7);
          }
        `}
      </style>
    </>
  );
};

export default Login;
