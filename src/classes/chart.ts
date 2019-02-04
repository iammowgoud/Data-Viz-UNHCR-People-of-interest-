
import * as d3 from "d3";
import { Data } from "./data";

const CONFIG = {
    maxCircleDiamater: 50,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    width: 600,
    height: 70 // should be diameter + margins
};

export class Chart {

    id = null;

    data: Data;
    activeData = [];

    width = 0;
    height = 0;

    selectedMetric;
    selectedYear;


    temperatures: Array<any> = [];


    diamaterScale;
    colorScale;

    constructor(id, data: Data, selectedYear: number, selectedMetric: string) {
        this.id = id;
        this.data = data;
        this.selectedMetric = selectedMetric;
        this.selectedYear = selectedYear;
        this.init(true);
    }

    get dataValues() {
        return this.activeData.map((i) => i[this.selectedMetric]);
    }

    get sortedData() {
        return this.activeData.sort((a, b) => {
            if (a["origin"] > b["origin"])
                return -1;
            if (a["origin"] < b["origin"])
                return 1;
            return 0;
        });
    }

    init(draw = false) {
        // cuurent data
        this.activeData = this.data.getSorted(this.selectedYear, this.selectedMetric);

        // Inner margins
        this.height = CONFIG.height - CONFIG.margin.top - CONFIG.margin.bottom,
            this.width = CONFIG.width - CONFIG.margin.left - CONFIG.margin.right;

        this.colorScale = d3.scaleLinear()
            .domain([d3.min(this.dataValues), d3.max(this.dataValues)])
            .range([0, 0.1])
            .interpolate((s) => d3.interpolateBlues);

        this.diamaterScale = d3.scaleLinear()
            .domain([0, d3.max(this.dataValues)])
            .range([0, CONFIG.maxCircleDiamater]);

        if (draw) {
            this.draw();
        }
    }

    draw() {

        let xOffset = 25;

        // Main Viz
        d3.select("#viz")
            .style("max-width", `${CONFIG.width}px`)
            .style("margin", "0 auto")

            // Main SVG
            .append("svg")
            .attr("id", this.id)
            .attr("width", this.width + CONFIG.margin.left + CONFIG.margin.right)
            .attr("height", this.height + CONFIG.margin.top + CONFIG.margin.bottom)

            // Circles Group
            .append("g")
            .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.right + ")")

            // Init Circles
            .selectAll("circle")
            .data(this.sortedData)
            .enter().append("circle")
            .classed("dp", true)

            // Circle attrs
            .attr("cx", (d, i) => {
                let temp = xOffset;
                xOffset += 50 + this.diamaterScale(d[this.selectedMetric]) / 2;
                return temp;
            })
            .attr("cy", 25)
            .attr("fill", (d) => this.colorScale(d[this.selectedMetric]))
            .attr("r", 1)



            .transition()
            .attr("r", (d) => {
                return this.diamaterScale(d[this.selectedMetric]) / 2;
            })
            .delay((d, i) => {
                return i * 70;
            })
            .duration(1000)
            .ease(d3.easeBounceOut);

        d3.select("#viz")
            .insert("h1", "#" + this.id)
            .classed("year", true)
            .classed(this.id, true)
            .data([this.selectedYear])
            .text((d) => {
                return d;
            })
            .enter();
        
        this.tooltip();

    }


    tooltip() {
        let tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("padding", "0 10px")
            .style("background", "white")
            .style("opacity", 0);

        let tempColor;
        let selectedMetric = this.selectedMetric;
        d3.select("#" + this.id)
            .selectAll("circle")
            .on("mouseenter", function (d) {
                tooltip.transition().duration(200)
                    .style("opacity", .9);
                tooltip.html(
                    `<div style=\"font-size: 2rem; font-weight: bold\">
                        ${d["origin"]}
                        <br>
                        ${d[selectedMetric]} ${selectedMetric}
                        <br>
                        ${d["year"]}
                    </div>`
                )
                    // .style("left", (d3.event.pageX - 100) + "px")
                    // .style("top", (d3.event.pageY - 100) + "px");
                    .style("right", "0px")
                    .style("bottom", "0px");
                tempColor = this["style"].fill;
                d3.select(this)
                    .style("fill", "yellow");
            })

            .on("mouseleave", function (d) {
                tooltip.html("");
                d3.select(this)
                    .style("fill", tempColor);
            });
    }

    changeYear(year) {
        // console.log(year)
        this.selectedYear = year;
        this.init();

        d3.select("#" + this.id)
            .selectAll("circle")
            .data(this.sortedData)
            .attr("r", (d) => {
                return this.diamaterScale(d[this.selectedMetric]) / 2;
            })
            .enter();


        d3.select("." + this.id)
            .data([this.selectedYear])
            .text((d) => {
                return d;
            })
            .enter();
    }

    changeMetric(metric) {
        console.log(metric);
        this.selectedMetric = metric;
        this.init();
        d3.select("#" + this.id)
            .selectAll("circle")
            .data(this.sortedData)
            .attr("r", (d) => {
                return this.diamaterScale(d[this.selectedMetric]) / 2;
            })
            .enter();
        this.tooltip();
    }
}