import Link from "next/link";
import { Fragment } from "react";
import styles from "./styles.module.scss";
import { OtherVidsProps } from "types/videoshow";
import LazyLoadImg from "../LazyLoad";

interface ListProps {
  type: string;
  title: string;
  data: OtherVidsProps;
}

export default function Listing({ type, title, data }: ListProps) {
  const grid = () => {
    return (
      <Fragment>
        <div className={styles.otherVids}>
          <h2>{title}</h2>
          <div className={styles.vidsSlider}>
            <ul>
              {data.data.map((item, index) => (
                <li key={type + index}>
                  <Link href={item.url}>
                    <a>
                      <LazyLoadImg large={false} img={item.img} alt={item.title} width={135} height={100} />
                      <p>{item.title}</p>
                      {item.type === "videoshow" && <span className={styles.slideVidIcon}></span>}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  };

  if (type === "grid") {
    return grid();
  }
}
