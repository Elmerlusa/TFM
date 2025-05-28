import { useEffect, useState } from "react";
import { IGlobalStats } from "../Interfaces";
import MyCalendarHeatmap from "../components/charts/MyCalendarHeatmap";

const GlobalStats = () => {
	const [stats, setStats] = useState<IGlobalStats>();

	useEffect(() => {
		fetch('/estadisticas')
			.then(response => response.json())
			.then(setStats)
			.catch(e => alert(e));
	}, []);

	if (!stats?.attacksByDate)
		return <></>;

	const today = new Date();
	const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
	startDate.setMonth(today.getMonth() - 3);
	const parsedData = Object.entries(stats?.attacksByDate).map(e => {
		return {date: e[0], count: e[1]}
	});

	return (
		<>
			<MyCalendarHeatmap data={stats?.attacksByDate} />
		</>
	);
};

export default GlobalStats;
