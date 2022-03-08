import React from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';

import { useAppSelector } from 'app/hooks';
import { selectMenu } from 'components/AppHeader/appHeaderSlice';
import { MenuProps, MenuSecProps } from 'components/AppHeader/types';
import { FC, useState, useRef, useEffect, createRef } from 'react';


interface DrawerProps {
  setIsDrawerOpen: (s: boolean) => void;
}

const NavDrawer: FC<DrawerProps> = ({ setIsDrawerOpen }) => {

  const menuData: MenuProps = useAppSelector(selectMenu);

  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if(ref.current && !ref.current.contains(e.target)) {
        setIsDrawerOpen(false);
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      //clean up
      document.removeEventListener('mousedown', checkIfClickedOutside);
    }
  }, []);

  return (
    (()=> menuData && <nav className={styles.drawer} ref={ref}>
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
            <Link href={menuData.url}>
              <a>{menuData.title}</a>
            </Link>
          </li>
          <li className={styles.oneDotBdr}></li>
          {menuData.sec.map((item: MenuSecProps, i) => (
            <React.Fragment key={'l' + i}>
              <li>
                <Link href={item.shorturl ? item.shorturl : '/'}>
                  <a>
                    {item.title} <span className={styles.rArr}></span>
                  </a>
                </Link>
                {item.sec && <ul> {item.sec?.map((item1, j) => (
                  <li key={'l1' + j}>
                    <Link href={item1.shorturl ? item1.shorturl : '/'}>
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
    </nav>)()
  );
}

export default NavDrawer;