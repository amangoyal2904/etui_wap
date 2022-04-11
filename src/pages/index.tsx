import type { NextPage } from 'next'
import Home from 'containers/Home';

const IndexPage: NextPage = () => {
  return <Home />
}

export default IndexPage

export async function getServerSideProps({ params, req, res, query, preview, previewData, resolvedUrl, locale, locales, defaultLocale }) {
  console.log('getServerSideProps IndexPage called')
  try {
    // Fetch data from external API
    const res = await fetch(`https://etdev8243.indiatimes.com/version_control.cms?feedtype=json&ref=pwaapi`)
    const objVc = await res.json()

    // Pass data to the page via props
    return { props: { objVc } }
  } catch (err) {
    console.log('err in getServerSideProps')
    return { props: {} }
  }
}