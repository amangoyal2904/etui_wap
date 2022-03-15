import React from 'react';
import Link from 'next/link';
import { FC } from 'react';
import styles from './styles.module.scss';
import useRequest from 'network/service';
import Loading from 'components/Loading';

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

  const { data, isLoading, error } = useRequest<{
    searchResult: MenuProps,
    parameters: Object
  }>({
    url: "request",
    params: { type: "menu" }
  });


  if (isLoading) return <Loading />
  if (error) return <div>Please try again!</div>

  return (
    <nav className={`${styles.drawer} ${props.isOpen && styles.isOpen}`} id="mainMenu"
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
    </nav>
  );
}

export default NavDrawer;