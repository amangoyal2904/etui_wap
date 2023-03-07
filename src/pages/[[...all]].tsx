import { pageType, getMSID, prepareMoreParams } from "utils";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { pageJSON } from "./api/topic/[...param]";

const All = () => null;
const expiryTime = 10 * 60 * 6 * 4; // seconds

export async function getServerSideProps({ req, res, params, resolvedUrl }) {
  const isprimeuser = req.headers?.primetemplate ? 1 : 0;
  const { all = [] } = params;
  const lastUrlPart: string = all?.slice(-1).toString();
  const msid = getMSID(lastUrlPart);

  let page = pageType(resolvedUrl, msid, all);
  const api = APIS_CONFIG.FEED;

  let extraParams = {},
    response: any = {};

  console.log("===================================");
  console.log("req.query---", params);
  console.log("===================================");

  // if(page == "topic"){
  //   response = await pageJSON(all)
  //   const { subsecnames = {} } = response.seo;
  //   extraParams = subsecnames
  //     ? {
  //         subsec1: subsecnames.subsec1,
  //         subsec2: subsecnames.subsec2
  //       }
  //     : {};
  //     console.log("response---123", response.searchResult[0].data)
  // } else
  if (page !== "notfound") {
    const moreParams = prepareMoreParams({ all, page, msid });

    console.log("===================================");
    console.log("req.moreParams---", moreParams);
    console.log("===================================");

    //==== gets page data =====
    const apiType = page === "videoshownew" ? "videoshow" : page;

    const result =
      apiType != "topic" &&
      (await Service.get({
        api,
        params: { type: apiType, platform: "wap", feedtype: "etjson", ...moreParams }
      }));
    response = apiType == "topic" ? await pageJSON(all) : result.data;
    const { subsecnames = {} } = response.seo;

    console.log("===================================");
    console.log("response---", response);
    console.log("===================================");

    extraParams = subsecnames
      ? {
          subsec1: subsecnames.subsec1,
          subsec2: subsecnames.subsec2
        }
      : {};

    if (response && response.error) page = "notfound";
  }

  //==== gets dyanmic footer data =====
  let dynamicFooterData = {};

  if (page !== "quickreads") {
    const footerMenu = await Service.get({
      api,
      params: { type: "footermenu", feedtype: "etjson", ...extraParams, template_name: page }
    });
    dynamicFooterData = footerMenu.data || {};
  }

  //==== sets response headers =====
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${expiryTime}, must-revalidate, stale-while-revalidate=${expiryTime * 2}`
  );
  res.setHeader("Expires", new Date(new Date().getTime() + expiryTime * 1000).toUTCString());

  if (page === "notfound") res.statusCode = "404";

  return {
    props: {
      page,
      response,
      isprimeuser,
      dynamicFooterData
    }
  };
}
export default All;
