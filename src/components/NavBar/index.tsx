import Link from 'next/link';
import { FC } from 'react';
import styles from './styles.module.scss';
import { useAppSelector } from 'app/hooks';
import { selectMenu } from 'components/AppHeader/appHeaderSlice';
import { MenuProps, MenuSecProps } from 'components/AppHeader/types';

const NavBar: FC = () => {

  const menuData: MenuProps = useAppSelector(selectMenu);

  console.log(menuData);

  return (
   (()=> menuData ? <nav className={styles.navBar}>
      <Link href={menuData?.url}>
        <a className={styles.active}>{menuData?.title}</a>
      </Link>
      {menuData?.sec.map((item: MenuSecProps, i) => (
        <Link href={item.url ? item.url : '/'} key={i}>
          <a>
            {item.title}
          </a>
        </Link>
      ))}
    </nav>: null)()
  );
}

export default NavBar;