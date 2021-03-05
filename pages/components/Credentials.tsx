import styles from "../../styles/Home.module.css";

interface Props {
  onSave: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  sariUsername: string;
  sariPassword: string;
}

export function Credentials({ onSave, sariUsername, sariPassword }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave({
      // @ts-ignore
      username: e.target.elements.namedItem("username").value,
      // @ts-ignore
      password: e.target.elements.namedItem("password").value,
    });
  }
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3>Codes d'accès Sari</h3>
        <form
          onSubmit={handleSubmit}
          id="myForm"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={sariUsername}
          />
          <label htmlFor="password">Mot de passe</label>
          <input type="password" name="password" defaultValue={sariPassword} />
          <input type="submit" value="Envoyer" />
        </form>
      </div>
    </div>
  );
}

export default Credentials;
