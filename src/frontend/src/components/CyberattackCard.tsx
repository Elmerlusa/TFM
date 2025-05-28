import { Badge, Card } from "react-bootstrap";
import { ICyberattackAbstract } from "../Interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faBullseye, faCalendarDays, faDatabase, faExclamationTriangle, faFish, faLock, faWifi } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router";
import '../assets/css/Card.css';

interface ICyberattackAbstractProps {
	cyberattack: ICyberattackAbstract,
}

const CyberattackCard = ({ cyberattack }: ICyberattackAbstractProps) => {
	const  getTypeIcon = (type: string) => {
		const icons: Record<string, any> = {
			'Ransomware': faLock,
			'Phising': faFish,
			'DDos': faWifi,
			'SQL Injection': faDatabase,
			'Malware': faBug,
		};
		return icons[type] || faExclamationTriangle;
	};

	return (
		<Card bg="dark" border="secondary" className="my-3 text-white grow-hover">
			<Card.Header className="bg-secondary d-flex justify-content-between align-items-center">
				<h2 className="fw-bold">
					{cyberattack.cybercriminalName}
				</h2>
				<Badge bg="primary">
					<FontAwesomeIcon icon={getTypeIcon(cyberattack.type)} className="me-2"></FontAwesomeIcon>
					{cyberattack.type}
				</Badge>
			</Card.Header>
			<Card.Body>
				<p className="m-0">
					<FontAwesomeIcon icon={faCalendarDays} className="me-2" />
					{cyberattack.detectedAt.toLocaleDateString(
						navigator.language,
						{ month: '2-digit', day: '2-digit', year: 'numeric' }
					)}
				</p>
				<p>
					<FontAwesomeIcon icon={faBullseye} className="me-2" />
					{cyberattack.targetName}
				</p>
				<NavLink to={`/ciberataques/${cyberattack.id}`} className="stretched-link"></NavLink>
			</Card.Body>
		</Card>
	);
};

export default CyberattackCard;
