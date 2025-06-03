import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICybercriminalDetails } from "../Interfaces";
import { faEnvelope, faT, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { Col, Row } from "react-bootstrap";

interface ICybercriminalInfo {
	info: ICybercriminalDetails | undefined
}

const CybercriminalInfo = ({ info }: ICybercriminalInfo) => {
	if (!info) {
		return (
			<>
				Loading
			</>
		);
	}
	return (
		<>
			<Row>
				<Col lg={6} className="border-start border-4 border-warning ps-3 mb-3">
					<p><FontAwesomeIcon icon={faT} size="lg" className="text-warning me-2" />Onion:</p>
					{!info.onion ?
						<p className="text-secondary">Sin datos</p> :
						<p className="w-100 text-wrap">{info.onion}</p>
					}
				</Col>
				<Col lg={6} className="border-start border-4 border-danger ps-3 mb-3">
					<p><FontAwesomeIcon icon={faTelegram} size="xl" className="text-danger me-2" />Telegram:</p>
					{!info.telegram ?
						<p className="text-secondary">Sin datos</p> :
						<p>{info.telegram}</p>
					}
				</Col>
				<Col lg={6} className="border-start border-4 border-info ps-3 mb-3">
					<p><FontAwesomeIcon icon={faEnvelope} size="lg" className="text-info me-2" />Emails:</p>
					{!info.emails ?
						<p className="text-secondary">Sin datos</p> :
						<ul>
							{info.emails.map((e, i) => <li key={i}>{e}</li>)}
						</ul>
					}
				</Col>
				<Col lg={6} className="border-start border-4 border-success ps-3 mb-3">
					<p><FontAwesomeIcon icon={faWallet} size="lg" className="text-success me-2" />Wallets:</p>
					{!info.wallets ?
						<p className="text-secondary">Sin datos</p> :
						<ul>
							{info.wallets.map((w, i) => <li key={i}>{w}</li>)}
						</ul>
					}
				</Col>
			</Row>
		</>
	);
};

export default CybercriminalInfo;
