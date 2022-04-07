import React from "react";
import styles from "./styles.module.scss";
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
        className={`${styles.widgetContainer} ${props.clsName && styles[props.clsName]} ${
          props.type == "articleshow" ? styles.noMargin : styles.topMargin
        }`}
      >
        <div className={styles.widget}>
          <ul className={styles.widgetList}>
            <li className={styles.wTitle}>{title || `TOP TRENDING TERMS`}</li>
            {data.map((data, index) => (
              <li className={styles.wContents} key={index}>
                {" "}
                <a href={data.url} rel="noreferrer" target="_blank">
                  {data.title}
                </a>{" "}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  ) : null;
};
export default SeoWidget;
