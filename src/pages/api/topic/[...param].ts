import { NextApiRequest, NextApiResponse } from "next";
import { topicJSON } from "../../../apiUtils/topic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  query: { param: string[]; upcache: number } | null = null
): Promise<void> {
  try {
    const { param, upcache } = query || req.query;
    const isCacheBrust = typeof upcache !== "undefined" && (upcache == 2 || upcache == 3) ? true : false;
    const data = await topicJSON({ param, isCacheBrust, callType: "Api" });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
