import { google } from "googleapis";
import type { NextApiHandler } from "next";

import key from "./service_account.json";
const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/indexing"],
  null
);
const callIndexingAPI = async (url) => {
  try {
    //console.log('___gettokens________apiUrl____',url);
    const tokens = await jwtClient.authorize();
    //console.log('___tokensl____',tokens);
    const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.access_token}`
      },
      body: JSON.stringify({
        url,
        type: "URL_UPDATED"
      })
    });
    //console.log('___gettokens________responseapiUrl____',response);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const GET_URL_FROM_canvasmaker = async (msid: any) => {
  try {
    const resData = await fetch(`https://economictimes.indiatimes.com/geturlfeed.cms?msid=${msid}&feedtype=json`);
    const data = await resData.json();
    //console.log('data',data.longUrl);

    if (data && data.longUrl && data.longUrl !== "") {
      return data.longUrl;
    }
    return "";
  } catch (error) {
    console.log("error", error);
    return "";
  }
};

const handler: NextApiHandler = async (request, response) => {
  try {
    const msid = request && request.body && request.body.msid ? request.body.msid : "";
    // const mstype = request && request.body && request.body.mstype ? request.body.mstype : "";
    // const hostId = request && request.body && request.body.hostId ? request.body.hostId : "";
    const operation = request && request.body && request.body.operation ? request.body.operation : "";

    if (msid === "" || operation === "") {
      return response
        .status(400)
        .json({ message: "failed", text: "All parameter  are must  - msid, mstype, hostId, operation" });
    }

    if (operation !== "add") {
      return response.status(400).json({ message: "failed", text: "operation param is not equal to  add" });
    }

    const url = await GET_URL_FROM_canvasmaker(msid);

    if (request && request.method !== "POST") {
      return response.status(400).json({ message: "failed", text: "Only Post Method Allowed" });
    }

    if (url && url !== "") {
      const dataSendAPI = await callIndexingAPI(url);
      return response.status(201).json({
        message: "success",
        text: "successfully post url Google API",
        googleAPIResponse: dataSendAPI
      });
    }
    return response.status(400).json({ message: "failed", text: "URL is blank" });
  } catch (error) {
    console.log("error", error);
    return response.status(500).json({ message: "fail", text: "fail to post Google API" });
  }
};
export default handler;
