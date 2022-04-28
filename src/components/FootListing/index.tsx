import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import styles from "./styles.module.scss";
import { OtherVidsProps } from "types/videoshow";

interface ListProps {
  type: string;
  title: string;
  data: OtherVidsProps;
}

export default function FootListing({ type, title, data }: ListProps) {
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
                      <Image
                        src={item.img}
                        alt={item.title}
                        width={135}
                        height={100}
                        placeholder="blur"
                        blurDataURL="https://img.etimg.com/photo/42031747.cms"
                        unoptimized
                      />
                      <p>{item.title}</p>
                      <span className={styles.slideVidIcon}></span>
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
