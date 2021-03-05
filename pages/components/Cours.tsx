import styles from "../../styles/Home.module.css";

interface Props {
  courseData: CourseInfo[];
  selectedCourse: string;
  setSelectedCourse: (id: string) => void;
}
interface CourseInfo {
  id: string;
  date: string;
}

export function Cours({
  courseData,
  selectedCourse,
  setSelectedCourse,
}: Props) {
  if (!Array.isArray(courseData)) return <p>Aucun cours</p>;
  return (
    <>
      {courseData.map((course: CourseInfo) => (
        <div
          key={course.id}
          className={
            selectedCourse === course.id
              ? styles.courseRow + " " + styles.courseRowSelected
              : styles.courseRow
          }
        >
          <a
            className={styles.link}
            onClick={() => setSelectedCourse(course.id)}
            key={course.id}
          >
            {course.date.substr(0, course.date.length - 4)} - {course.id}
          </a>
        </div>
      ))}
    </>
  );
}
