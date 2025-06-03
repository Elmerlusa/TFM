import { Card, Col, Row } from "react-bootstrap";
import { ICybercriminalStats } from "../Interfaces";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import SpainChart from "./charts/SpainHeatmap";
import '../assets/css/Card.css';

interface Props {
	lastAttackAt: Date | undefined,
	stats: ICybercriminalStats | undefined
}

const Statistics = ({ lastAttackAt, stats }: Props) => {
	if (!lastAttackAt) return <></>;

	const oneDay = 24 * 60 * 60 * 1000;
	const today = new Date();
	const daysFromLastAttack = lastAttackAt ? Math.round(Math.abs(today.getTime() - lastAttackAt.getTime()) / oneDay) : 0;

	return (
		<>
			<Row>
				<Col>
					<Card className="h-100 bg-info grow-hover">
						<Card.Body className="text-center text-white">
							<Card.Text className="fw-bold fs-1">
								{daysFromLastAttack}
							</Card.Text>
							<Card.Title>Días desde el último ataque</Card.Title>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="h-100 bg-warning grow-hover">
						<Card.Body className="text-center text-white">
							<Card.Text className="fw-bold fs-1">
								{stats?.totalAttacks}
							</Card.Text>
							<Card.Title>Ataques totales</Card.Title>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col xl={6} className="text-center">
					<BarChart data={stats?.attacksByTarget} title="Ciberataques según su objetivo" />
				</Col>
				<Col xl={6} className="text-center">
					<BarChart data={stats?.attacksBySector} title="Ciberataques según el sector" horizontal={true} />
				</Col>
			</Row>
			<Row>
				{
					stats?.attacksByTarget &&
					<Col xl={6}  className="text-center">
						<PieChart data={stats?.attacksByTarget} title="Distribución de ciberataques según su tipo" />
					</Col>
				}
				{
					stats?.attacksByRegion &&
					<Col xl={6}  className="text-center">
						<SpainChart data={stats?.attacksByRegion} title="Ciberataques por provincia" />
					</Col>
				}
			</Row>
		</>
	);
};

export default Statistics;
