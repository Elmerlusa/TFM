import { useEffect, useState } from "react";
import { IGlobalStats } from "../Interfaces";
import MyCalendarHeatmap from "../components/charts/MyCalendarHeatmap";
import { Col, Container, Row } from "react-bootstrap";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import SpainChart from "../components/charts/SpainHeatmap";

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
		<Container className="bg-dark rounded">
			<Row>
				<MyCalendarHeatmap data={stats?.attacksByDate} />
			</Row>
			<Row className="my-2">
				<Col xl={6} className="text-center">
					<BarChart data={stats?.attacksByTarget} title="Ciberataques según su objetivo" horizontal={true} />
				</Col>
				<Col xl={6} className="text-center">
					<BarChart data={stats?.attacksBySector} title="Ciberataques según el sector" horizontal={true} />
				</Col>
			</Row>
			<Row>
				{
					stats?.attacksByTarget &&
					<Col xl={6} className="text-center">
						<PieChart data={stats?.attacksByTarget} title="Distribución de ciberataques según su tipo" />
					</Col>
				}
				{
					stats?.attacksByGroup &&
					<Col xl={6} className="text-center">
						<PieChart data={stats?.attacksByGroup} title="Distribución de ciberataques según su atacante" />
					</Col>
				}
			</Row>
			<Row className="my-2">
				{
					stats?.attacksByRegion &&
					<Col className="text-center">
						<SpainChart data={stats?.attacksByRegion} title="Ciberataques por provincia" />
					</Col>
				}
			</Row>
		</Container>
	);
};

export default GlobalStats;
