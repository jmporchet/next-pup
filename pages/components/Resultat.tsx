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
  const res = result.reduce((acc: any, curr: any) => {
    if (typeof curr !== "object") {
      return curr;
    }
    if (Object.keys(messages).includes(curr.message)) {
      return acc.concat(curr.course + messages[curr.message]);
    } else {
      return acc.concat(curr.message);
    }
  }, "");
  return <p>{res}</p>;
}
