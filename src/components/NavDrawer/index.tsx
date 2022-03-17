import React from 'react';
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
  logo?: string;
  sec?: MenuSecProps[];
  isOpen: Boolean
}

const NavDrawer: FC<MenuProps> = (props) => {



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
    data && data.searchResult && data.searchResult[0] && data.searchResult[0].url ? <nav className={`${styles.drawer} ${props.isOpen && styles.isOpen}`} id="mainMenu"
    is-open="false">
      <div className={styles.user}>
        <div className={styles.userName}>
          <div>Welcome</div><div>User</div>
        </div>
        <div className={styles.signIn}>
          <div className={styles.userIcon}></div>
          <div>Sign In</div>
        </div>
      </div>
      <div className={styles.menuWrap}>
        <ul className={styles.level0}>
          <li>
            <Link href={data.searchResult[0].url}>
              <a>{data.searchResult[0].title}</a>
            </Link>
          </li>
          <li className={styles.oneDotBdr}></li>
          {data.searchResult[0].sec.map((item: MenuSecProps, i) => (
            <React.Fragment key={'l' + i}>
              <li>
                <Link href={item.url ? item.url : '/'}>
                  <a>
                    {item.title} <span className={styles.rArr}></span>
                  </a>
                </Link>
                {item.sec && <ul> {item.sec?.map((item1, j) => (
                  <li key={'l1' + j}>
                    <Link href={item1.url ? item1.url : '/'}>
                      <a>
                        {item1.title}
                      </a>
                    </Link>
                  </li>
                ))} </ul>}
              </li>
              <li className={styles.oneDotBdr}></li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </nav> : null
  );
}

export default NavDrawer;