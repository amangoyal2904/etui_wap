import type { NextApiHandler } from 'next'

const handler: NextApiHandler = (request, response) => {
  response.status(200).json({ searchResult: [] })
}

export default handler;