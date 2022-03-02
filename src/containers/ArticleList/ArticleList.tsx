import { FC } from 'react';

interface pageProps {
  query: string | string[]
}

const ArticleList: FC<pageProps> = ({query}) => {
  return (
    <>
      <div className="root">
        ArticleList
      </div>
    </>
  )
}

export default ArticleList;