import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home(props: any) {
  const [eleves, setEleves] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [sariUsername, setSariUsername] = useState("");
  const [sariPassword, setSariPassword] = useState("");
  const [courses, setCourses] = useState({ sensi: [], moto: [] });

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch(
        `http://localhost:3000/api/courses?username=${sariUsername}&password=${sariPassword}`
      );
      const courses = await res.json();
      console.log("courses: ", courses);
      setCourses({ sensi: courses.courses.sensi, moto: courses.courses.moto });
    }
    if (sariUsername !== "" && sariPassword !== "") {
      fetchCourses();
    }
  }, [sariUsername, sariPassword]);

  async function handleClick() {
    if (selectedCourse === "") {
      setResult([{ message: "selectedCourse error" }]);
      return false;
    }
    if (eleves.length < 15 || !eleves.includes(",")) {
      setResult([{ message: "eleve array error" }]);
      return false;
    }
    const domaine = courses.sensi.find(
      (course: any) => course.id === selectedCourse
    )
      ? "sensibilisation"
      : courses.moto.find((course: any) => course.id === selectedCourse)
      ? "moto"
      : "";
    if (domaine === "") {
      setResult([{ message: "domaine error" }]);
      return false;
    }

    // return console.log(selectedCourse, eleves, domaine);
    setLoading(true);
    setResult([""]);
    try {
      const res = await fetch("http://localhost:3000/api/addStudentsToCourse", {
        body: JSON.stringify({
          eleves: eleves.split("\n").reduce((list: any[], line: string) => {
            const [faber, bday] = line.trim().split(",");
            return [...list, { faber, bday }];
          }, []),
          courseId: selectedCourse,
          domaine,
        }),
        method: "post",
      });
      const result = await res.json();
      setResult(result[0].result);
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  }

  function handleFetch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSariUsername(e.target.elements.login.value);
    setSariPassword(e.target.elements.password.value);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Gestion Sari</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Gestion Sari</h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Codes d'accès Sari</h3>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleFetch(e)}
            >
              <input type="text" name="login" defaultValue="" />
              <input type="password" name="password" defaultValue="" />
            </form>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Liste des cours de sensi</h3>
            {courses.sensi.map((course: any) => (
              <>
                <a
                  className={styles.link}
                  style={{
                    fontWeight:
                      selectedCourse === course.id ? "bold" : "normal",
                    color: selectedCourse === course.id ? "#0070f3" : "",
                  }}
                  onClick={() => setSelectedCourse(course.id)}
                  key={course.id}
                >
                  {course.date.substr(0, course.date.length - 4)} - {course.id}
                </a>
                <br />
              </>
            )) || <p>no courses</p>}
          </div>

          <div className={styles.card}>
            <h3>faber,date de naissance</h3>
            <textarea
              rows={12}
              cols={30}
              value={eleves}
              onChange={(e) => setEleves(e.target.value)}
            />
            <button type="submit" disabled={loading} onClick={handleClick}>
              Submit
            </button>
          </div>

          <div className={styles.card}>
            <h3>Liste des cours de moto</h3>
            {courses.moto.map((course: any) => (
              <>
                <a
                  className={styles.link}
                  style={{
                    fontWeight:
                      selectedCourse === course.id ? "bold" : "normal",
                    color: selectedCourse === course.id ? "#0070f3" : "",
                  }}
                  onClick={() => setSelectedCourse(course.id)}
                  key={course.id}
                >
                  {course.date.substr(0, course.date.length - 4)} - {course.id}
                </a>
                <br />
              </>
            )) || <p>no courses</p>}
          </div>

          <div className={styles.card}>
            <h3>Resultat</h3>
            {result.map((res: any) => (
              <p>
                {res.course}:{" "}
                {Object.keys(messages).includes(res.message)
                  ? // @ts-ignore
                    messages[res.message]
                  : res.message}
              </p>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

const messages = {
  "course.notenabled": "cours non activé",
  "person.already.added": "déjà ajouté",
};
