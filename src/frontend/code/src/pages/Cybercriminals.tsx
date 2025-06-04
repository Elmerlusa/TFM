import { useEffect, useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { Outlet, useParams } from "react-router";
import { ICybercriminalAbstract } from "../Interfaces";
import CybercriminalCard from "../components/CybercriminalCard";

const Cybercriminals = () => {
	const [cybercriminals, setCybercriminals] = useState<ICybercriminalAbstract[]>([]);
	const { name } = useParams();

	useEffect(() => {
		if (name)
			return;
		fetch('/api/ciberdelincuentes')
			.then(response => response.json())
			.then(data => {
				const parsedData = [...data].map(d => {
					return {
						...d,
						lastAttackAt: new Date(d.lastAttackAt)
					};
				});

				setCybercriminals(parsedData);
			})
			.catch(() => alert('ERROR'));
	}, [name]);

	if (name)
		return <Outlet />;
	if (!cybercriminals) {
		return (
			<Container>
				<Row>
					<Spinner animation="grow" className="m-auto" />
				</Row>
			</Container>
		);
	}
	return (
		<Container className="card-animate">
			{cybercriminals.map(c => <CybercriminalCard key={c.name} cybercriminal={c} />)}
		</Container>
	);
};

export default Cybercriminals;
