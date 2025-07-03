import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Outlet, useParams } from "react-router";
import { ICybercriminalAbstract } from "../Interfaces";
import CybercriminalCard from "../components/CybercriminalCard";

const Cybercriminals = () => {
	const [cybercriminals, setCybercriminals] = useState<ICybercriminalAbstract[]>([]);
	const [searchText, setSearchText] = useState('');
	const [visibleCybercriminals, setVisibleCybercriminals] = useState(5);
	const [isLoading, setIsLoading] = useState(false);
	const { name } = useParams();

	useEffect(() => {
		if (name) return;
		fetch('/api/ciberdelincuentes')
			.then(response => response.json())
			.then(data => {
				const parsedData = [...data].map(d => {
					return {
						...d,
						lastAttackAt: d.lastAttackAt ? new Date(d.lastAttackAt) : null
					};
				});
				setCybercriminals(parsedData);
			})
			.catch(() => alert('ERROR'));
	}, [name]);

	useEffect(() => {
		setVisibleCybercriminals(10)
	}, [searchText]);

	const filteredCybercriminals = cybercriminals.filter(c =>
		c.name.toLowerCase().includes(searchText.toLowerCase())
	);
	const displayedCybercriminals = filteredCybercriminals.slice(0, visibleCybercriminals);

	const loadMoreCybercriminals = useCallback(() => {
		if (isLoading || visibleCybercriminals >= filteredCybercriminals.length) return;

		setIsLoading(true);
		setVisibleCybercriminals(prev => prev + 10);
		setIsLoading(false);
	}, [isLoading, visibleCybercriminals, filteredCybercriminals.length]);

	useEffect(() => {
		if (name) return;
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop >=
				document.documentElement.offsetHeight - 100
			) {
				loadMoreCybercriminals();
			}
		}

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [name, loadMoreCybercriminals]);

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
			<Row className="justify-content-end">
				<Col xs={"auto"}>
					<input type="text" className="form-control" placeholder="Search text..."
						value={searchText} onChange={e => setSearchText(e.target.value)} />
				</Col>
			</Row>
			{displayedCybercriminals.map(c => <CybercriminalCard key={c.name} cybercriminal={c} />)}
		</Container>
	);
};

export default Cybercriminals;
