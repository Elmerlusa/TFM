import * as d3 from "d3";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
	data: Record<string, number> | undefined,
	title: string,
	footer?: string,
	horizontal?: boolean
}

const BarChart = ({ 
	data,
	title,
	horizontal = false,
}: Props) => {
	const ref = useRef<SVGSVGElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [dimensions, setDimensions] = useState({ width: 500, height: 400 });

	const updateDimensions = useCallback(() => {
		if (containerRef.current) {
			const containerWidth = containerRef.current.offsetWidth;
			const newWidth = containerWidth;
			const newHeight = newWidth / 1.25; // anchura = altura * 1.25
			
			setDimensions({ width: newWidth, height: newHeight });
		}
	}, []);

	const createHorizontalBarChart = useCallback((
		svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
		data: Record<string, number>,
		currentWidth: number,
		currentHeight: number,
		margin: { top: number; right: number; bottom: number; left: number }
	) => {
		const innerWidth = currentWidth - margin.left - margin.right;
		const innerHeight = currentHeight - margin.top - margin.bottom;

		const regions = Object.keys(data);
		const values = Object.values(data);

		const x = d3
			.scaleLinear()
			.domain([0, d3.max(values) || 0])
			.nice()
			.range([0, innerWidth]);

		const y = d3
			.scaleBand()
			.domain(regions)
			.range([0, innerHeight])
			.padding(0.1);

		const color = d3
			.scaleLinear<string>()
			.domain([0, d3.max(values) || 1])
			.range(["#b3e5fc", "#0288d1"]);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const xAxisTicks = Math.max(3, Math.min(10, Math.floor(innerWidth / 80)));
		g.append("g")
			.call(
				d3.axisBottom(x)
					.ticks(xAxisTicks)
					.tickFormat((d) => Number.isInteger(d as number) ? d.toString() : "")
			)
			.attr("transform", `translate(0, ${innerHeight})`)
			.attr("font-size", `${Math.max(10, 12 * (currentWidth / 500))}px`);

		g.append("g")
			.call(d3.axisLeft(y))
			.attr("class", "y-axis")
			.attr("font-size", `${Math.max(10, 12 * (currentWidth / 500))}px`);

		// Animar barras
		g.selectAll("rect")
			.data(regions)
			.join("rect")
			.attr("y", (d) => y(d)!)
			.attr("height", y.bandwidth())
			.attr("x", 0)
			.attr("width", 0)
			.attr("fill", (d) => color(data[d]))
			.transition()
			.duration(800)
			.delay((_, i) => i * 100)
			.attr("width", (d) => x(data[d]));
		
		// Acortar texto al espacio
		const maxLabelLength = Math.max(8, Math.floor(margin.left / 8));
		svg.selectAll(".y-axis text")
			.each(function(d) {
				const text = d3.select(this);
				const fullLabel = text.text();
				const shortLabel = fullLabel.length > maxLabelLength ? 
					fullLabel.slice(0, maxLabelLength).trimEnd() + "..." : fullLabel;
				text.text(shortLabel);
				text.append("title").text(fullLabel);
			});
	}, []);

	const createVerticalBarChart = useCallback((
		svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
		data: Record<string, number>,
		currentWidth: number,
		currentHeight: number,
		margin: { top: number; right: number; bottom: number; left: number }
	) => {
		const innerWidth = currentWidth - margin.left - margin.right;
		const innerHeight = currentHeight - margin.top - margin.bottom;

		const regions = Object.keys(data);
		const values = Object.values(data);

		const x = d3
			.scaleBand()
			.domain(regions)
			.range([0, innerWidth])
			.padding(0.1);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(values) || 0])
			.nice()
			.range([innerHeight, 0]);

		const color = d3
			.scaleLinear<string>()
			.domain([0, d3.max(values) || 1])
			.range(["#b3e5fc", "#0288d1"]);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Eje Y responsive
		const yAxisTicks = Math.max(3, Math.min(8, Math.floor(innerHeight / 50)));
		g.append("g")
			.call(
				d3.axisLeft(y)
					.ticks(yAxisTicks)
					.tickFormat(d => Number.isInteger(d as Number) ? d.toString() : "")
			)
			.attr("font-size", `${Math.max(10, 12 * (currentWidth / 500))}px`);

		// Rotar etiquetas del eje X si es necesario
		const xAxis = g.append("g")
			.call(d3.axisBottom(x))
			.attr("transform", `translate(0, ${innerHeight})`)
			.attr("font-size", `${Math.max(10, 12 * (currentWidth / 500))}px`);

		if (x.bandwidth() < 60) {
			xAxis.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-45)");
		}

		// Animar barras
		g.selectAll("rect")
			.data(regions)
			.join("rect")
			.attr("x", d => x(d)!)
			.attr("y", innerHeight)
			.attr("width", x.bandwidth())
			.attr("height", 0)
			.attr("fill", d => color(data[d]))
			.transition()
			.duration(800)
			.delay((_, i) => i * 100)
			.attr("y", d => y(data[d]))
			.attr("height", d => innerHeight - y(data[d]));
	}, []);

	const addTitle = useCallback((
		svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
		title: string,
		currentWidth: number,
		currentHeight: number,
		margin: { top: number; right: number; bottom: number; left: number }
	) => {
		const titleFontSize = Math.max(12, 16 * (currentWidth / 500));
		svg.append("text")
			.attr("x", currentWidth / 2)
			.attr("y", margin.top / 2)
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

		// Márgenes
		const baseMargin = { top: 60, right: 50, bottom: 70, left: 50 };
		const margin = {
			top: Math.max(baseMargin.top * (currentWidth / 500), 40),
			right: Math.max(baseMargin.right * (currentWidth / 500), 30),
			bottom: Math.max(baseMargin.bottom * (currentWidth / 500), 50),
			left: horizontal ? Math.max(100 * (currentWidth / 500), 80) : Math.max(baseMargin.left * (currentWidth / 500), 40)
		};

		const innerWidth = currentWidth - margin.left - margin.right;
		const innerHeight = currentHeight - margin.top - margin.bottom;

		if (innerWidth <= 0 || innerHeight <= 0) return;

		if (horizontal) {
			createHorizontalBarChart(svg, data, currentWidth, currentHeight, margin);
		} else {
			createVerticalBarChart(svg, data, currentWidth, currentHeight, margin);
		}

		addTitle(svg, title, currentWidth, currentHeight, margin);

	}, [data, title, horizontal, dimensions, createHorizontalBarChart, createVerticalBarChart, addTitle]);

	// Responsive
	useEffect(() => {
		updateDimensions();

		window.addEventListener('resize', updateDimensions);

		return () => window.removeEventListener('resize', updateDimensions);
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
				className="m-3 text-center"
				style={{ maxWidth: '100%', height: 'auto' }}
			/>
		</div>
	);
};

export default BarChart;