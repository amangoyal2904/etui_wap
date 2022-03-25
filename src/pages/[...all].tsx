import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const ArticleList = dynamic(() => import('containers/ArticleList'))
const ArticleShow = dynamic(() => import('containers/ArticleShow'))
const VideoShow = dynamic(() => import('containers/VideoShow'))
import {wrapper} from 'app/store';
import {fetchArticle} from "Slices/article"
import { useStore} from 'react-redux';
import {pageType} from "utils/utils";
import APIS_CONFIG from "network/config.json";
import Service from 'network/service';
interface Query {
  all: string[]
}


export default function All(props) {

  const router = useRouter();
  const { all } = router.query;
  let storeState = useStore().getState();
  if(props.page && props.page == "articleshow") {
    return <ArticleShow query={all} data={storeState.article} />;
  } else if(props.page && props.page == "videoshow") {
    return <VideoShow query={all} data={props.data} />;
  } else {
    return <ArticleList query={all} />;
  }

}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({params, resolvedUrl}) => {
  const { all } = params;  
  const lastUrlComponent: string = all.slice(-1).toString();

  let page = pageType(resolvedUrl);
  let data = {};
  
  if(page == 'articleshow') {
    await store.dispatch(fetchArticle(lastUrlComponent.split(".cms")[0]));
  } else if(page == 'videoshow') {
    let url = 'https://etdev8243.indiatimes.com/reactfeed.cms?feedtype=etjson&type=videoshow&msid=90067526&platform=wap';
		// const { data } = await Service.get(url);
    let res = await fetch(url);
    data = await res.json();
  } else {
    console.log("came in articlelist");
  }

  return {     
    props: {
      page,
      data
    }
   }
});   