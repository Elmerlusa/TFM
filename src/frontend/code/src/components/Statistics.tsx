import { Card, Col, Row } from "react-bootstrap";
import { Istats } from "../Interfaces";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import SpainChart from "./charts/SpainHeatmap";
import '../assets/css/Card.css';
import MyCalendarHeatmap from "./charts/MyCalendarHeatmap";

interface Props {
	stats: Istats,
	renderCybercriminalCounts?: boolean,
}

const Statistics = ({ stats, renderCybercriminalCounts = false }: Props) => {

	const oneDay = 24 * 60 * 60 * 1000;
	const today = new Date();
	//const daysFromLastAttack = lastAttackAt ? Math.round(Math.abs(today.getTime() - lastAttackAt.getTime()) / oneDay) : 0;

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
							<MyCalendarHeatmap data={stats.detectedAtCounts} title="Ciberataques en los últimos 3 meses" />
						</Row>
						<Row>
							<Col xl={6} className="text-center">
								<BarChart data={stats?.detectedAtCounts} title="Perfil temporal de ciberataques" horizontal />
							</Col>
							<Col className="text-center">
								<SpainChart data={stats?.regionCounts} title="Ciberataques por provincia" />
							</Col>
						</Row>
						<Row>
							<Col xl={6} className="text-center">
								<PieChart data={stats?.sectorCounts} title="Ciberataques según su objetivo" />
							</Col>
							<Col xl={6} className="text-center">
								<BarChart data={stats?.targetCounts} title="Ciberataques según su objetivo" horizontal />
							</Col>
						</Row>
						<Row>
							<Col className="text-center">
								<BarChart data={stats?.cybercriminalCounts} title="Ciberataques según su objetivo" />
							</Col>
						</Row>
					</>
				) : (
					<>
						<Row>
							<Col xl={6} className="text-center">
								<BarChart data={stats?.detectedAtCounts} title="Perfil temporal de ciberataques" horizontal />
							</Col>
							<Col className="text-center">
								<SpainChart data={stats?.regionCounts} title="Ciberataques por provincia" />
							</Col>
						</Row>
						<Row>
							<Col xl={6} className="text-center">
								<PieChart data={stats?.sectorCounts} title="Ciberataques según su objetivo" />
							</Col>
							<Col xl={6} className="text-center">
								<BarChart data={stats?.targetCounts} title="Ciberataques según su objetivo" horizontal />
							</Col>
						</Row>
					</>
				)
			}
		</>
	);
};

export default Statistics;
