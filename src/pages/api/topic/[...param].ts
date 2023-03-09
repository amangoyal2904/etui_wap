import { NextApiRequest, NextApiResponse } from "next";
import { topicJSON } from "../../../apiUtils/topic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  query: { param: string } | null = null
): Promise<void> {
  try {
    const { param } = query || req.query;
    const data = await topicJSON({ param, isCacheBrust: false, callType: "Api" });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
