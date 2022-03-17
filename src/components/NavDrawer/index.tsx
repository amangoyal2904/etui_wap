import React from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';

import { useAppSelector } from 'app/hooks';
import { selectMenu } from 'components/AppHeader/appHeaderSlice';
import { MenuProps, MenuSecProps } from 'components/AppHeader/types';
import { FC, useRef, useEffect, useState } from 'react';
interface DrawerProps {
  setIsDrawerOpen: (s: boolean) => void;
  isOpen: boolean;
}

const NavDrawer: FC<DrawerProps> = ({ setIsDrawerOpen, isOpen }) => {
  const [isSiblingsOpen, setIsSiblingsOpen] = useState({});
  const [isSubmenuOpen, setIsSubmenuOpen] = useState({});
  const menuData: MenuProps = useAppSelector(selectMenu);
  const ref = useRef<HTMLDivElement>();

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

  const showMore = (i) => {
    setIsSiblingsOpen((prev) => {
      return {...prev, [i]: true};
    });
  }

  const showSubmenu = (i) => {    
    setIsSubmenuOpen((prev) => {
      return {...prev, [i]: !prev[i]};
    });
  }

  const getMenu = (data, isSub) => {    

    let r = isSub ? ['<ul>'] : [];

    r = r.concat(data.sec.map((item, i) => (
      <React.Fragment key={'l' + i}>
        <li>
          <Link href={item.shorturl ? item.shorturl : '/'}>
            <a>
              {item.title} <span className={styles.rArr}></span>
            </a>
            {item.sec && (r = r.concat(getMenu(item, true))) }
          </Link>
          </li>
        <li className={styles.oneDotBdr}></li>
      </React.Fragment>
    )));    

    r = r.concat(['</ul>'])
    
    return r;
  }

  const makeLink = (data, level, index) => {
    if(!(data.shorturl || data.url)){
      return <>{data.title} {level===0 && <span className={styles.rArr}></span>}</>;
    }

    return (
      <Link href={data.shorturl ? data.shorturl : data.url}>
        <a className={isSubmenuOpen[index] && level===1 ? styles.hasSubmenu : ''}>
          {data.title} {level===0 && <span className={styles.rArr}></span>}
        </a>
      </Link>
    );
  }

  return (
    menuData ? <nav className={`${styles.drawer} ${isOpen ? styles.isOpen : ''}`} ref={ref}>
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
        <ul>
          <li>
            <Link href={menuData.url}>
              <a>{menuData.title}</a>
            </Link>
          </li>
          <li className={styles.oneDotBdr}></li>
          {menuData.sec.map((item: MenuSecProps, i) => (
            <React.Fragment key={'l' + i}>
              <li>                
                {makeLink(item, 0, i)}
                {item.sec && <ul> {item.sec?.map((item1, j) => (<React.Fragment key={'l1' + j}>
                  <li className={j>3 && !isSiblingsOpen[i] ? styles.hidden : ''}>                    
                    {makeLink(item1, 1, i+'_'+j)}
                    {item1.sec && <>
                    <span className={!isSubmenuOpen[i+'_'+j] ? styles.rDown : styles.rUp} onClick={()=>showSubmenu(i+'_'+j)}></span>
                    <ul className={!isSubmenuOpen[i+'_'+j] ? styles.hidden : styles.submenu}>{item1.sec.map((item2, k) => (
                      <React.Fragment key={'l2' + k}>
                        <li>                          
                          {makeLink(item2, 2, i+'_'+j+'_'+k)}
                        </li>
                      </React.Fragment>
                    ))}</ul></>}
                  </li>
                  {(j===4 && !isSiblingsOpen[i]) && <li data-more={item.title} onClick={()=>showMore(i)}>VIEW MORE FROM {item.title} +</li>}
                  </React.Fragment>
                ))} </ul>}
              </li>
              <li className={styles.oneDotBdr}></li>
            </React.Fragment>
          ))}
          {/* {getMenu(menuData, true)} */}
        </ul>
      </div>
    </nav> : null
  );
}

export default NavDrawer;