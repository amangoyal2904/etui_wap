import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { MenuProps, MenuSecProps } from 'components/AppHeader/types';
import { useSelector } from 'react-redux'

const NavBar: FC = () => {  
  const store = useSelector(state => state.appHeader);
  const menuData: MenuProps = store.data.searchResult[0];  

  return (
   (()=> menuData ? <nav className={styles.navBar}>
      <Link href={menuData?.url}>
        <a className={styles.active}>{menuData?.title}</a>
      </Link>
      {menuData?.sec?.map((item: MenuSecProps, i) => (
        (item.shorturl || item.url) ? <Link href={item.shorturl ? item.shorturl : item.url} key={i}>
          <a data-name={item.title}>
            {item.title}
          </a>
        </Link>
        :
        <a key={i}>{item.title}</a>
      ))}
    </nav>: null)()
  );
}

export default NavBar;