import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICybercriminalDetails } from "../Interfaces";
import { faEnvelope, faT, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

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
			<p><FontAwesomeIcon icon={faT} size="lg" className="me-2"/>Onion:</p>
			{!info.onion ? 
				<p className="text-secondary">Sin datos</p> :
				<p className="text-danger">{info.onion}</p>
			}
			<p><FontAwesomeIcon icon={faTelegram} size="xl" className="me-2"/>Telegram:</p>
			{!info.telegram ? 
				<p className="text-secondary">Sin datos</p> :
				<p className="text-danger">{info.telegram}</p>
			}
			<p><FontAwesomeIcon icon={faEnvelope} size="lg" className="me-2" />Emails:</p>
			{!info.emails ? 
				<p className="text-secondary">Sin datos</p> :
				<ul>
					{info.emails.map((e, i) => <li key={i}>{e}</li>)}
				</ul>
			}
			<p><FontAwesomeIcon icon={faWallet} size="lg" className="me-2" />Wallets:</p>
			{!info.wallets ? 
				<p className="text-secondary">Sin datos</p> :
				<ul>
					{info.wallets.map((w, i) => <li key={i}>{w}</li>)}
				</ul>
			}
		</>
	);
};

export default CybercriminalInfo;
