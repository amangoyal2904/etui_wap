import React from "react";
import { FC } from "react";

const GreyDivider: FC = () => {
  return (
    <>
      <div className="divider"></div>
      <style jsx>
        {`
          .divider {
            width: 100%;
            height: 10px;
            background-color: #ededed;
            display: block;
          }
        `}
      </style>
    </>
  );
};

export default GreyDivider;
