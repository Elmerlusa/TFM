import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ICybercriminalDetails } from "../Interfaces";
import { Container } from "react-bootstrap";
import CyberattackCard from "../components/CyberattackCard";
import Statistics from "../components/Statistics";
import CybercriminalInfo from "../components/CybercriminalInfo";

const CybercriminalDetails = () => {
	const [cybercriminalDetails, setCybercriminalDetails] = useState<ICybercriminalDetails>();
	const { name } = useParams();

	useEffect(() => {
		fetch(`/ciberdelincuentes/${name}`)
			.then(response => response.json())
			.then(data => {
				const parsedData = {
					...data,
					lastAttackAt: new Date(data?.lastAttackAt),
					attacks: [...data?.attacks].map(a => {
						return {
							...a,
							detectedAt: new Date(a.detectedAt),
						}
					})
				};

				setCybercriminalDetails(parsedData);
			})
			.catch(e => alert(e));
	}, [name]);

	return (
		<Container>
			<h1 className="my-4 text-center pb-2 border-bottom">{cybercriminalDetails?.name.toUpperCase()}</h1>
			<section className="my-4">
				<h2 className="mb-4">Direcciones</h2>
				<CybercriminalInfo info={cybercriminalDetails} />
			</section>
			<section className="my-4">
				<h2 className="mb-4">Estadísticas</h2>
				<Statistics lastAttackAt={cybercriminalDetails?.attacks[0].detectedAt} stats={cybercriminalDetails?.stats} />
			</section>
			<section className="my-4">
				<h2 className="mb-4">Últimos ataques</h2>
				{cybercriminalDetails?.attacks?.map(a => <CyberattackCard key={a.id} cyberattack={a} />)}
			</section>
		</Container>
	);
};

export default CybercriminalDetails;
