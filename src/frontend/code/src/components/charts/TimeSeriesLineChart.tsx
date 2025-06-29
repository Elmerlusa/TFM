import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Props {
	data: Record<string, number>,
	title: string,
};

interface DateCount {
	date: Date,
	count: number,
}

const TimeSeriesLineChart = ({
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

	const processData = (rawData: Record<string, number>) => {
		const dateKeys = Object.keys(rawData);
		if (dateKeys.length === 0) return [];

		// Filter data to only include dates within the last year
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 2);

		const filteredData: Record<string, number> = {};
		dateKeys.forEach(dateStr => {
			const date = new Date(dateStr);
			if (date >= oneYearAgo) {
				filteredData[dateStr] = rawData[dateStr];
			}
		});

		const filteredDateKeys = Object.keys(filteredData);
		if (filteredDateKeys.length === 0) return [];

		// Parse dates and sort
		const dates = filteredDateKeys
			.map(dateStr => new Date(dateStr))
			.sort((a, b) => a.getTime() - b.getTime());

		// Get date range
		const startDate = dates[0];
		const endDate = dates[dates.length - 1];

		// Fill in missing dates
		const completeData = [];
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			const dateStr = currentDate.toISOString().split('T')[0];
			const count = filteredData[dateStr] || 0;

			completeData.push({
				date: new Date(currentDate),
				count: count
			});

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return completeData;
	};

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

	const renderTimeSeriesLineChart = useCallback((
		svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
		data: Record<string, number>,
		currentWidth: number,
		currentHeight: number,
		margin: { top: number; right: number; bottom: number; left: number }
	) => {
		const innerWidth = currentWidth - margin.left - margin.right;
		const innerHeight = currentHeight - margin.top - margin.bottom;

		if (!ref.current || Object.keys(data).length === 0) return;

		const processedData = processData(data);
		if (processedData.length === 0) return;

		// Clear previous chart
		d3.select(ref.current).selectAll("*").remove();

		const g = svg.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Set scales
		const xScale = d3.scaleTime()
			.domain(d3.extent(processedData, d => d.date) as [Date, Date])
			.range([0, innerWidth]);

		const yScale = d3.scaleLinear()
			.domain([0, d3.max(processedData, d => d.count) as number])
			.nice()
			.range([innerHeight, 0]);

		// Create line generator
		const line = d3.line<DateCount>()
			.x(d => xScale(d.date))
			.y(d => yScale(d.count))
			.curve(d3.curveMonotoneX);

		// Add axes
		const xAxis = d3.axisBottom(xScale)
			.tickFormat(d3.timeFormat("%b %Y") as any)
			.ticks(d3.timeMonth.every(3));

		const yAxis = d3.axisLeft(yScale)
			.ticks(6)
			.tickFormat(d => Number.isInteger(d as number) ? d.toString() : "");;

		g.append("g")
			.attr("class", "x-axis")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-45)");

		g.append("g")
			.attr("class", "y-axis")
			.call(yAxis);

		// Add grid lines
		g.append("g")
			.attr("class", "grid")
			.call(d3.axisLeft(yScale)
				.tickSize(-innerWidth)
				.tickFormat(() => "")
			)
			.style("stroke-dasharray", "3,3")
			.style("opacity", 0.3);

		// Add the line
		g.append("path")
			.datum(processedData)
			.attr("fill", "none")
			.attr("stroke", "#3b82f6")
			.attr("stroke-width", 2)
			.attr("d", line);

		// Create tooltip
		const tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("opacity", "0")
			.style("background-color", "rgba(0, 0, 0, 0.8)")
			.style("color", "white")
			.style("padding", "10px")
			.style("border-radius", "5px")
			.style("font-size", "12px")
			.style("pointer-events", "none")
			.style("z-index", "1000")
			.style("transition", "opacity 0.2s");

		// Add dots for actual data points
		const actualDataPoints = processedData.filter(d =>
			data.hasOwnProperty(d.date.toISOString().split('T')[0])
		);

		g.selectAll(".dot")
			.data(actualDataPoints)
			.enter().append("circle")
			.attr("class", "dot")
			.attr("cx", d => xScale(d.date))
			.attr("cy", d => yScale(d.count))
			.attr("r", 4)
			.attr("fill", "#3b82f6")
			.attr("stroke", "white")
			.attr("stroke-width", 2)
			.style("cursor", "pointer") // Add cursor pointer
			.on("mouseover", function (event, d) {
				const formattedDate = d3.timeFormat("%d/%m/%Y")(d.date);
				const formattedCount = `${d.count} ${d.count === 1 ? 'ataque' : 'ataques'}`;
				tooltip.transition()
					.duration(200)
					.style("opacity", 1);
				tooltip.html(`<strong>${formattedDate}</strong><br/>${formattedCount}`)
					.style("top", (event.pageY - 40) + "px")
					.style("left", (event.pageX + 10) + "px");
			})
			.on("mousemove", function (event) {
				tooltip
					.style("top", (event.pageY - 40) + "px")
					.style("left", (event.pageX + 10) + "px");
			})
			.on("mouseout", function () {
				tooltip.transition()
					.duration(200)
					.style("opacity", 0);
			});

		// Add axis labels
		g.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x", 0 - (innerHeight / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Count");

		g.append("text")
			.attr("transform", `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
			.style("text-anchor", "middle")
			.text("Date");
	}, []);

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
			left: Math.max(baseMargin.left * (currentWidth / 500), 30),
		};

		const innerWidth = currentWidth - margin.left - margin.right;
		const innerHeight = currentHeight - margin.top - margin.bottom;

		if (innerWidth <= 0 || innerHeight <= 0) return;

		renderTimeSeriesLineChart(svg, data, currentWidth, currentHeight, margin);
		addTitle(svg, title, currentWidth, currentHeight, margin);

	}, [data, title, dimensions, renderTimeSeriesLineChart, addTitle]);


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

export default TimeSeriesLineChart;
