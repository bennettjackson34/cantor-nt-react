import "./Grid.css";
import { database, auth, signOutUser } from "../firebase/setup";

function Grid() {
	const handleSignOut = () => {
		signOutUser();
	};

	return (
		<div className="Grid">
			<header className="Grid-header">
				<p>Cantor NT Grid</p>
				<button onClick={handleSignOut}>SignOut</button>
			</header>
		</div>
	);
}

export default Grid;
