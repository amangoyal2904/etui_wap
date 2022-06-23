export interface versionControlProps {
  seo?: {
    org_img?: string;
    org_img_hin?: string;
  };
  dfp: dfpProps;
  cpd_wap?: string;
}
interface adProps {
  adSlot?: string;
  adSize?: [];
}
interface dfpProps {
  atf?: adProps;
  fbn?: adProps;
}
