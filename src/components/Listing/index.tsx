import { FC } from 'react';
import Link from 'next/link';
import styles from "./styles.module.scss";
import useRequest from 'network/service'
import Loading from 'components/Loading';

const SampleListing: FC = () => {
    const { data, isLoading, error } = useRequest<{
        searchResult: Array<Object>,
        parameters: Object
    }>({
        url: "request",
        params: { type: "plist", "msid": 2146843 }
    })
    if (isLoading) return <Loading />
    if (error) return <div>Please try again!</div>

    const listData = data?.searchResult?.[0]?.["data"] || [];
    return (
        <ul className={styles.list}>
            {listData && listData.map(item => <li className={styles.list} key={item.msid}><Link href={item.url.replace("https://m.economictimes.com", "")}>{item.title}</Link></li>)}
        </ul>
    )
}

export default SampleListing;