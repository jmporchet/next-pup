import { NextApiRequest, NextApiResponse } from "next";
import {
  login,
  PUPPETEER_OPTIONS,
  switchSections,
  getCourses,
} from "../../utils/puppeteer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { page, browser } = await login(PUPPETEER_OPTIONS);
  await switchSections(page, "sensibilisation");
  const sensiList = await getCourses(page);
  await switchSections(page, "moto");
  const motoList = await getCourses(page);

  await browser.close();
  res.json({
    courses: {
      sensi: sensiList,
      moto: motoList,
    },
  });
};