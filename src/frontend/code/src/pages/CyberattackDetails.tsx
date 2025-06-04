import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ICyberattackDetails } from "../Interfaces";
import { Badge, Col, Container, Row } from "react-bootstrap";
import { formatDate } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBug, faCalendarAlt, faCrosshairs, faDatabase, faExclamationTriangle, faFish, faIndustry, faLock, faMapLocationDot, faNewspaper, faUserSecret, faWifi } from "@fortawesome/free-solid-svg-icons";

const CyberattackDetails = () => {
	const [cyberattackDetails, setCyberattackDetails] = useState<ICyberattackDetails>();
	const { id } = useParams();

	useEffect(() => {
		fetch('/api/ciberataques/' + id)
			.then(response => response.json())
			.then(data => {
				const parsedData = {
					...data,
					detectedAt: new Date(data.detectedAt),
					notifiedAt: data.notifiedAt ? new Date(data.notifiedAt) : null,
				};

				setCyberattackDetails(parsedData);
			})
			.catch(e => alert(e));
	}, [id]);

	const getTypeIcon = (type: string) => {
		const icons: Record<string, any> = {
			'Ransomware': faLock,
			'Phising': faFish,
			'DDos': faWifi,
			'SQL Injection': faDatabase,
			'Malware': faBug,
		};
		return icons[type] || faExclamationTriangle;
	};

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
								Atacante: {cyberattackDetails.cybercriminalName}
							</p>
						</Col>
						<Col className="text-end">
							<Badge bg="primary">
								<FontAwesomeIcon icon={getTypeIcon(cyberattackDetails.type)} className="me-2"></FontAwesomeIcon>
								{cyberattackDetails.type}
							</Badge>
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
								Detectado el {formatDate(cyberattackDetails.detectedAt.toISOString())}
							</p>
						</Col>
						<Col>
							<p>
								<FontAwesomeIcon icon={faBell} className="me-2" />
								{cyberattackDetails.notifiedAt ? 
									<span>Notificado el {formatDate(cyberattackDetails.notifiedAt.toISOString())}</span>
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
						{cyberattackDetails.target.regions.join('/')}, {cyberattackDetails.target.country}
					</p>
				</Col>
			</Row>
		</Container >
	);
};

export default CyberattackDetails;
