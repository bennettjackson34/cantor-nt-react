import React, { useEffect } from "react";
import ParticlesBg from "particles-bg";

import { database, auth, signInUser, signUpUser } from "../firebase/setup";
import { onAuthStateChanged } from "firebase/auth";

async function IsLoggedIn() {
	try {
		await new Promise((resolve, reject) =>
			auth.onAuthStateChanged(
				(user) => {
					console.log("Calculating");
					if (user) {
						// User is signed in.
						resolve(user);
					} else {
						// No user is signed in.
						reject("no user logged in");
					}
				},
				// Prevent console error
				(error) => reject(error)
			)
		);
		return true;
	} catch (error) {
		return false;
	}
}

function Startup() {
	const handleUserStatus = async () => {
		console.log("start");
		const user = await IsLoggedIn();
		console.log("end");

		if (user) {
			// user is signed in already
			window.electron.sendMessage("login-status", true);
		} else {
			// user is not signed in
			window.electron.sendMessage("login-status", false);
		}
	};

	useEffect(() => {
		handleUserStatus();
	});

	return (
		<div className="Grid">
			<p>Startup</p>
			{/* <ParticlesBg type="circle" bg={true} /> */}
		</div>
	);
}

export default Startup;
