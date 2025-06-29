import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import { ICyberattackDetails } from "../Interfaces";
import { Card, Col, Container, ProgressBar, Row } from "react-bootstrap";
import { formatIsoStringDate } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faIndustry, faMapLocationDot, faMoneyBill, faUserGroup } from "@fortawesome/free-solid-svg-icons";

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

	const disclosurePercentage = !cyberattackDetails.disclosures ? null :
		100 * cyberattackDetails.disclosures.completed / cyberattackDetails.disclosures.total;

	return (
		<Container className="bg-dark rounded p-4 fs-5">
			<Row className="border-bottom mb-3">
				<Col>
					<h2 className="text-warning mb-4">Datos del ataque</h2>
					<p>
						Atacante:
						<NavLink to={`/cibercriminales/${cyberattackDetails.cybercriminal.name}`} className="ms-2">{cyberattackDetails.cybercriminal.name}</NavLink>
					</p>
					<p>
						Objetivo: {cyberattackDetails.target.name}
					</p>
					{cyberattackDetails.detectedAt &&
						<p>
							Detectado el {formatIsoStringDate(cyberattackDetails.detectedAt.toISOString())}
						</p>
					}
					{cyberattackDetails.description &&
						<p>
							{cyberattackDetails.description}
						</p>
					}
					{cyberattackDetails.reputationalImpact &&
						<p>
							{cyberattackDetails.reputationalImpact}
						</p>
					}
					{cyberattackDetails.disclosures && disclosurePercentage &&
						<>
							<div className="d-flex justify-content-between fs-6 mb-2">
								<span>
									Progreso: {disclosurePercentage}%
								</span>
								<span>
									{cyberattackDetails.disclosures.completed} publicaciones de {cyberattackDetails.disclosures.total}
								</span>
							</div>
							<ProgressBar now={disclosurePercentage} variant="success" className="mb-3" />
						</>
					}
					{(cyberattackDetails.leakSize || cyberattackDetails.leakFiles || cyberattackDetails.downtimeHours) &&
						<Row>
							{cyberattackDetails.leakSize &&
								<Col className="my-3">
									<Card className="h-100 bg-danger grow-hover">
										<Card.Body className="text-center text-white">
											<Card.Text className="fw-bold fs-3">
												{cyberattackDetails.leakSize.value} {cyberattackDetails.leakSize.unit}
											</Card.Text>
											<Card.Title>Datos filtrados</Card.Title>
										</Card.Body>
									</Card>
								</Col>
							}
							{cyberattackDetails.leakFiles &&
								<Col className="my-3">
									<Card className="h-100 bg-warning grow-hover">
										<Card.Body className="text-center text-white">
											<Card.Text className="fw-bold fs-3">
												{cyberattackDetails.leakFiles.toLocaleString(navigator.language)}
											</Card.Text>
											<Card.Title>Archivos filtrados</Card.Title>
										</Card.Body>
									</Card>
								</Col>
							}
							{cyberattackDetails.downtimeHours &&
								<Col className="my-3">
									<Card className="h-100 bg-info grow-hover">
										<Card.Body className="text-center text-white">
											<Card.Text className="fw-bold fs-3">
												{cyberattackDetails.downtimeHours} horas
											</Card.Text>
											<Card.Title>Servicio no disponible</Card.Title>
										</Card.Body>
									</Card>
								</Col>
							}
						</Row>
					}
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<h2 className="text-info mb-4">{cyberattackDetails.target.name}</h2>
					{cyberattackDetails.target.website &&
						<div className="mb-3">
							<FontAwesomeIcon icon={faGlobe} className="me-2" />
							<a href={cyberattackDetails.target.website}>
								{cyberattackDetails.target.website}
							</a>
						</div>
					}
					{cyberattackDetails.target.size &&
						<p>
							<FontAwesomeIcon icon={faUserGroup} className="me-2" />
							{cyberattackDetails.target.size} trabajadores
						</p>
					}
					{cyberattackDetails.target.size &&
						<p>
							<FontAwesomeIcon icon={faMoneyBill} className="me-2" />
							{cyberattackDetails.target.revenue.value.toFixed(2)} millones de {cyberattackDetails.target.revenue.unit}
						</p>
					}
					{cyberattackDetails.target.sector &&
						<p>
							<FontAwesomeIcon icon={faIndustry} className="me-2" />
							Sector: {cyberattackDetails.target.sector}
						</p>
					}
					{cyberattackDetails.target.region &&
						<p>
							<FontAwesomeIcon icon={faMapLocationDot} className="me-2" />
							{`${cyberattackDetails.target.region}, España`}
						</p>
					}
				</Col>
			</Row>
		</Container >
	);
};

export default CyberattackDetails;
