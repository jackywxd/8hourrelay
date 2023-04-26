// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from "react";
import { app } from "@/firebase/config";
import {
  onAuthStateChanged,
  getAuth,
  EmailAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
const auth = getAuth(app);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  //   signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  //   signInSuccessUrl: "/signedIn",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      clientId:
        "246618467762-m47a6smeh948lr7uaqprcn7pacq513t3.apps.googleusercontent.com",
    },
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function SignInScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
      console.log(user);
      setIsSignedIn(!!user);
    });
    // return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <div>
      <h1>My App</h1>
      <p>Please sign-in:</p>
      {/* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} /> */}
    </div>
  );
}

export default SignInScreen;
