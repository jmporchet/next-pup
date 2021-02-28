import { Page } from "puppeteer";

const { isPast } = require("date-fns");
const puppeteer = require("puppeteer");

export const login = async (
  PUPPETEER_OPTIONS: any,
  login: string,
  password: string
) => {
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
  const page = await browser.newPage();

  await page.goto("https://www.vku-pgs.asa.ch/fr/login#");

  await page.setViewport({ width: 1440, height: 766 });

  await page.waitForSelector("#wrapper #username");

  await page.type("#wrapper #username", login);
  await page.type("#wrapper #password", password);

  await page.waitForSelector("#wrapper #_submit");
  await page.click("#wrapper #_submit");

  // wait until kyJS is loaded and usable
  const watchDog = page.waitForFunction('typeof(kyJS) != "undefined"');
  await watchDog;
  return { browser, page };
};

export const addEleve = async (page: Page, faber: string, bday: string) => {
  // open the popup
  await page.evaluate(() => {
    // @ts-ignore defined in the target webpage
    kyJS.portal.openModal("/fr/person/newportal", "new", "person", "check");
  });

  await page.waitForSelector("#kyberna_VkuBundle_person", {
    visible: true,
  });

  await page.type(
    "input#kyberna_VkuBundle_person_personDetail_name.license-name.form-control",
    faber
  );
  await page.type(
    "input#kyberna_VkuBundle_person_birthDate.datetime-picker.form-control",
    bday
  );

  // validate preliminary info
  await page.click("#wrapper .modal-footer .btn-success");

  // get first and last name
  await page.waitForSelector("#kyberna_VkuBundle_person_firstname");
  const firstName = await page.$eval(
    "#kyberna_VkuBundle_person_firstname",
    (e: Element) => (e as HTMLInputElement).value
  );
  const lastName = await page.$eval(
    "#kyberna_VkuBundle_person_lastname",
    (e: Element) => (e as HTMLInputElement).value
  );

  // post the full form
  await page.waitForTimeout(200);
  await page.click("#wrapper .modal-footer .btn-success");
  await page.waitForSelector("#search-person");
  return { firstName, lastName };
};

export const searchEleve = async (page: Page, { firstName, lastName }: any) => {
  await page.waitForSelector("#search-person");
  await page.type("#search-person", lastName + " " + firstName);
  await page.waitForTimeout(100);
  await page.evaluate(() => {
    // @ts-ignore defined in the target webpage
    kyJS.portal.search("person", "/fr/person/portal");
  });
  await page.waitForTimeout(200);
  const personId = await page.$eval(
    "#person-widget tr:nth-child(2)",
    (el) => el.id
  );
  // format is "id_person_501256"
  const personNr = personId.split("_")[2];
  await page.evaluate(() => {
    // @ts-ignore defined in the target webpage
    kyJS.portal.emptySearchBox("person", "/fr/person/portal");
  });
  await page.waitForTimeout(200);
  return personNr;
};

export const searchCourse = async (page: Page) => {
  // get the first upcoming class
  const allCourses = await page.$$eval(
    "th.coursegroup.droppable.ui-droppable a span",
    (course) => course.map((c: Element) => (c as HTMLInputElement).innerText)
  );

  const futureCourses = allCourses
    // Sensi 11.01.2021 CTC
    .map((courseText) => courseText.split(" ")[1])
    .filter((courseDate) => {
      // chromium has an american locale?
      const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
      const date = courseDate.replace(pattern, "$2.$1.$3");

      return isPast(new Date(date));
    });

  const courseId = await page.$eval(
    "th.coursegroup.droppable.ui-droppable",
    (el) => el.id
  );
  // format is "coursegroup_256260"
  const courseNr = courseId.split("_")[1];
  return courseNr;
};

export const getCourses = async (page: Page) => {
  const courseIds = await page.$$eval(
    "th.coursegroup.droppable.ui-droppable",
    (els: Element[]) =>
      els.map((el) => ({
        id: el.id.split("_")[1],
        date: (el as HTMLElement).innerText,
      }))
  );
  // format is "coursegroup_256260"
  // const courseNr = courseId.split("_")[1];
  return courseIds;
};

export const addEleveToCourse = async (
  page: Page,
  personNr: string,
  courseNr: string
) => {
  return await page.evaluate(
    async ({ courseNr, personNr }) => {
      const response = await fetch(
        `https://www.vku-pgs.asa.ch/fr/coursegroup/${courseNr}/link/person/${personNr}`,
        { method: "PUT" }
      );
      const json = await response.json();
      return json;
    },
    { courseNr, personNr }
  );
};

export const switchSections = async (page: Page, section: string) => {
  if (section === "sensibilisation") {
    await page.goto("https://www.vku-pgs.asa.ch/fr/sectionchange/vku", {
      waitUntil: "networkidle2",
    });
    await page.goto(
      "https://www.vku-pgs.asa.ch/fr/?all_person=1&coursegroup_old=0&all_instr=0",
      { waitUntil: "networkidle2" }
    );
    return await page.waitForTimeout(200);
  }
  if (section === "moto") {
    await page.goto("https://www.vku-pgs.asa.ch/fr/sectionchange/pgs", {
      waitUntil: "networkidle2",
    });
    await page.goto(
      "https://www.vku-pgs.asa.ch/fr/?all_person=1&coursegroup_old=0&all_instr=0",
      { waitUntil: "networkidle2" }
    );
    return await page.waitForTimeout(200);
  }
  console.log("switch section called without a valid section", section);
  return false;
};

export const PUPPETEER_OPTIONS = {
  headless: true,
  args: [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-first-run",
    "--no-sandbox",
    "--no-zygote",
    "--single-process",
    "--proxy-server='direct://'",
    "--proxy-bypass-list=*",
    "--deterministic-fetch",
  ],
};
