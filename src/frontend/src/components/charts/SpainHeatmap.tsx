import * as d3 from "d3";
import { ICategoryCount } from "../../Interfaces";
import { useEffect, useRef, useState } from "react";
import { FeatureCollection, Geometry } from "geojson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/SpainHeatmap.css"

interface Props {
	data: ICategoryCount | undefined,
	title: string,
	footer?: string,
	width?: number,
	height?: number,
}

const SpainChart = ({ data, title, footer = "", width = 500, height = 400 }: Props) => {
	const [geoJson, setGeoJson] = useState<FeatureCollection<Geometry> | null>(null);
	const ref = useRef<SVGSVGElement | null>(null);
	const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(undefined);
	const svgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>(undefined);


	useEffect(() => {
		fetch("/spain-provinces.geojson")
			.then(response => response.json())
			.then(setGeoJson)
			.catch(e => alert(e));
	}, []);

	useEffect(() => {
		if (!data || !geoJson || !ref.current)
			return;

		const margin = { top: 60, right: 50, bottom: 10, left: 50 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = d3.select(ref.current);
		svgRef.current = svg;
		svg.selectAll("*").remove();

		const zoom = d3.zoom<SVGSVGElement, unknown>()
			.scaleExtent([1, 8])
			.on("zoom", e => g.attr("transform", e.transform));

		zoomRef.current = zoom;
		svg.call(zoom);

		// gWrap to keep transformation when zoom refresh
		const gWrap = svg.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
		const g = gWrap.append("g");

		const projection = d3
			.geoMercator()
			.fitSize([innerWidth, innerHeight], geoJson);

		const path = d3
			.geoPath()
			.projection(projection);

		const values = Object.values(data);
		const color = d3
			.scaleSequential(d3.interpolateBlues)
			.domain([0, d3.max(values) || 1]);

		g
			.selectAll("path")
			.data(geoJson.features)
			.join("path")
			.attr("d", path as any)
			.attr("stroke", "#fff")
			.attr("stroke-width", 0.5)
			.attr("fill", d => {
				const name = d.properties?.name || d.properties?.NAME_1 || "";
				const value = data[name];
				return value !== undefined ? color(value) : "#eee";
			})
			.append("title")
			.text(d => {
				const name = d.properties?.name || d.properties?.NAME_1 || "";
				const value = data[name];
				return `${name}: ${value ?? 0}`;
			});

		// Title
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", 30)
			.attr("text-anchor", "middle")
			.attr("font-size", "16px")
			.attr("font-weight", "bold")
			.text(title);

		// Footer
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height - 20)
			.attr("text-anchor", "middle")
			.attr("font-size", "12px")
			.attr("fill", "#555")
			.text(footer);

		// Legend
		const legendHeight = 300;
		const legendWidth = 12;
		const legendMargin = 10;

		const defs = svg.append("defs");

		const linearGradient = defs.append("linearGradient")
			.attr("id", "legend-gradient")
			.attr("x1", "0%")
			.attr("y1", "100%")
			.attr("x2", "0%")
			.attr("y2", "0%");

		const gradientStops = 10;
		const legendDomain = color.domain();
		for (let i = 0; i <= gradientStops; i++) {
			const t = i / gradientStops;
			linearGradient.append("stop")
				.attr("offset", `${t * 100}%`)
				.attr("stop-color", color(legendDomain[0] + t * (legendDomain[1] - legendDomain[0])));
		}

		const legendG = svg.append("g")
			.attr("transform", `translate(${width - margin.right + legendMargin}, ${margin.top})`);

		legendG.append("rect")
			.attr("width", legendWidth)
			.attr("height", legendHeight)
			.style("fill", "url(#legend-gradient)")
			.attr("stroke", "#ccc");

		const legendScale = d3.scaleLinear()
			.domain(legendDomain)
			.range([legendHeight, 0]);

		const legendAxis = d3.axisRight(legendScale)
			.ticks(6)
			.tickFormat(d3.format("d"));

		legendG.append("g")
			.attr("transform", `translate(${legendWidth}, 0)`)
			.call(legendAxis);
	}, [data, title, footer, width, height, geoJson]);

	const handleZoomIn = () => {
		if (svgRef.current && zoomRef.current) {
			svgRef.current.transition().call(zoomRef.current.scaleBy, 1.5);
		}
	};

	const handleZoomOut = () => {
		if (svgRef.current && zoomRef.current) {
			svgRef.current.transition().call(zoomRef.current.scaleBy, 0.5);
		}
	};

	const handleReset = () => {
		if (svgRef.current && zoomRef.current) {
			svgRef.current.transition().call(zoomRef.current.transform, d3.zoomIdentity);
		}
	};

	return (
		<div className="m-3 shadow rounded" style={{ width: width}}>
			<svg ref={ref} width={width} height={height} className="all-scroll-pointer"></svg>
			<div className="text-center pb-2">
				<button onClick={handleZoomIn} className="bg-white dark-hover rounded-circle mx-2">
					<FontAwesomeIcon icon={faPlus} />
				</button>
				<button onClick={handleZoomOut} className="bg-white dark-hover rounded-circle mx-2">
					<FontAwesomeIcon icon={faMinus} />
				</button>
				<button onClick={handleReset} className="bg-white dark-hover rounded-circle mx-2">
					<FontAwesomeIcon icon={faRotateRight} />
				</button>
			</div>
		</div>
	);
};

export default SpainChart;
