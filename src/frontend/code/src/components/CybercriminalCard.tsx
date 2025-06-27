import { Badge, Card } from "react-bootstrap";
import { NavLink } from "react-router";
import { ICybercriminalAbstract } from "../Interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

interface ICybercriminalAbstractProps {
	cybercriminal: ICybercriminalAbstract,
}

const CybercriminalCard = ({ cybercriminal }: ICybercriminalAbstractProps) => {
	return (
		<Card bg="dark" border="secondary" className="my-3 text-white grow-hover">
			<Card.Header className="bg-secondary d-flex justify-content-between align-items-center">
				<h2 className="fw-bold">
					{cybercriminal.name}
				</h2>
				<Badge bg="primary">
					{cybercriminal.attackCount} ataques
				</Badge>
			</Card.Header>
			<Card.Body>
				{
					cybercriminal.lastAttackAt &&
					<p className="m-0">
						<FontAwesomeIcon icon={faClock} className="me-2"></FontAwesomeIcon>
						Último ataque: {' '}
						{cybercriminal.lastAttackAt.toLocaleDateString(
							navigator.language,
							{ month: '2-digit', day: '2-digit', year: 'numeric' }
						)}
					</p>
				}
				<NavLink to={`/cibercriminales/${cybercriminal.name}`} className="stretched-link"></NavLink>
			</Card.Body>
		</Card>
	);
};

export default CybercriminalCard;
