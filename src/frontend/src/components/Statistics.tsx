import { Col, Row } from "react-bootstrap";
import { ICybercriminalStats } from "../Interfaces";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import SpainChart from "./charts/SpainHeatmap";
import ReactCalendarHeatmap from "react-calendar-heatmap";

interface Props {
	stats: ICybercriminalStats | undefined
}

const Statistics = ({ stats }: Props) => {
	return (
		<>
			<Row>
				
			</Row>
			<Row>
				<Col xl={6} className="text-center">
					<BarChart data={stats?.attacksByTarget} title="Ciberataques según su objetivo" footer="Pie de página" />
				</Col>
				<Col xl={6} className="text-center">
					<BarChart data={stats?.attacksBySector} title="Ciberataques según el sector" horizontal={true} footer="Pie de página" />
				</Col>
			</Row>
			<Row>
				<Col  xs={12} md={6} className="text-center">
					<PieChart data={stats?.attacksByTarget} title="Distribución de ciberataques según su tipo" footer="Pie de página" />
				</Col>
				<Col  xs={12} md={6} className="text-center">
					<SpainChart data={stats?.attacksByRegion} title="Ciberataques por provincia" footer="Pie de página" />
				</Col>
			</Row>
		</>
	);
};

export default Statistics;
