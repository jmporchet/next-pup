// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { RequestOptions } from "http";
import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: "John Doe" });
};
