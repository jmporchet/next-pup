interface Props {
  result: Result[];
}

interface Result {
  message: string;
  course?: string;
}

// there are probably more error messages that need to be converted
const messages: { [key: string]: string } = {
  "course.notenabled": "Cours non activé",
  "person.already.added": "Personne déjà ajoutée",
};

export function Resultat({ result }: Props) {
  if (!Array.isArray(result))
    return (
      <p style={{ color: "red" }}>
        {typeof result} {JSON.stringify(result)}
      </p>
    );
  const res = result.reduce((acc: any, curr: any) => {
    if (typeof curr !== "object") {
      return [curr];
    }
    if (Object.keys(messages).includes(curr.message)) {
      return [...acc, curr.course + ": " + messages[curr.message]];
    } else {
      return [...acc, curr.message];
    }
  }, []);
  return (
    <>
      {res.map((el: any) => (
        <p>{el}</p>
      ))}
    </>
  );
}

export default Resultat;
