import Head from "next/head";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import MinimalFeedback from "minimal-feedback";
import "minimal-feedback/dist/index.css";

import styles from "../styles/Home.module.css";
import { useLocalStorageState } from "../utils/useLocalStorage";
import { Credentials } from "../components/Credentials";
import MainScreen from "../components/MainScreen";

export default function Home() {
  const [hasCredentials, toggleCredentials] = useState(false);
  const [text, settext] = useState({ feedback: "" });

  const saveFeedback = async () => {
    const req = await fetch(
      "https://hook.integromat.com/fpsmu2ifubkw0wxoak5i1bt1t13ychwr",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(text),
        method: "post",
      }
    );
    return await req.json();
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const [sariUsername, setSariUsername] = useLocalStorageState(
    "sariUsername",
    ""
  );

  const [sariPassword, setSariPassword] = useLocalStorageState(
    "sariPassword",
    ""
  );

  useEffect(() => {
    if (sariUsername.length > 0 && sariPassword.length > 0) {
      toggleCredentials(true);
    } else {
      toggleCredentials(false);
    }
  }, [sariUsername, sariPassword]);

  function handleCredentialsSave({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    setSariUsername(username);
    setSariPassword(password);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.container}>
        <Head>
          <title>Gestion Sari</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Gestion Sari</h1>

          {!hasCredentials ? (
            <Credentials
              onSave={handleCredentialsSave}
              sariUsername={sariUsername}
              sariPassword={sariPassword}
            />
          ) : (
            <>
              <button
                onClick={() => {
                  setSariUsername("");
                  setSariPassword("");
                }}
              >
                Se déconnecter de Sari
              </button>
              {/* @ts-ignore */}
              <MainScreen
                sariUsername={sariUsername}
                sariPassword={sariPassword}
              />
            </>
          )}
        </main>
        <MinimalFeedback
          save={saveFeedback}
          value={text}
          onChange={(e: any) => settext(e)}
          ariaHideApp={false}
        />
        <ReactQueryDevtools initialIsOpen />
      </div>
    </QueryClientProvider>
  );
}
