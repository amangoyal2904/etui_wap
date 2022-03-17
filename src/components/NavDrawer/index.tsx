import React, { ReactElement } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';

// import { useAppSelector } from 'app/hooks';
import { selectMenu } from 'components/AppHeader/appHeaderSlice';
import { MenuProps, MenuSecProps } from 'components/AppHeader/types';
import { FC, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
interface DrawerProps {
  setIsDrawerOpen: (s: boolean) => void;
  isOpen: boolean;
}

const NavDrawer: FC<DrawerProps> = ({ setIsDrawerOpen, isOpen }) => {
  const [isSiblingsOpen, setIsSiblingsOpen] = useState({});
  const [isSubmenuOpen, setIsSubmenuOpen] = useState({});
  // const menuData: MenuProps = useAppSelector(selectMenu);
  const ref = useRef<HTMLDivElement>();

  const store = useSelector(state => state.appHeader);
  const menuData: MenuProps = store.data.searchResult[0];

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
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
      return { ...prev, [i]: true };
    });
  }

  const showSubmenu = (i) => {
    setIsSubmenuOpen((prev) => {
      return { ...prev, [i]: !prev[i] };
    });
  }

  const getMenu = (data, level, index) => {

    let ulProps = {};

    // if(level===1) {
    //   showHide = 
    // }

    const r = data.sec.map((item, i) => {      
      return <React.Fragment key={level + '_' + i}>
        <li className={ (level===1 && i>3 && !isSiblingsOpen[i]) ? styles.hidden : ''}>
          {makeLink(item, level, i)}
          {level===1 && item.sec && <span className={!isSubmenuOpen[level+'_'+index] ? styles.rDown : styles.rUp} onClick={() => showSubmenu(level+'_'+index)}></span>}          
          {item.sec && getMenu(item, level + 1, index + '_' + i)}
        </li>
        {(level===1 && i===4 && !isSiblingsOpen[level+'_'+index+'_'+i]) && <li data-more={item.title} onClick={() => showMore(level+'_'+index+'_'+i)}>VIEW MORE FROM {item.title} +</li>}
        {level === 0 && <li className={styles.oneDotBdr}></li>}    
      </React.Fragment>
    });          

    if(level===1) {
      // ulProps = { className : !isSubmenuOpen[level+'_'+index] ? styles.hidden : styles.submenu}
    }
    return level!==0 ? <ul>{r}</ul> : r;
  }

  const makeLink = (data, level, index) => {
    console.log(level);
    if (!(data.shorturl || data.url)) {
      return <>{data.title} {level === 0 && <span className={styles.rArr}></span>}</>;
    }

    return (
      <Link href={data.shorturl ? data.shorturl : data.url}>
        <a className={isSubmenuOpen[index] && level === 1 ? styles.hasSubmenu : ''}>
          {data.title} {level === 0 && <span className={styles.rArr}></span>}
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
                  <li className={j > 3 && !isSiblingsOpen[i] ? styles.hidden : ''}>
                    {makeLink(item1, 1, i + '_' + j)}
                    {item1.sec && <>
                      <span className={!isSubmenuOpen[i + '_' + j] ? styles.rDown : styles.rUp} onClick={() => showSubmenu(i + '_' + j)}></span>
                      <ul className={!isSubmenuOpen[i + '_' + j] ? styles.hidden : styles.submenu}>{item1.sec.map((item2, k) => (
                        <React.Fragment key={'l2' + k}>
                          <li>
                            {makeLink(item2, 2, i + '_' + j + '_' + k)}
                          </li>
                        </React.Fragment>
                      ))}</ul></>}
                  </li>
                  {(j === 4 && !isSiblingsOpen[i]) && <li data-more={item.title} onClick={() => showMore(i)}>VIEW MORE FROM {item.title} +</li>}
                </React.Fragment>
                ))} </ul>}
              </li>
              <li className={styles.oneDotBdr}></li>
            </React.Fragment>
          ))}
          {getMenu(menuData, 0, 0)}
        </ul>
      </div>
    </nav> : null
  );
}

export default NavDrawer;