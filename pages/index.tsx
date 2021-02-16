import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";

export default function Home(props: any) {
  const [eleves, setEleves] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  async function handleClick() {
    if (selectedCourse === "") return false;
    if (!Array.isArray(eleves) || eleves.length < 1) return false;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/addStudentsToCourse", {
        body: JSON.stringify({
          eleves: eleves.split("\n").reduce((list: any[], line: string) => {
            const [faber, bday] = line.split(",");
            return [...list, { faber, bday }];
          }, []),
          courseId: selectedCourse,
        }),
        method: "post",
      });
      console.log("res", await res.json());
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false);
    }
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
            <h3>Liste des cours de sensi</h3>
            {props.courses.sensi.map((course: any) => (
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
            <h3>Learn &rarr;</h3>
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
            {props.courses.moto.map((course: any) => (
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

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await fetch("http://localhost:3000/api/courses");
  const courses = await res.json();

  // By returning { props: courses }, the component
  // will receive `courses` as a prop at run time
  return {
    props: courses,
  };
}
