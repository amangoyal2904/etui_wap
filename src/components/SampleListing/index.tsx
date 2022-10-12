import { FC, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";

const SampleListing: FC = () => {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const api = APIS_CONFIG.REQUEST;
    const params = { name: "plist", msid: 2146843 };
    Service.get({ api, params })
      .then((res) => {
        setListData(res.data?.searchResult?.[0]?.["data"]);
      })
      .catch((err) => {
        console.error("err", err.message);
      });
  }, []);

  return (
    <ul className={styles.list}>
      {listData &&
        listData.map((item) => (
          <li className={styles.list} key={item.msid}>
            <Link href={item.url.replace("https://m.economictimes.com", "")}>
              <a>{item.title}</a>
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default SampleListing;
