import { initializeApp, type FirebaseApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { useRuntimeConfig } from '#imports';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    databaseURL: config.public.firebaseDatabaseUrl,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  };

  const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const database = getDatabase(firebaseApp);
 
  return {
    provide: {
      firebaseApp,
      auth,
      database
    },
  };
});