import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Grid from "./Grid/Grid";
import Quad from "./Quad/Quad";
import Auth from "./Auth/Auth";
import Startup from "./Startup/Startup";

function App() {
	const location = useLocation();

	const getView = (location) => {
		const Views = {
			auth: <Auth />,
			grid: <Grid />,
			quad: <Quad />,
			startup: <Startup />,
		};

		let name = location.search.substr(1);
		if (name.includes("=")) {
			name = name.slice(0, name.index("="));
		}

		let view = Views[name];
		if (view == null) throw new Error("View '" + name + "' is undefined");
		return view;
	};

	return <div>{getView(location)}</div>;
}

function ViewManager() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<App />} />
			</Routes>
		</Router>
	);
}
export default ViewManager;
