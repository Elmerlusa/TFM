import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ICyberattackDetails } from "../Interfaces";
import { Badge, Col, Container, Row } from "react-bootstrap";
import { formatIsoStringDate } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCalendarAlt, faCrosshairs, faIndustry, faMapLocationDot, faNewspaper, faUserSecret} from "@fortawesome/free-solid-svg-icons";

const CyberattackDetails = () => {
	const [cyberattackDetails, setCyberattackDetails] = useState<ICyberattackDetails>();
	const { id } = useParams();

	useEffect(() => {
		fetch('/api/ciberataques/' + id)
			.then(response => response.json())
			.then(data => {
				const parsedData = {
					...data,
					detectedAt: data.detectedAt ? new Date(data.detectedAt) : null,
					notifiedAt: data.notifiedAt ? new Date(data.notifiedAt) : null,
				};

				setCyberattackDetails(parsedData);
			})
			.catch(e => alert(e));
	}, [id]);

	if (!cyberattackDetails)
		return <></>;
	return (
		<Container className="bg-dark rounded p-4 fs-5">
			<Row className="border-bottom mb-3">
				<Col>
					<h2 className="text-warning mb-4">Datos del ataque</h2>
					<Row>
						<Col>
							<p>
								<FontAwesomeIcon icon={faUserSecret} className="me-2" />
								Atacante: {cyberattackDetails.cybercriminal.name}
							</p>
						</Col>
					</Row>
					<p>
						<FontAwesomeIcon icon={faCrosshairs} className="me-2" />
						Objetivo: {cyberattackDetails.target.name}
					</p>
					<Row>
						<Col>
							<p>
								<FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
								Detectado el {formatIsoStringDate(cyberattackDetails.detectedAt.toISOString())}
							</p>
						</Col>
						<Col>
							<p>
								<FontAwesomeIcon icon={faBell} className="me-2" />
								{cyberattackDetails.notifiedAt ? 
									<span>Notificado el {formatIsoStringDate(cyberattackDetails.notifiedAt.toISOString())}</span>
									: <span>Sin notificar</span>
								}
							</p>
						</Col>
					</Row>
					<p>
						<FontAwesomeIcon icon={faNewspaper} className="me-2" />
						{cyberattackDetails.reputationalImpact}
					</p>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<h2 className="text-info mb-4">{cyberattackDetails.target.name}</h2>
					<p>
						<FontAwesomeIcon icon={faIndustry} className="me-2" />
						Sector: {cyberattackDetails.target.sector}
					</p>
					<p>
						<FontAwesomeIcon icon={faMapLocationDot} className="me-2" />
						{`${cyberattackDetails.target.region}, España`}
					</p>
				</Col>
			</Row>
		</Container >
	);
};

export default CyberattackDetails;
