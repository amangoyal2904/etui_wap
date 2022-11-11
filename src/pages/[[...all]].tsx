import { wrapper } from "app/store";
import { fetchArticle } from "Slices/article";
import { setCommonData } from "Slices/common";
import { fetchVideoshow } from "Slices/videoshow";
import { fetchVideoshowNew } from "Slices/videoshowNew";
import { fetchTopics } from "Slices/topics";
import { setIsPrime } from "Slices/login";
import { pageType, getMSID } from "utils";

const All = ({ page, data }) => null;
const expiryTime = 10 * 60;

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res, params, resolvedUrl }) => {
  const isprimeuser = req.headers?.primetemplate ? 1 : 0;
  // global.isprimeuser = isprimeuser;
  await store.dispatch(setIsPrime(isprimeuser));

  const { all = [] } = params;
  const lastUrlPart: string = all?.slice(-1).toString();
  let page = pageType(resolvedUrl);
  const msid = getMSID(lastUrlPart);

  switch (page) {
    case "home":
      // only set common data
      await store.dispatch(setCommonData({ page: "home", data: {} }));
      break;
    case "videoshow":
      await store.dispatch(fetchVideoshow(msid));
      break;
    case "videoshownew":
      await store.dispatch(fetchVideoshowNew(msid));
      break;
    case "articleshow":
      await store.dispatch(fetchArticle(msid));
      break;
    case "topic":
      await store.dispatch(fetchTopics(all));
      break;
    default:
      await store.dispatch(setCommonData({ page: "notFound", data: {} }));
      break;
  }
  const storeState = store.getState();
  const response = (await storeState) || {};
  const data = response?.[page]?.data || {};
  if (data?.error) {
    page = "notFound";
    await store.dispatch(setCommonData({ page: "notFound", data: {} }));
  }
  res.setHeader("Cache-Control", `public, s-maxage=${expiryTime}, stale-while-revalidate=${expiryTime * 2}`);
  res.setHeader("Expires", new Date(new Date().getTime() + expiryTime * 1000).toUTCString());

  return {
    props: {
      page,
      response,
      isprimeuser
    }
  };
});
export default All;
