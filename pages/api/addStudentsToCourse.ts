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
  const { eleves, courseId } = JSON.parse(req.body);
  if (Array.isArray(eleves) && !!courseId) {
    let results = [];
    const { page, browser } = await login(PUPPETEER_OPTIONS);
    await switchSections(page, "sensibilisation");
    for (const eleve of eleves) {
      const { firstName, lastName } = await addEleve(
        page,
        eleve.faber,
        eleve.bday
      );
      const eleveNr = await searchEleve(page, { firstName, lastName });
      const result = await addEleveToCourse(page, eleveNr, courseId);
      results.push({ name: firstName + " " + lastName, result });
    }
    await browser.close();
    res.json(JSON.stringify(results));
  } else {
    res.status(404).json({});
  }
  // const courseList = await getCourses(page);

  // await browser.close();
  // res.json({ courses: courseList });
};
