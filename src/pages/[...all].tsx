import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const ArticleList = dynamic(() => import('containers/ArticleList'))
const ArticleShow = dynamic(() => import('containers/ArticleShow'))

interface Query {
  all: string[]
}

export default function All() {

  const router = useRouter();
  const { all } = router.query;

  /**
   * check if articleshow
   * 
   * Articleshow pattern consists of:
   * a. 89622565.cms as last url comonent
   * b. articleshow as the second last url component
   */    
  const lastUrlComponent: string = all.slice(-1).toString();
  const secondLastUrlComponent: string = all.slice(-2, -1).toString();

  if(/^[0-9]+\.cms$/.test(lastUrlComponent) && secondLastUrlComponent==='articleshow') {
    return <ArticleShow query={all} />;
  } else {
    return <ArticleList query={all} />;
  }

}

export async function getServerSideProps({ params, req, res, query, preview, previewData, resolvedUrl, locale, locales, defaultLocale }) {
  return { props: {} }
}   