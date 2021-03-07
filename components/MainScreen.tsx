import { useState } from "react";
import { useQuery } from "react-query";

import { Resultat } from "./Resultat";
import { Cours } from "./Cours";

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

  const url =
    process.env.GCLOUD_API_URL === "localhost"
      ? `http://localhost:8080/api/v1/courses?username=${sariUsername}&password=${sariPassword}`
      : `https://${process.env.GCLOUD_API_URL}/courses?username=${sariUsername}&password=${sariPassword}`;
  const { isLoading, error, data, isFetching } = useQuery("sariData", () =>
    fetch(url).then((res) => res.json())
  );

  async function handleClick() {
    if (selectedCourse === "") {
      setResult(["Choisissez un cours avant"]);
      return false;
    }
    if (eleves.length < 15 || !eleves.includes(",")) {
      setResult(["Le format des infos de l'élève est faux"]);
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
      setResult(["Erreur de domaine Sari"]);
      return false;
    }

    setLoading(true);
    setResult([""]);
    try {
      const url =
        process.env.GCLOUD_API_URL === "localhost"
          ? `http://localhost:8080/api/v1/courses?username=${sariUsername}&password=${sariPassword}`
          : `https://${process.env.GCLOUD_API_URL}/addStudentsToCourse`;
      const res = await fetch(url, {
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

  if (isLoading) return <p>Chargement des données...</p>;
  if (isFetching) return <p>Chargement des données...</p>;
  if (error) return <p>Erreur {error}</p>;
  if (data.courses.sensi.length === 0 && data.courses.moto.length === 0)
    return (
      <p>
        Les infos de connexion sont fausses ou il n'y a pas de cours.
        Déconnectez-vous et essayez à nouveau.
      </p>
    );

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>Cours de sensi</h3>
        <Cours
          courseData={data.courses.sensi}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />
      </div>

      <div className={styles.card}>
        <h3>Cours moto</h3>
        <Cours
          courseData={data.courses.moto}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />
      </div>

      <div className={styles.card}>
        <h3>faber,date de naissance</h3>
        <textarea
          rows={12}
          cols={30}
          value={eleves}
          onChange={(e) => setEleves(e.target.value)}
          placeholder="Par exemple:&#10;0068.123.456,12.01.1999&#10;68123456,12.01.99&#10;Un élève par ligne."
        />
        <button type="submit" disabled={loading} onClick={handleClick}>
          Envoyer
        </button>
      </div>

      <div className={styles.card}>
        <h3>Resultat</h3>
        <Resultat result={result} />
      </div>
    </div>
  );
}

export default MainScreen;
