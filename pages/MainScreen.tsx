import { useState, useEffect } from "react";
import { useQuery } from "react-query";

import styles from "../styles/Home.module.css";

interface Props {
  sariUsername: string;
  sariPassword: string;
}

export function MainScreen({ sariUsername, sariPassword }: Props) {
  const [eleves, setEleves] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [result, setResult] = useState<any[]>([]);

  const { isLoading, error, data, isFetching } = useQuery("sariData", () =>
    fetch(
      `http://localhost:3000/api/courses?username=${sariUsername}&password=${sariPassword}`
    ).then((res) => res.json())
  );

  async function handleClick() {
    if (selectedCourse === "") {
      setResult([{ message: "selectedCourse error" }]);
      return false;
    }
    if (eleves.length < 15 || !eleves.includes(",")) {
      setResult([{ message: "eleve array error" }]);
      return false;
    }
    const domaine = data.courses.sensi.find(
      (course: any) => course.id === selectedCourse
    )
      ? "sensibilisation"
      : data.courses.moto.find((course: any) => course.id === selectedCourse)
      ? "moto"
      : "";
    if (domaine === "") {
      setResult([{ message: "domaine error" }]);
      return false;
    }

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
          username: sariUsername,
          password: sariPassword,
        }),
        method: "post",
      });
      const result = await res.json();
      setResult(result[0].result);
    } catch (e) {
      setResult(["Erreur: " + e]);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return <p>loading</p>;
  if (isFetching) return <p>fetching</p>;
  if (error) return <p>error {error}</p>;
  if (data.courses.sensi.length === 0 && data.courses.moto.length === 0)
    return <p>wrong login or no courses</p>;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>Liste des cours de sensi</h3>
        {data.courses.sensi.map((course: any) => (
          <>
            <a
              className={styles.link}
              style={{
                fontWeight: selectedCourse === course.id ? "bold" : "normal",
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
        <h3>Liste des cours de moto</h3>
        {data.courses.moto.map((course: any) => (
          <>
            <a
              className={styles.link}
              style={{
                fontWeight: selectedCourse === course.id ? "bold" : "normal",
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
        <h3>Resultat</h3>
        {result.map((res: any) => {
          typeof res === "object" ? (
            <p>
              {res.course}:{" "}
              {Object.keys(messages).includes(res.message)
                ? // @ts-ignore
                  messages[res.message]
                : res.message}
            </p>
          ) : (
            <p>{res}</p>
          );
        })}
      </div>
    </div>
  );
}

const messages = {
  "course.notenabled": "cours non activé",
  "person.already.added": "déjà ajouté",
};
