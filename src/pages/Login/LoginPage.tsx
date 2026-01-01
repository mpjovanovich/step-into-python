import { EmailAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useEffect } from "react";
import { auth } from "../../firebase";

const LoginPage = () => {
  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
          signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
          disableSignUp: {
            status: true,
          },
        },
      ],
      signInSuccessUrl: "/",
      signInFlow: "redirect",
      tosUrl: undefined,
      privacyPolicyUrl: undefined,
    });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default LoginPage;
