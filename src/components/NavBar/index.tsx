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
  logo: string;
  sec: MenuSecProps[];
}

const NavBar: FC = () => {

  const { data, isLoading, error } = useRequest<{
    searchResult: MenuProps,
    parameters: Object
  }>({
    url: "request",
    params: { type: "menu1" }
  });

  if (isLoading) return <Loading />
  if (error) return <div>Please try again!</div>

  return (
    <nav className={styles.navBar}>
      <Link href={data.searchResult[0].url}>
        <a className={styles.active}>{data.searchResult[0].title}</a>
      </Link>
      {data.searchResult[0].sec.map((item: MenuSecProps, i) => (
        <Link href={item.url ? item.url : '/'} key={i}>
          <a>
            {item.title}
          </a>
        </Link>
      ))}
    </nav>
  );
}

export default NavBar;