import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICybercriminalGroupedInfo } from "../Interfaces";
import { faEnvelope, faT, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { Col, Row } from "react-bootstrap";

interface Props {
	info: ICybercriminalGroupedInfo,
}

const CybercriminalInfo = ({ info }: Props) => {
	if (!info) return <></>;

	return (
		<>
			<Row>
				<Col lg={6} className="border-start border-4 border-warning ps-3 mb-3">
					<p><FontAwesomeIcon icon={faT} size="lg" className="text-warning me-2" />Onion:</p>
					{!info.onions || info.onions.length === 0 ?
						<p className="text-secondary">Sin datos</p> :
						<ul>
							{info.onions.map((e, i) => <li key={i}>{e}</li>)}
						</ul>
					}
				</Col>
				<Col lg={6} className="border-start border-4 border-danger ps-3 mb-3">
					<p><FontAwesomeIcon icon={faTelegram} size="xl" className="text-danger me-2" />Telegram:</p>
					{!info.telegrams || info.telegrams.length === 0 ?
						<p className="text-secondary">Sin datos</p> :
						<ul>
							{info.telegrams.map((e, i) => <li key={i}>{e}</li>)}
						</ul>
					}
				</Col>
				<Col lg={6} className="border-start border-4 border-info ps-3 mb-3">
					<p><FontAwesomeIcon icon={faEnvelope} size="lg" className="text-info me-2" />Email:</p>
					{!info.emails || info.emails.length === 0 ?
						<p className="text-secondary">Sin datos</p> :
						<ul>
							{info.emails.map((e, i) => <li key={i}>{e}</li>)}
						</ul>
					}
				</Col>
				<Col lg={6} className="border-start border-4 border-success ps-3 mb-3">
					<p><FontAwesomeIcon icon={faWallet} size="lg" className="text-success me-2" />Wallet:</p>
					{!info.wallets || info.wallets.length === 0 ?
						<p className="text-secondary">Sin datos</p> :
						<ul>
							{info.wallets.map((e, i) => <li key={i}>{e}</li>)}
						</ul>
					}
				</Col>
			</Row>
		</>
	);
};

export default CybercriminalInfo;
