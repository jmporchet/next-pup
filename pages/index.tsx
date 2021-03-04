import Head from "next/head";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import styles from "../styles/Home.module.css";
import { useLocalStorageState } from "../utils/useLocalStorage";
import { Credentials } from "./components/Credentials";
import { MainScreen } from "./MainScreen";

export default function Home(props: any) {
  const [hasCredentials, toggleCredentials] = useState(false);
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
                reset credentials
              </button>
              <MainScreen
                sariUsername={sariUsername}
                sariPassword={sariPassword}
              />
            </>
          )}
        </main>
        <ReactQueryDevtools initialIsOpen />
      </div>
    </QueryClientProvider>
  );
}
