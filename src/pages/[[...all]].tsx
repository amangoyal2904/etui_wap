import { wrapper } from "app/store";
import { fetchArticle } from "Slices/article";
import { setCommonData } from "Slices/common";
import { fetchVideoshow } from "Slices/videoshow";
import { setIsPrime } from "Slices/login";
import { pageType, getMSID } from "utils";

const All = ({ page, data }) => null;

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res, params, resolvedUrl }) => {
  const isprimeuser = req.headers?.primetemplate ? 1 : 0;
  // global.isprimeuser = isprimeuser;
  await store.dispatch(setIsPrime({ isprimeuser }));

  const { all = [] } = params;
  const lastUrlPart: string = all?.slice(-1).toString();
  const page = pageType(resolvedUrl);
  const msid = getMSID(lastUrlPart);

  switch (page) {
    case "home":
      // only set common data
      await store.dispatch(setCommonData({ page: "home", data: {} }));
      break;
    case "videoshow":
      await store.dispatch(fetchVideoshow(msid));
      break;
    case "articleshow":
      await store.dispatch(fetchArticle(msid));
      break;
    default:
      break;
  }
  const storeState = store.getState();
  const response = (await storeState) || {};

  return {
    props: {
      page,
      response,
      isprimeuser
    }
  };
});
export default All;
