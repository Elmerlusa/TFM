import * as d3 from "d3";
import { ICategoryCount } from "../../Interfaces";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
	data: ICategoryCount | undefined,
	title: string,
}

const PieChart = ({ 
	data,
	title
}: Props) => {
	const ref = useRef<SVGSVGElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

	// Función para actualizar las dimensiones
	const updateDimensions = useCallback(() => {
		if (containerRef.current) {
			const containerWidth = containerRef.current.offsetWidth;
			const newWidth = containerWidth;
			const newHeight = newWidth / 1.25;
			
			setDimensions({ width: newWidth, height: newHeight });
		}
	}, []);

	// Función para crear los sectores del gráfico de tarta
	const createPieSlices = useCallback((
		svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
		data: ICategoryCount,
		currentWidth: number,
		currentHeight: number,
		radius: number
	) => {
		const color = d3.scaleOrdinal<string>()
			.domain(Object.keys(data))
			.range(d3.schemeSet1);

		const pie = d3.pie<number>()
			.value(d => d)
			.sort(null);

		const arcs = pie(Object.values(data));
		const labels = Object.keys(data);

		const arcGenerator = d3.arc<d3.PieArcDatum<number>>()
			.innerRadius(0)
			.outerRadius(radius - 10);

		const chart = svg
			.append("g")
			.attr("transform", `translate(${currentWidth / 2}, ${currentHeight / 2})`);

		// Animar creación
		chart.selectAll("path")
			.data(arcs)
			.join("path")
			.attr("d", arcGenerator)
			.attr("fill", (_, i) => color(labels[i]))
			.attr("stroke", "#fff")
			.attr("stroke-width", Math.max(1, currentWidth / 500))
			.transition()
			.duration(800)
			.attrTween("d", function (d) {
				const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function (t) {
					return arcGenerator(i(t))!;
				};
			});
	}, []);

	const createLegend = useCallback((
		svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
		data: ICategoryCount,
		currentWidth: number,
		currentHeight: number
	) => {
		const labels = Object.keys(data);
		const values = Object.values(data);
		const total = d3.sum(values);
		
		const color = d3.scaleOrdinal<string>()
			.domain(labels)
			.range(d3.schemeSet1);

		const legend = svg.append("g")
			.attr("class", "legend")
			.attr("transform", `translate(${currentWidth - 150}, 50)`);

		const legendItems = legend.selectAll(".legend-item")
			.data(labels)
			.join("g")
			.attr("class", "legend-item")
			.attr("transform", (_, i) => `translate(0, ${i * 20})`);

		legendItems.append("rect")
			.attr("width", 12)
			.attr("height", 12)
			.attr("fill", d => color(d));

		legendItems.append("text")
			.attr("x", 18)
			.attr("y", 6)
			.attr("dy", "0.35em")
			.attr("font-size", "11px")
			.attr("fill", "white")
			.text((d, i) => {
				const percent = 100 * values[i] / total;
				return `${d} (${percent.toFixed(1)}%)`;
			});
	}, []);

	const addTitle = useCallback((
		svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
		title: string,
		currentWidth: number,
		currentHeight: number
	) => {
		const titleFontSize = Math.max(12, 16 * (currentWidth / 500));
		svg.append("text")
			.attr("x", currentWidth / 2)
			.attr("y", 30)
			.attr("text-anchor", "middle")
			.attr("font-size", `${titleFontSize}px`)
			.attr("font-weight", "bold")
			.attr("fill", "white")
			.text(title);
	}, []);

	// Renderizar gráfico
	const renderChart = useCallback(() => {
		if (!data) return;

		const svg = d3.select(ref.current);
		svg.selectAll("*").remove();

		const { width: currentWidth, height: currentHeight } = dimensions;

		const baseMargin = 80;
		const margin = Math.max(baseMargin * (currentWidth / 500), 60);
		const radius = (Math.min(currentWidth, currentHeight) - margin) / 2;

		if (radius <= 0) return;

		createPieSlices(svg, data, currentWidth, currentHeight, radius);

		createLegend(svg, data, currentWidth, currentHeight);

		addTitle(svg, title, currentWidth, currentHeight);

	}, [data, title, dimensions, createLegend, addTitle]);

	// Responsive
	useEffect(() => {
		updateDimensions();

		window.addEventListener('resize', updateDimensions);

		return () => window.removeEventListener('resize', updateDimensions);;
	}, [updateDimensions]);

	// Renderizar
	useEffect(() => {
		renderChart();
	}, [renderChart]);

	return (
		<div ref={containerRef} className="w-full">
			<svg 
				ref={ref} 
				width={dimensions.width} 
				height={dimensions.height} 
				className="m-3 rounded"
				style={{ maxWidth: '100%', height: 'auto' }}
			/>
		</div>
	);
};

export default PieChart;
