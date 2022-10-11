
export const removeBackSlash = val => {
  val = val && typeof val != "object" ? val.replace(/\\/g, "") : "";
  return val;
};
export const formatDate = (sd, pageName) => {
  let timeStamp:any = "";
  let pageType:any = pageName || '';
  try {
    sd = sd || "";
    if (typeof sd !== "undefined" && sd != "" && sd != "undefined") {
      sd = sd.replace(/-/g, " ");
      let cd:Date = new Date();
      if (!sd) return "";
      sd = new Date(sd);
      let defaultTimeStamp = (sd.toDateString().substr(0, 3) + ", " + sd.getDate() + " " + sd.toDateString().substr(4, 3) + " " + sd.getFullYear()) || "";
      if (cd.getTime() < sd.getTime()) return;
      let chk:number = 0;
      let diff:number = Math.abs(cd.getTime() - sd.getTime());
      diff = diff / 1000 / 60;
      chk = diff % 60;
      if (diff <= 1440) {
        if (diff < 60) {
          if (diff < 2) {
            timeStamp = pageType != 'PWA HP' ? parseInt(diff) + " Minute ago" : "Now";
          } else {
            timeStamp = parseInt(diff) + " Minutes ago";
          }
        }else if(60 < diff && diff < 120){
            timeStamp = Math.floor(diff / 60) + " Hour ago";
        }else if(diff > 360 && pageType == 'PWA HP'){
            timeStamp = defaultTimeStamp;
        }else{
            timeStamp = Math.floor(diff / 60) + " Hours ago";
        }
      } else {
        timeStamp = defaultTimeStamp;
      }
    }
  } catch (e) {
    console.log("error in formatDate", e);
  }
  return timeStamp;
};

export default {removeBackSlash, formatDate};