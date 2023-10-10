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

const handler: NextApiHandler = async (request, response) => {
  try {
    const reqQuery = request && request.query ? request.query : {};
    const url = reqQuery && reqQuery.url ? reqQuery.url : "";
    //console.log('request.query', request.query)
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
