import * as d3 from "d3";
import { ICategoryCount } from "../../Interfaces";
import { useEffect, useRef } from "react";

interface Props {
	data: ICategoryCount | undefined,
	title: string,
	footer?: string,
	width?: number,
	height?: number,
	horizontal?: boolean
}

const BarChart = ({ data, title, footer = "", width = 500, height = 400, horizontal = false }: Props) => {
	const ref = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (!data)
			return;

		const svg = d3.select(ref.current);
		svg.selectAll("*").remove();

		const margin = { top: 60, right: 50, bottom: 70, left: 50 };
		if (horizontal)
			margin.left = 100;
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const regions = Object.keys(data);
		const values = Object.values(data);

		if (horizontal) {
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

			g.append("g")
				.call(
					d3.axisBottom(x)
						.ticks(x.domain()[1])
						.tickFormat((d) => Number.isInteger(d as number) ? d.toString() : "")
				)
				.attr("transform", `translate(0, ${innerHeight})`)
				.attr("font-size", "12px");

			g.append("g")
				.call(d3.axisLeft(y))
				.attr("class", "y-axis")
				.attr("font-size", "12px");

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
			
			// text-wrap on y-axis
			svg.selectAll(".y-axis text")
				.each(function(d) {
					const text = d3.select(this);
					const fullLabel = text.text();
					const shortLabel = fullLabel.length > 12 ? fullLabel.slice(0, 12).trimEnd() + "..." : fullLabel;
					text.text(shortLabel);
					text.append("title").text(fullLabel);
				});
		} else {
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

			g.append("g")
				.call(
					d3.axisLeft(y)
						.ticks(y.domain()[1])
						.tickFormat(d => Number.isInteger(d as Number) ? d.toString() : "")
				)
				.attr("font-size", "12px");

			g.append("g")
				.call(d3.axisBottom(x))
				.attr("transform", `translate(0, ${innerHeight})`)
				.attr("font-size", "12px");

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
		}

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
	}, [data, title, footer, width, height, horizontal]);

	return (
		<>
			<svg ref={ref} width={"100%"} height={height} className="m-3 shadow rounded text-center"></svg>
		</>
	);
};

export default BarChart;
