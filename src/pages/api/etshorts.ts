import type { NextApiHandler } from "next";

const handler: NextApiHandler = (request, response) => {
  const api = `https://cloudservices.indiatimes.com/cms-api/hierarchy/98357754?hostid=153&format=json&mode=medium&sortby=rank&perpage=6&pageno=1&level=leaf&contenttype=ALL&ref=pwaapi`;

  fetch(api, {
    method: "GET"
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  response.status(200).json({ searchResult: [] });
};

export default handler;
