import type { NextApiHandler } from "next";
import { APP_ENV } from "../../utils";

const devTxt = `User-agent: *
Disallow: /
`;

const prodTxt = `
User-agent: *
Allow: /
Disallow: /PDAET/
Disallow: /7176/
Disallow: */notify.htm?*
Disallow: /default1.cms
Disallow: /default.cms
Disallow: /*rssarticleshow*
Disallow: /*cms.dll*
Disallow: /*/opinions/
Disallow: /pmcomment/
Disallow: /logtopickeywords.cms
Disallow: /logtopickeywords.cms?query=
Disallow: /researchview.cms?searchid=
Disallow: /researchviewcomm.cms?searchid=
Disallow: /articleshow_cmtofartac/
Disallow: /cmtofart/
Disallow: /cmtofartac_lp/
Disallow: /comments/
Disallow: /comment/
Disallow: /announcements.cms
Disallow: /analysis.cms
Disallow: *?adcode=*
Disallow: /etvertical_articleshow/
Disallow: /articleshow1/
Disallow: */params/smecompany/entityid-*
Disallow: /smelistings*
Disallow: *primeshow*
Disallow: */login.cms*
Disallow: /topic/*/photos*
Disallow: /topic/*/ampphoto*
Disallow: */topics_amp/*
Sitemap: https://economictimes.indiatimes.com/companylisting.cms 
Sitemap: https://economictimes.indiatimes.com/newssitemapindex.cms 
Sitemap: https://economictimes.indiatimes.com/etstatic/sitemaps/et/sitemap-index.xml 
Sitemap: https://economictimes.indiatimes.com/sitemapxml.cms 
Sitemap: https://economictimes.indiatimes.com/etstatic/sitemaps/etvideo/sitemap-index.xml
Sitemap: https://economictimes.indiatimes.com/sitemap/today
Sitemap: https://economictimes.indiatimes.com/sitemap/yesterday



User-agent: Googlebot-News
Allow: /
Disallow: /PDAET/
Disallow: /7176/
Disallow: */notify.htm?*
Disallow: /default1.cms
Disallow: /default.cms
Disallow: /*rssarticleshow*
Disallow: /*cms.dll*
Disallow: /*/opinions/
Disallow: /pmcomment/
Disallow: /logtopickeywords.cms
Disallow: /logtopickeywords.cms?query=
Disallow: /researchview.cms?searchid=
Disallow: /researchviewcomm.cms?searchid=
Disallow: /articleshow_cmtofartac/
Disallow: /cmtofart/
Disallow: /cmtofartac_lp/
Disallow: /comments/
Disallow: /comment/
Disallow: /announcements.cms
Disallow: /analysis.cms
Disallow: *?adcode=*
Disallow: /etvertical_articleshow/
Disallow: /articleshow1/
Disallow: */params/smecompany/entityid-*
Disallow: /smelistings*
Disallow: *primeshow*
Disallow: */login.cms*
Disallow: /topic/*/photos*
Disallow: /topic/*/ampphoto*
Disallow: */topics_amp/*
Sitemap: https://economictimes.indiatimes.com/companylisting.cms 
Sitemap: https://economictimes.indiatimes.com/newssitemapindex.cms 
Sitemap: https://economictimes.indiatimes.com/etstatic/sitemaps/et/sitemap-index.xml 
Sitemap: https://economictimes.indiatimes.com/sitemapxml.cms 
Sitemap: https://economictimes.indiatimes.com/etstatic/sitemaps/etvideo/sitemap-index.xml
Sitemap: https://economictimes.indiatimes.com/sitemap/today
Sitemap: https://economictimes.indiatimes.com/sitemap/yesterday
`;

const handler: NextApiHandler = (request, response) => {
  const isLive = APP_ENV === "development" ? false : true;
  response.status(200).send(isLive ? prodTxt : devTxt);
};

export default handler;
