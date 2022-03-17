import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const ArticleList = dynamic(() => import('containers/ArticleList'))
const ArticleShow = dynamic(() => import('containers/ArticleShow'))
import {wrapper} from '../app/store';
import {fetchArticle} from "../Slices/article"
import { useStore, useSelector} from 'react-redux';

interface Query {
  all: string[]
}


export default function All(props) {

  const router = useRouter();
  const { all } = router.query;
  let storeState = useStore().getState();
  if(props.page && props.page == "articleshow") {
    return <ArticleShow query={all} data={storeState.article} />;
  } else {
    return <ArticleList query={all} />;
  }

}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({params}) => {
  const { all } = params;
  const lastUrlComponent: string = all.slice(-1).toString();
  const secondLastUrlComponent: string = all.slice(-2, -1).toString();
  let page = "articlelist";
  if(/^[0-9]+\.cms$/.test(lastUrlComponent) && secondLastUrlComponent==='articleshow') {
    page = "articleshow";
    await store.dispatch(fetchArticle(lastUrlComponent.split(".cms")[0]));
  } else {
    page = "articlelist";
    console.log("came in articlelist");
  }

  return {     
    props: {
      page
    }
   }
});   