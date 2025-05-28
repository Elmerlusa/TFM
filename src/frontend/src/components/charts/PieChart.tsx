import * as d3 from "d3";
import { ICategoryCount } from "../../Interfaces";
import { useEffect, useRef } from "react";

interface Props {
	data: ICategoryCount | undefined,
	title: string,
	footer?: string,
	width?: number,
	height?: number,
}

const PieChart = ({ data, title, footer = "", width = 500, height = 400 }: Props) => {
	const ref = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (!data)
			return;

		const svg = d3.select(ref.current);
		svg.selectAll("*").remove();

		const margin = 80;
		const radius = (Math.min(width, height) - margin) / 2;
		const color = d3.scaleOrdinal<string>()
			.domain(Object.keys(data))
			.range(d3.schemeBlues[Object.values(data).length <= 9 ? Object.values(data).length : 9]);

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
			.attr("transform", `translate(${width / 2}, ${height / 2})`);

		chart.selectAll("path")
			.data(arcs)
			.join("path")
			.attr("d", arcGenerator)
			.attr("fill", (_, i) => color(labels[i]))
			.attr("stroke", "#fff")
			.attr("stroke-width", 1)
			.transition()
			.duration(800)
			.attrTween("d", function (d) {
				const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return function (t) {
					return arcGenerator(i(t))!;
				};
			});

		const labelArc = d3.arc<d3.PieArcDatum<number>>()
			.innerRadius(radius * 0.6)
			.outerRadius(radius * 0.6);

		const total = d3.sum(Object.values(data));

		chart.selectAll("text")
			.data(arcs)
			.join("text")
			.attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
			.attr("text-anchor", "middle")
			.attr("font-size", "12px")
			.text((d, i) => {
				const percent = 100 * d.value / total;

				return `${labels[i]} (${percent.toFixed(2)}%)`;
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
	}, [data, title, footer, width, height]);

	return (
		<>
			<svg ref={ref} width={width} height={height} className="m-3 shadow rounded"></svg>
		</>
	);
};

export default PieChart;
