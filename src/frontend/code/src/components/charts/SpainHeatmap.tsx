import * as d3 from "d3";
import { useEffect, useRef, useState, useCallback } from "react";
import { FeatureCollection, Geometry } from "geojson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/SpainHeatmap.css"

interface Props {
	data: Record<string, number>,
	title: string,
	footer?: string,
	width?: number,
	height?: number,
}

const SpainChart = ({ data, title, footer = "", width, height }: Props) => {
	const [geoJson, setGeoJson] = useState<FeatureCollection<Geometry> | null>(null);
	const [dimensions, setDimensions] = useState({ width: width || 500, height: height || 400 });
	const containerRef = useRef<HTMLDivElement | null>(null);
	const ref = useRef<SVGSVGElement | null>(null);
	const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined> | null>(null);
	const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(undefined);
	const svgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>(undefined);

	const calculateDimensions = useCallback(() => {
		if (!containerRef.current) return;

		const container = containerRef.current.parentElement;
		if (!container) return;

		const containerWidth = container.getBoundingClientRect().width;
		const padding = 24;

		if (width && height) {
			setDimensions({ width, height });
			return;
		}

		const availableWidth = Math.max(320, containerWidth - padding);
		const aspectRatio = 0.8;
		const newWidth = Math.min(availableWidth, 800);
		const newHeight = Math.max(300, newWidth * aspectRatio);

		setDimensions({ width: newWidth, height: newHeight });
	}, [width, height]);

	// Cargar geojson
	useEffect(() => {
		fetch("/spain-provinces.geojson")
			.then(response => response.json())
			.then(setGeoJson)
			.catch(e => alert(e));
	}, []);

	useEffect(() => {
		calculateDimensions();

		window.addEventListener('resize', calculateDimensions);
		return () => window.removeEventListener('resize', calculateDimensions);
	}, [calculateDimensions]);
	const createTooltip = useCallback(() => {
		// Remove existing tooltip if it exists
		if (tooltipRef.current) {
			tooltipRef.current.remove();
		}

		// Create new tooltip
		tooltipRef.current = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("opacity", "0")
			.style("background-color", "rgba(0, 0, 0, 0.9)")
			.style("color", "white")
			.style("padding", "8px 12px")
			.style("border-radius", "6px")
			.style("font-size", "12px")
			.style("font-family", "system-ui, -apple-system, sans-serif")
			.style("pointer-events", "none")
			.style("z-index", "10000")
			.style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.3)")
			.style("transition", "opacity 0.2s ease-in-out")
			.style("white-space", "nowrap");

		return tooltipRef.current;
	}, []);

	useEffect(() => {
		if (!data || !geoJson || !ref.current)
			return;

		const currentWidth = dimensions.width;
		const currentHeight = dimensions.height;

		const baseMargin = { top: 60, right: 50, bottom: 10, left: 50 };
		const scaleFactor = Math.min(currentWidth / 500, 1);
		const margin = {
			top: baseMargin.top * scaleFactor,
			right: baseMargin.right * scaleFactor,
			bottom: baseMargin.bottom * scaleFactor,
			left: baseMargin.left * scaleFactor
		};

		const innerWidth = currentWidth - margin.left - margin.right;
		const innerHeight = currentHeight - margin.top - margin.bottom;

		const svg = d3.select(ref.current);
		svgRef.current = svg;
		svg.selectAll("*").remove();

		const zoom = d3.zoom<SVGSVGElement, unknown>()
			.scaleExtent([1, 8])
			.on("zoom", e => g.attr("transform", e.transform));

		zoomRef.current = zoom;
		svg.call(zoom);

		// gWrap para mantener transformación en reset de zoom
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

		const tooltip = createTooltip();

		g
			.selectAll("path")
			.data(geoJson.features)
			.join("path")
			.attr("d", path as any)
			.attr("stroke", "#fff")
			.attr("stroke-width", 0.5 * scaleFactor)
			.attr("fill", d => {
				const name = d.properties?.name || d.properties?.NAME_1 || "";
				const value = data[name];
				return value !== undefined ? color(value) : "#eee";
			})
			.on("mouseover", function (event, d) {
				const name = d.properties?.name || d.properties?.NAME_1 || "";
				const value = data[name] ?? 0;

				d3.select(this)
					.transition()
					.duration(200)
					.attr("stroke-width", 1.5);

				tooltip.transition()
					.duration(200)
					.style("opacity", 1);

				tooltip.html(`<strong>${name}</strong><br/>${value} ${value === 1 ? "ataque" : "ataques"}`)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 40) + "px");
			})
			.on("mousemove", function (event) {
				tooltip
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 40) + "px");
			})
			.on("mouseout", function () {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("stroke-width", 0.5);

				tooltip.transition()
					.duration(200)
					.style("opacity", 0)
					.on("end", () => tooltip.html(""));
			});

		const titleFontSize = Math.max(12, 16 * scaleFactor);
		svg.append("text")
			.attr("x", currentWidth / 2)
			.attr("y", 30 * scaleFactor)
			.attr("text-anchor", "middle")
			.attr("font-size", `${titleFontSize}px`)
			.attr("font-weight", "bold")
			.attr("fill", "white")
			.text(title);

		const legendHeight = Math.min(300, currentHeight * 0.6);
		const legendWidth = Math.max(8, 12 * scaleFactor);
		const legendMargin = 10 * scaleFactor;

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
			.attr("transform", `translate(${currentWidth - margin.right + legendMargin}, ${margin.top})`);

		legendG.append("rect")
			.attr("width", legendWidth)
			.attr("height", legendHeight)
			.style("fill", "url(#legend-gradient)")
			.attr("stroke", "#ccc");

		const legendScale = d3.scaleLinear()
			.domain(legendDomain)
			.range([legendHeight, 0]);

		const legendTicks = Math.min(6, Math.max(3, Math.floor(legendHeight / 50)));
		const legendAxis = d3.axisRight(legendScale)
			.ticks(legendTicks)
			.tickFormat(d3.format("d"));

		legendG.append("g")
			.attr("transform", `translate(${legendWidth}, 0)`)
			.call(legendAxis)
			.selectAll("text")
			.style("font-size", `${Math.max(8, 10 * scaleFactor)}px`);

	}, [data, title, footer, dimensions, geoJson, createTooltip]);

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

	if (!data || data.size === 0) return <></>;

	return (
		<div
			ref={containerRef}
			className="m-3 mx-auto rounded"
			style={{ width: dimensions.width, maxWidth: '100%' }}
		>
			<svg
				ref={ref}
				width={dimensions.width}
				height={dimensions.height}
				className="all-scroll-pointer"
				style={{ width: '100%', height: 'auto' }}
			/>
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