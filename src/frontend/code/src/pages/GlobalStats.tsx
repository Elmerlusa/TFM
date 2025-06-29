import { useEffect, useState } from "react";
import { Istats } from "../Interfaces";
import { Container } from "react-bootstrap";
import Statistics from "../components/Statistics";

const GlobalStats = () => {
	const [stats, setStats] = useState<Istats>();

	useEffect(() => {
		fetch('/api/estadisticas')
			.then(response => response.json())
			.then(setStats)
			.catch(e => alert(e));
	}, []);

	if (!stats)
		return <></>;
	
	return (
		<Container className="bg-dark rounded p-5">
			<Statistics stats={stats} renderCybercriminalCounts / >
		</Container>
	);
};

export default GlobalStats;
