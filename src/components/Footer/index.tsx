import { FC } from 'react';
import useRequest from 'network/service';

const Footer: FC<any> = ({data}) => {
  console.log(data);
  return (
    <footer>
      Footer
      {data}
      12
    </footer>
  );
}

export default Footer;

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

export async function getServerSideProps(context) {
  const { data, isLoading, error } = useRequest<{
    searchResult: MenuProps,
    parameters: Object
  }>({
    url: "request",
    params: { type: "menu" }
  });

  console.log(data);

  return {
    props: {
      data
    }, // will be passed to the page component as props
  }
}