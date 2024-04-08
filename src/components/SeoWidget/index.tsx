import React from "react";
import GreyDivider from "../GreyDivider";

interface SeoWidgetProps {
  title: string;
  data: {
    title: string;
    url: string;
  }[];
  type?: string;
  clsName?: string;
}

const SeoWidget = (props: SeoWidgetProps) => {
  const { title, data } = props;
  return data && data.length > 0 ? (
    <>
      {props.type == "articleshow" && <GreyDivider />}
      <div
        className={`widgetContainer ${props.clsName ? props.clsName : ""} ${
          props.type == "articleshow" ? "noMargin" : "topMargin"
        }`}
      >
        <div className="widget">
          <ul className="widgetList">
            <li className="wTitle">{title || `TOP TRENDING TERMS`}</li>
            {data.map((data, index) => (
              <li className="wContents" key={index}>
                {" "}
                <a href={data.url} rel="noreferrer" target="_blank">
                  {data.title}
                </a>{" "}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>
        {`
          .widgetContainer {
            font-family: "Montserrat", "Verdana";
          }
          .widgetContainer .widget {
            overflow-x: scroll;
            overflow-y: hidden;
            width: 100%;
            height: 58px;
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
            white-space: nowrap;
            margin-top: 8px;
            box-shadow: 0 9px 10px 0 rgba(0, 0, 0, 0.05);
            border: solid 1px #dddddd;
            background-color: #fafafa;
            display: flex;
            align-items: center;
          }

          .widgetContainer .widget::-webkit-scrollbar {
            display: none;
          }

          .widgetContainer .widget .widgetList {
            display: flex;
            list-style: none;
            padding: 0;
          }

          .widgetList .wTitle {
            font-size: 11px;
            font-weight: 800;
            padding: 5px;
            margin: 0 8px 0 18px;
            text-transform: uppercase;
          }
          .widgetList .wContents {
            font-size: 10px;
            border: solid 1px #d9d9d9;
            margin-right: 10px;
            padding: 5px 10px;
            box-sizing: border-box;
            background-color: #ffffff;
            text-transform: uppercase;
          }
          .topSearch .widget {
            border: 0;
          }
          .topSearch .wTitle {
            color: $default-red-color;
          }
          .noMargin {
            margin-top: -8px;
          }
          .topMargin {
            margin-top: 15px;
          }
        `}
      </style>
    </>
  ) : null;
};
export default SeoWidget;
