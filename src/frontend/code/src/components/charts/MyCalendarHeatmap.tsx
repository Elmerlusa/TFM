import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

interface Props {
	data: Record<string, number>,
	title: string,
	cellSize?: number,
	monthsToShow?: number,
}

const MyCalendarHeatmap = ({
	data,
	cellSize = 30,
	monthsToShow = 4
}: Props) => {
	const ref = useRef<SVGSVGElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [dimensions, setDimensions] = useState({ width: 800, height: 300 });
	const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);

	const updateDimensions = useCallback(() => {
		if (containerRef.current) {
			const containerWidth = containerRef.current.offsetWidth;
			const newWidth = containerWidth;

			const minCellSize = 10;
			const maxCellSize = 45;
			const calculatedCellSize = Math.max(minCellSize, Math.min(maxCellSize, newWidth / (monthsToShow * 8)));

			const cellPadding = Math.max(2, calculatedCellSize * 0.2);
			const calendarHeight = 5 * (calculatedCellSize + cellPadding);
			const newHeight = (calendarHeight + 150);

			setDimensions({ width: newWidth, height: newHeight });
			setResponsiveCellSize(calculatedCellSize);
		}
	}, [monthsToShow]);

	const createCalendarDates = useCallback(() => {
		const now = new Date();
		const startDate = d3.timeMonth.offset(now, -monthsToShow); // day 1
		const endDate = d3.timeMonth.offset(d3.timeMonth.ceil(now), 0); // day 31
		const allDates = d3.timeDays(startDate, endDate);
		const months = d3.timeMonths(startDate, endDate);

		return { allDates, months, startDate, endDate };
	}, [monthsToShow]);

	const createColorScale = useCallback((data: Record<string, number>) => {
		const maxVal = d3.max(Object.values(data)) || 1;
		return d3
			.scaleLinear<string>()
			.domain([0, maxVal])
			.range(["#deebf7", "#08519c"]);
	}, []);

	const renderCalendarMonths = useCallback((
		g: d3.Selection<SVGGElement, unknown, null, undefined>,
		months: Date[],
		allDates: Date[],
		data: Record<string, number>,
		color: d3.ScaleLinear<string, string, never>,
		cellSize: number,
		cellPadding: number,
		currentWidth: number
	) => {
		const fontSize = Math.max(10, Math.min(20, currentWidth / (monthsToShow * 20)));
		const dayFontSize = Math.max(8, Math.min(12, cellSize / 3));

		const localeEs = d3.timeFormatLocale({
			"dateTime": "%A, %e de %B de %Y, %X",
			"date": "%d/%m/%Y",
			"time": "%H:%M:%S",
			"periods": ["AM", "PM"],
			"days": ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
			"shortDays": ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
			"months": ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
			"shortMonths": ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
		});

		months.forEach((month, i) => {
			const monthDates = allDates.filter(d => d.getMonth() === month.getMonth());
			const xMonth = i * (7 * (cellSize + cellPadding) + 10);
			const monthGroup = g.append("g").attr("transform", `translate(${xMonth}, 0)`);

			monthGroup
				.append("text")
				.attr("x", (7 * (cellSize + cellPadding)) / 2)
				.attr("y", -15)
				.attr("text-anchor", "middle")
				.attr("font-size", `${fontSize}px`)
				.attr("font-weight", "bold")
				.attr("fill", "white")
				.text(localeEs.format("%B %Y")(month).toUpperCase());

			const dayGroup = monthGroup
				.selectAll("g.day")
				.data(monthDates)
				.join("g")
				.attr("class", "day")
				.attr("transform", d => {
					const numDay = d.getDay() || 7; // domingo como último día
					const x = (numDay - 1) * (cellSize + cellPadding);
					let timeCount = d3.timeWeek.count(month, d);
					if (numDay === 7) timeCount -= 1;
					const y = timeCount * (cellSize + cellPadding);
					return `translate(${x}, ${y})`;
				});

			dayGroup
				.append("rect")
				.attr("width", cellSize)
				.attr("height", cellSize)
				.attr("rx", Math.max(1, cellSize / 10))
				.attr("ry", Math.max(1, cellSize / 10))
				.attr("fill", d => {
					const value = data[d3.timeFormat("%Y-%m-%d")(d)];
					return value !== undefined ? color(value) : "#eee";
				})
				.attr("stroke", "#fff")
				.attr("stroke-width", 0.5)
				.style("opacity", 0)
				.transition()
				.duration(500)
				.delay((_, i) => i * 10)
				.style("opacity", 1);

			if (cellSize >= 20) {
				dayGroup
					.append("text")
					.attr("x", cellSize / 2)
					.attr("y", cellSize / 2 + 4)
					.attr("text-anchor", "middle")
					.attr("font-size", `${dayFontSize}px`)
					.attr("fill", "black")
					.attr("font-weight", "bold")
					.text(d => d3.timeFormat("%d")(d))
					.style("opacity", 0)
					.transition()
					.duration(500)
					.delay((_, i) => i * 10 + 200)
					.style("opacity", 1);
			}

			dayGroup
				.append("title")
				.text(d => {
					const dateStr = d3.timeFormat("%Y-%m-%d")(d);
					const value = data[dateStr] ?? 0;
					return `${d3.timeFormat("%d/%m/%Y")(d)}: ${value}`;
				});

			dayGroup
				.style("cursor", "pointer")
				.on("mouseover", function () {
					d3.select(this).select("rect")
						.transition()
						.duration(200)
						.attr("stroke-width", 2)
						.attr("stroke", "#333");
				})
				.on("mouseout", function () {
					d3.select(this).select("rect")
						.transition()
						.duration(200)
						.attr("stroke-width", 0.5)
						.attr("stroke", "#fff");
				});
		});
	}, [monthsToShow]);

	const createLegend = useCallback((
		svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
		color: d3.ScaleLinear<string, string, never>,
		currentWidth: number,
		currentHeight: number,
		calendarHeight: number,
		margin: { top: number; right: number; bottom: number; left: number }
	) => {
		if (currentWidth < 500) return; // No mostrar leyenda en dispositivos pequeños

		const legendWidth = Math.max(8, currentWidth / 80);
		const legendHeight = Math.min(calendarHeight, 150);

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
			.attr("transform", `translate(${currentWidth - margin.right + 10}, ${margin.top})`);

		legendG.append("rect")
			.attr("width", legendWidth)
			.attr("height", legendHeight)
			.style("fill", "url(#legend-gradient)")
			.attr("stroke", "#ccc")
			.attr("rx", 2)
			.attr("ry", 2);

		const legendScale = d3.scaleLinear()
			.domain(legendDomain)
			.range([legendHeight, 0]);

		const legendAxis = d3.axisRight(legendScale)
			.ticks(6)
			.tickFormat(d3.format("d"));

		legendG.append("g")
			.attr("transform", `translate(${legendWidth}, 0)`)
			.call(legendAxis)
			.selectAll("text")
			.attr("fill", "white")
			.attr("font-size", `${Math.max(10, currentWidth / 80)}px`);

		legendG.selectAll(".domain, .tick line")
			.attr("stroke", "white");
	}, []);

	const renderCalendar = useCallback(() => {
		if (!data) return;

		const svg = d3.select(ref.current);
		svg.selectAll("*").remove();

		const { width: currentWidth, height: currentHeight } = dimensions;
		const cellPadding = Math.max(2, responsiveCellSize * 0.2);

		const margin = {
			top: Math.max(60, currentHeight * 0.2),
			right: currentWidth < 500 ? 20 : 80,
			bottom: Math.max(30, currentHeight * 0.1),
			left: Math.max(20, currentWidth * 0.05)
		};

		const calendarHeight = 5 * (responsiveCellSize + cellPadding);
		const { allDates, months } = createCalendarDates();
		const color = createColorScale(data);

		svg.attr("width", currentWidth).attr("height", currentHeight);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		renderCalendarMonths(g, months, allDates, data, color, responsiveCellSize, cellPadding, currentWidth);

		createLegend(svg, color, currentWidth, currentHeight, calendarHeight, margin);

	}, [data, dimensions, responsiveCellSize, createCalendarDates, createColorScale, renderCalendarMonths, createLegend]);

	useEffect(() => {
		updateDimensions();

		window.addEventListener('resize', updateDimensions);

		return () => window.removeEventListener('resize', updateDimensions);;
	}, [updateDimensions]);

	useEffect(() => {
		renderCalendar();
	}, [renderCalendar]);

	return (
		<div ref={containerRef} className="w-full">
			<svg
				ref={ref}
				width="100%"
				className="my-3 mx-auto rounded"
				style={{ maxWidth: '100%', height: 'auto' }}
			/>
		</div>
	);
};

export default MyCalendarHeatmap;