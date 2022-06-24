import React, { useEffect, useState } from "react";
import ParticlesBg from "particles-bg";

import "../globals/globalStyles.css";
import "../globals/variables.css";
import "./Auth.css";
import bullLogo from "../assets/logos/Bull.png"; // Tell webpack this JS file uses this image
import bearLogo from "../assets/logos/Bear2.png"; // Tell webpack this JS file uses this image

import { database, auth, signInUser, signUpUser } from "../firebase/setup";
import { onAuthStateChanged } from "firebase/auth";
// import { ipcRenderer } from "electron" ;
// const fs = window.require("fs");
// const { ipcRenderer } = require("electron");
// const remote = electron.remote;

function Auth() {
	const [user, setUser] = useState({ displayName: null });
	const [signedIn, setSignedIn] = useState(false);

	useEffect(() => {
		console.log("e");
		onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				// user is signed in
				console.log("signed in");
				setUser(currentUser);
				setSignedIn(true);

				setTimeout(() => {
					window.electron.sendMessage("user-signin", true);
				}, 3000);
			}
		});
	}, []);

	const handleSignIn = () => {
		const signIn = signInUser("Bennett.Jackson@Cantor.com", "Momiosa123");
	};

	return (
		<div>
			<ParticlesBg type="cobweb" bg={true} />
			<div className="main-wrapper">
				<div className="content-wrapper">
					<img className="logo bull" src={bullLogo} alt="Bull" />

					<img className="logo bear" src={bearLogo} alt="Bear" />

					<div className="login-wrapper">
						<span className="invalid-input">Invalid Email or Password</span>

						<div id="welcome-message-wrapper">
							<div id="welcome-message" style={{ visibility: signedIn ? "visible" : "hidden" }} className={[signedIn ? "animate-message" : ""]}>
								Welcome back <br /> {user.displayName}
							</div>
						</div>

						<div id="input-section-wrapper" style={{ opacity: signedIn ? 0 : 1 }}>
							<div className="input-wrapper">
								<input type="text" id="username" autoComplete="off" required defaultValue="Bennett.Jackson@Cantor.com" />
								<label htmlFor="username" className="input-label">
									<span className="label-content">Email</span>
								</label>
							</div>
							<div className="input-wrapper">
								<span toggle="#password" className="fa fa-fw fa-eye field-icon toggle-password"></span>
								<input type="password" id="password" autoComplete="off" required defaultValue="Momiosa123" />
								<label html="password" className="input-label">
									<span className="label-content">Password</span>
								</label>
							</div>
						</div>

						<div id="button-section-wrapper" style={{ opacity: signedIn ? 0 : 1 }}>
							<div className="button-wrapper">
								<button id="login" onClick={handleSignIn}>
									Login
								</button>
							</div>
							<div className="button-wrapper">
								<button id="signup">Sign Up</button>
							</div>
							<span id="password-recovery">Forgot password?</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Auth;
