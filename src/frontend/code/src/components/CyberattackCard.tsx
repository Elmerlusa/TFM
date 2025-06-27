import { Badge, Card } from "react-bootstrap";
import { ICyberattackAbstract } from "../Interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router";
import '../assets/css/Card.css';
import { formatDate } from "../utils/utils";

interface ICyberattackAbstractProps {
	cyberattack: ICyberattackAbstract,
}

const CyberattackCard = ({ cyberattack }: ICyberattackAbstractProps) => {
	return (
		<Card bg="dark" border="secondary" className="my-3 text-white grow-hover">
			<Card.Header className="bg-secondary d-flex justify-content-between align-items-center">
				<h2 className="fw-bold">
					{cyberattack.targetName}
				</h2>
				{
					cyberattack.leakSize &&
					<Badge bg="primary">
						{`${cyberattack.leakSize.value} ${cyberattack.leakSize.unit} filtrados`}
					</Badge>
				}
			</Card.Header>
			<Card.Body>
				<p className="m-0">
					<FontAwesomeIcon icon={faUserSecret} className="me-2" />
					{cyberattack.cybercriminalName}
				</p>
				{
					cyberattack.detectedAt &&
					<p className="m-0">
						<FontAwesomeIcon icon={faCalendarDays} className="me-2" />
						{formatDate(cyberattack.detectedAt)}
					</p>
				}
				<NavLink to={`/ciberataques/${cyberattack.id}`} className="stretched-link"></NavLink>
			</Card.Body>
		</Card>
	);
};

export default CyberattackCard;
