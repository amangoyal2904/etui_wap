import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Service from 'network/service';
import APIS_CONFIG from "../../network/config.json";

interface MenuSecProps {
  title: string;
  logo?: string;
  msid?: number;
  url?: string;
  sec?: MenuSecProps[];
}
interface MenuProps {
  logo: string;
  sec: MenuSecProps[];
}

const NavBar: FC = () => {

  let [data, setData]:any = useState({});
  useEffect(() => {
    let url = APIS_CONFIG.REQUEST;
		let params = {
			type: "menu",
		};
		Service.get(url, params)
		.then(res => {
      setData(res.data || {});
		})
  }, [])

  return (
    data && data.searchResult && data.searchResult[0] && data.searchResult[0].title ? <nav className={styles.navBar}>
      <Link href={data && data.searchResult && data.searchResult[0] && data.searchResult[0].url}>
        <a className={styles.active}>{data.searchResult[0].title}</a>
      </Link>
      {data.searchResult[0].sec.map((item: MenuSecProps, i) => (
        <Link href={item.url ? item.url : '/'} key={i}>
          <a>
            {item.title}
          </a>
        </Link>
      ))}
    </nav> : null
  );
}

export default NavBar;