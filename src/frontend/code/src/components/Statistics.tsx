import { Card, Col, Row } from "react-bootstrap";
import { Istats } from "../Interfaces";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import SpainChart from "./charts/SpainHeatmap";
import '../assets/css/Card.css';
import MyCalendarHeatmap from "./charts/MyCalendarHeatmap";
import TimeSeriesLineChart from "./charts/TimeSeriesLineChart";

interface Props {
	stats: Istats,
	renderCybercriminalCounts?: boolean,
}

const Statistics = ({ stats, renderCybercriminalCounts = false }: Props) => {
	if (!stats)
		return <></>;
	return (
		<>
			<Row>
				<Col className="my-3">
					<Card className="h-100 bg-warning grow-hover">
						<Card.Body className="text-center text-white">
							<Card.Text className="fw-bold fs-3">
								{stats.attackCount}
							</Card.Text>
							<Card.Title>Número de ataques</Card.Title>
						</Card.Body>
					</Card>
				</Col>
				<Col className="my-3">
					<Card className="h-100 bg-danger grow-hover">
						<Card.Body className="text-center text-white">
							<Card.Text className="fw-bold fs-3">
								{stats.totalDisclosures}
							</Card.Text>
							<Card.Title>Número de publicaciones</Card.Title>
						</Card.Body>
					</Card>
				</Col>
				<Col className="my-3">
					<Card className="h-100 bg-info grow-hover">
						<Card.Body className="text-center text-white">
							<Card.Text className="fw-bold fs-3">
								{`${stats.totalLeakSize.value.toFixed(2)} ${stats.totalLeakSize.unit}`}
							</Card.Text>
							<Card.Title>Tamaño filtrado</Card.Title>
						</Card.Body>
					</Card>
				</Col>
				<Col className="my-3">
					<Card className="h-100 bg-success grow-hover">
						<Card.Body className="text-center text-white">
							<Card.Text className="fw-bold fs-3">
								{stats.totalLeakFiles.toLocaleString(navigator.language)}
							</Card.Text>
							<Card.Title>Archivos filtrados</Card.Title>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			{
				renderCybercriminalCounts ? (
					<>
						<Row>
							<h2 className="text-center mb-0 mt-4">Número de ciberataques en los últimos 3 meses</h2>
							<MyCalendarHeatmap data={stats.detectedAtCounts} title="" />
						</Row>
						<Row>
							<Col className="text-center">
								<BarChart data={stats?.cybercriminalCounts} title="Número de ciberataques según el atacante" />
							</Col>
							<Col className="text-center">
								<SpainChart data={stats?.regionCounts} title="Número de ciberataques por provincia" />
							</Col>
						</Row>
						<Row>
							<Col xl={6} className="text-center">
								<BarChart data={stats?.targetCounts} title="Número de ciberataques según su objetivo" horizontal />
							</Col>
							<Col xl={6} className="text-center">
								<PieChart data={stats?.sectorCounts} title="Frecuencia de ciberataques por sector" />
							</Col>
						</Row>
					</>
				) : (
					<>
						<Row>
							<Col xl={6} className="text-center">
								<TimeSeriesLineChart data={stats?.detectedAtCounts} title="Número de ciberataques en los últimos tres meses" />
							</Col>
							<Col className="text-center">
								<SpainChart data={stats?.regionCounts} title="Número de ciberataques por provincia" />
							</Col>
						</Row>
						<Row>
							<Col xl={6} className="text-center">
								<BarChart data={stats?.targetCounts} title="Número de ciberataques según su objetivo" horizontal />
							</Col>
							<Col xl={6} className="text-center">
								<PieChart data={stats?.sectorCounts} title="Frecuencia de ciberataques por sector" />
							</Col>
						</Row>
					</>
				)
			}
		</>
	);
};

export default Statistics;
