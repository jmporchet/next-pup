import React from "react";
import { FallbackProps } from "react-error-boundary";

export function ErrorMessage({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <h3>Une erreur est survenue: {error.message}</h3>
      <p>Le serveur est peut-être introuvable.</p>
      <button onClick={resetErrorBoundary}>Réessayer</button>
    </div>
  );
}
