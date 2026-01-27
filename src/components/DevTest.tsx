import { auth, sendPasswordResetEmail } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { toast } from "react-hot-toast";

const handleSendPasswordResetEmail = async () => {
    try {
        await sendPasswordResetEmail(auth, "dev@dev.com");
        toast.success("Password reset email sent");
    } catch (error) {
        // Don't tell the user if the error is because the user doesn't exist.
        const isUserNotFoundError = error instanceof FirebaseError && error.code === 'auth/user-not-found';
        if (!isUserNotFoundError) {
            toast.error("An error occurred while sending the password reset email");
        }
        // We can't call errorService because we are not authenticated at this
        // point, and firestore rules won't allow us to write to the errors
        // collection. We could handle this with cloud functions, but for now
        // just leave it as a tolerated fail case.
    }
}

const DevTest = () => {
    // This is just a one-off testing component. Guard in here to make sure
    // nothing ever happens in production, but nothing here should go into
    // source control.
    if (!import.meta.env.DEV) {
        return null;
    }

    // return (
    //     // <button onClick={() => sendPasswordResetEmail(auth, "mjovanovich@ivytech.edu")}>Send Password Reset Email</button>
    //     <button onClick={() => handleSendPasswordResetEmail()}>Send Password Reset Email</button>
    // )
}

export default DevTest;