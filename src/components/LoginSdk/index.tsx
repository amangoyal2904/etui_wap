import React from "react";

const LoginWidget = () => {
  return (
    <>
      <div id="ssologinWrapper">
        <div id="ssoLogin" className="ssoLogin"></div>
      </div>
      <style jsx>
        {`
          .ssoLogin {
            overflow: auto;
            align-items: center;
            justify-content: center;
            display: flex;
          }
          .loginWidgetWrapper {
            position: fixed;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 9999999999;
            background-color: rgba(0, 0, 0, 0.8);
            overflow: auto;
          }
        `}
      </style>
    </>
  );
};
export default LoginWidget;
