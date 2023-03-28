import type { NextApiRequest, NextApiResponse } from "next";
import { fetchShortsVideos } from "apiUtils/etshorts";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const data = await fetchShortsVideos();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
