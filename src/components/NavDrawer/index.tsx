import Link from 'next/link';
import { FC } from 'react';
import styles from './styles.module.scss';
import useRequest from 'network/service'
import Loading from 'components/Loading';

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

const NavDrawer: FC = () => {

  const { data, isLoading, error } = useRequest<{
    searchResult: MenuProps,
    parameters: Object
  }>({
    url: "request",
    params: { type: "menu1" }
  });

  console.log(data);

  if (isLoading) return <Loading />
  if (error) return <div>Please try again!</div>

  return (
    <nav className={styles.drawer}>
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
          {data.searchResult[0].sec.map((item: MenuSecProps, i) => (
            <>
            <li key={i}>
              <Link href="">
                <a>
                  {item.title}
                </a>
              </Link>
              {item.sec && <ul> {item.sec?.map(item1 => (
                <li>{item1.title}</li>
              ))} </ul>}
            </li>
            <li className={styles.oneDotBdr}></li>
            </>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default NavDrawer;