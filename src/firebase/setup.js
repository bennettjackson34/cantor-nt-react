import config from "./config.json";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// firebase.initializeApp(config);
const app = initializeApp(config);
const auth = getAuth();

async function signInUser(login = "", pass = "") {
	const userCredential = await signInWithEmailAndPassword(auth, login, pass);
}

function signOutUser() {
	signOut(auth);
	window.electron.sendMessage("user-signout", true);
}

async function signUpUser(login = "", pass = "") {
	// const promise = await firebase.auth().createUserWithEmailAndPassword(login, pass);
}

const database = getDatabase(app);

export { database, auth, signInUser, signUpUser, signOutUser };
