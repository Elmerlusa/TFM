import { useEffect, useState } from "react";
import { Istats } from "../Interfaces";
import MyCalendarHeatmap from "../components/charts/MyCalendarHeatmap";
import { Col, Container, Row } from "react-bootstrap";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import SpainChart from "../components/charts/SpainHeatmap";
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

	const today = new Date();
	const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
	startDate.setMonth(today.getMonth() - 3);
	const parsedData = Object.entries(stats.detectedAtCounts).map(e => {
		return { date: e[0], count: e[1] }
	});

	return (
		<Container className="bg-dark rounded">
			<Statistics stats={stats} renderCybercriminalCounts / >
		</Container>
	);
};

export default GlobalStats;
