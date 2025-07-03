import { ICyberattackAbstract } from "../Interfaces";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet, useParams } from "react-router";
import CyberattackCard from "../components/CyberattackCard";

const Cyberattacks = () => {
	const [cyberattacks, setCyberattacks] = useState<ICyberattackAbstract[]>([]);
	const [searchText, setSearchText] = useState('');
	const [visibleCyberattacks, setVisibleCyberattacks] = useState(5);
	const [isLoading, setIsLoading] = useState(false);
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

	useEffect(() => {
		setVisibleCyberattacks(10)
	}, [searchText]);

	const filteredCyberattacks = cyberattacks.filter(c =>
		c.targetName.toLowerCase().includes(searchText.toLowerCase()) ||
		c.cybercriminalName.toLowerCase().includes(searchText.toLowerCase())
	);
	const displayedCyberattacks = filteredCyberattacks.slice(0, visibleCyberattacks);

	const loadMoreCyberattacks = useCallback(() => {
		if (isLoading || visibleCyberattacks >= filteredCyberattacks.length) return;

		setIsLoading(true);
		setVisibleCyberattacks(prev => prev + 10);
		setIsLoading(false);
	}, [isLoading, visibleCyberattacks, filteredCyberattacks.length]);

	useEffect(() => {
		if (id) return;
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop >=
				document.documentElement.offsetHeight - 100
			) {
				loadMoreCyberattacks();
			}
		}

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [id, loadMoreCyberattacks]);

	if (id)
		return <Outlet />;
	document.querySelectorAll('.tooltip').forEach(t => t.remove());
	return (
		<Container className="card-animate">
			<Row className="justify-content-end">
				<Col xs={"auto"}>
					<input type="text" className="form-control" placeholder="Search text..."
						value={searchText} onChange={e => setSearchText(e.target.value)} />
				</Col>
			</Row>
			{displayedCyberattacks.map(c => <CyberattackCard cyberattack={c} key={c.id} />)}
		</Container>
	);
};

export default Cyberattacks;
