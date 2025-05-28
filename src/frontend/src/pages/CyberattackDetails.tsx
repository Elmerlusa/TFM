import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ICyberattackDetails } from "../Interfaces";

const CyberattackDetails = () => {
	const [cyberattackDetails, setCyberattackDetails] = useState<ICyberattackDetails>();
	const { id } = useParams();

	useEffect(() => {
		fetch('/ciberataques/' + id)
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

	return (
		<section>
			El grupo "{cyberattackDetails?.cybercriminalName}" atacó a {cyberattackDetails?.target?.name}
			el día {cyberattackDetails?.detectedAt.toDateString()}
		</section>
	);
};

export default CyberattackDetails;
