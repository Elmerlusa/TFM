import { ICyberattackAbstract } from "../Interfaces";
import { useEffect, useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { Outlet, useParams } from "react-router";
import CyberattackCard from "../components/CyberattackCard";

const Cyberattacks = () => {
	const [cyberattacks, setCyberattacks] = useState<ICyberattackAbstract[]>([]);
	const { id } = useParams();

	useEffect(() => {
		if (id)
			return;
		fetch('/api/ciberataques')
			.then(response => response.json())
			.then(data => {
				const parsedData = [...data].map(d => {
					return {
						...d,
						detectedAt: d.detectedAt ? new Date(d.detectedAt) : null
					};
				});

				setCyberattacks(parsedData);
			})
			.catch(() => alert('ERROR'));
	}, [id]);

	if (id)
		return <Outlet />;
	return (
		<Container className="card-animate">
			{cyberattacks.map(c => <CyberattackCard cyberattack={c} key={c.id}/>)}
		</Container>
	);
};

export default Cyberattacks;
