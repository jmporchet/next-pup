import { NextApiRequest, NextApiResponse } from "next";
import {
  login,
  PUPPETEER_OPTIONS,
  switchSections,
  addEleve,
  searchEleve,
  addEleveToCourse,
} from "../../utils/puppeteer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { eleve, courseId, domaine, username, password } = JSON.parse(req.body);
  if (!!eleve.faber && !!eleve.bday && !!courseId) {
    const { page, browser } = await login(
      PUPPETEER_OPTIONS,
      username,
      password
    );
    await switchSections(page, domaine);
    const { firstName, lastName } = await addEleve(
      page,
      eleve.faber,
      eleve.bday
    );
    const eleveNr = await searchEleve(page, { firstName, lastName });
    const result = await addEleveToCourse(page, eleveNr, courseId);
    await browser.close();
    res.json(JSON.stringify(result));
  } else {
    res.status(404).json({});
  }
  // const courseList = await getCourses(page);

  // await browser.close();
  // res.json({ courses: courseList });
};
