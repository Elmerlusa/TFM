import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ICategoryCount } from "../../Interfaces";


interface Props {
	data: ICategoryCount | undefined,
};

const CalendarHeatmap = ({ data }: Props) => {
	const ref = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (!data)
			return;
		const svg = d3.select(ref.current);
		svg.selectAll("*").remove();

		const now = new Date();
		const startDate = d3.timeMonth.offset(now, -1);
		const endDate = d3.timeMonth.offset(d3.timeMonth.ceil(now), 0);
		const allDates = d3.timeDays(startDate, endDate);

		const margin = { top: 50, right: 50, bottom: 50, left: 50 };
		const cellSize = 30;
		const cellPadding = 8;
		const legendWidth = 10;
		const months = d3.timeMonths(startDate, endDate);
		const calendarHeigth = 5 * (cellSize + cellPadding);
		const calendarWidth = months.length * (7 * (cellSize + cellPadding)) + legendWidth;
		const height = calendarHeigth + margin.top + margin.bottom;
		const width = calendarWidth + margin.left + margin.right;
		const maxVal = d3.max(Object.values(data)) || 1;

		const color = d3
			.scaleLinear<string>()
			.domain([0, maxVal])
			.range(["#deebf7", "#08519c"]);

		const g = svg
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		months.forEach((month, i) => {
			const monthDates = allDates.filter(d => d.getMonth() === month.getMonth());
			const xMonth = i * (7 * (cellSize + cellPadding) + 10);
			const monthGroup = g.append("g").attr("transform", `translate(${xMonth}, 0)`);

			// Mes
			monthGroup
				.append("text")
				.attr("x", (7 * (cellSize + cellPadding)) / 2)
				.attr("y", -15)
				.attr("text-anchor", "middle")
				.attr("font-size", "20px")
				.attr("font-weight", "bold")
				.text(d3.timeFormat("%B %Y")(month).toUpperCase());

			// Días
			const dayGroup = monthGroup
				.selectAll("g.day")
				.data(monthDates)
				.join("g")
				.attr("transform", d => {
					const x = d.getDay() * (cellSize + cellPadding);
					const y = d3.timeWeek.count(month, d) * (cellSize + cellPadding);
					return `translate(${x}, ${y})`;
				});

			dayGroup
				.append("rect")
				.attr("width", cellSize)
				.attr("height", cellSize)
				.attr("fill", d => {
					const value = data[(d3.timeFormat("%Y-%m-%d")(d))];
					return value !== undefined ? color(value) : "#eee";
				});

			dayGroup
				.append("text")
				.attr("x", cellSize / 2)
				.attr("y", cellSize / 2 + 4)
				.attr("text-anchor", "middle")
				.attr("font-size", "10px")
				.attr("fill", "black")
				.text(d => d3.timeFormat("%d")(d));

			dayGroup
				.append("title")
				.text(d => {
					const dateStr = d3.timeFormat("%Y-%m-%d")(d);
					const value = data[dateStr] ?? 0;
					return `${dateStr}: ${value}`;
				});
		});

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
			.attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

		legendG.append("rect")
			.attr("width", legendWidth)
			.attr("height", calendarHeigth)
			.style("fill", "url(#legend-gradient)")
			.attr("stroke", "#ccc");

		const legendScale = d3.scaleLinear()
			.domain(legendDomain)
			.range([calendarHeigth, 0]);

		const legendAxis = d3.axisRight(legendScale)
			.ticks(6)
			.tickFormat(d3.format("d"));

		legendG.append("g")
			.attr("transform", `translate(${legendWidth}, 0)`)
			.call(legendAxis);
	}, [data]);

	return (
		<>
			<svg ref={ref} width="100%" className="my-3 shadow rounded"></svg>
		</>
	);
};

export default CalendarHeatmap;
