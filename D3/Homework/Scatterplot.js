main();

const FWith = 800;
const FHeight = 400;
const FLeftTopX = 50;
const FLeftTopY = 80;
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
const WIDTH = FWith - (MARGIN.LEFT + MARGIN.RIGHT);
const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM);

var scatter_circle;

async function main() {
    const player_data = await d3.csv("NBA1516.csv", function (d) {
        return {
            player_name: d.player_name,
            team_abbreviation: d.team_abbreviation,
            age: Number(d.age),
            draft_number: d.draft_number,
            gameplay: Number(d.gp),
            points: Number(d.pts),
            rebounds: Number(d.reb),
            assists: Number(d.ast),
            umapX: Number(d.umapX),
            umapY: Number(d.umapY),
            pointsNorm: Number(d.ptsNorm),
            reboundsNorm: Number(d.rebNorm),
            assistsNorm: Number(d.astNorm),
        };
    });

    var tip = d3
        .tip()
        .attr("class", "d3-tip")
        .html(
            (d) =>
                "Name: " +
                d.player_name +
                "<br>" +
                "pts: " +
                d.points +
                "<br>" +
                "reb: " +
                d.rebounds +
                "<br>" +
                "ast: " +
                d.assists
        );

    const svg = d3
        .select("#scatter_plot")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 500);

    svg.call(tip);

    const g = svg
        .append("g")
        .attr(
            "transform",
            `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`
        );

    var xscale = d3.scaleLinear().domain([0, 10]).range([0, 600]);

    svg.append("g")
        .call(d3.axisBottom(xscale))
        .attr("transform", `translate(${MARGIN.LEFT + 40} , ${FHeight - 40})`)
        .selectAll("text")
        .remove();

    var yscale = d3.scaleLinear().domain([0, 10]).range([400, 0]);

    svg.append("g")
        .call(d3.axisLeft(yscale))
        .attr("transform", `translate(${MARGIN.LEFT + 40} , -40)`)
        .selectAll("text")
        .remove();

    scatter_circle = g
        .selectAll("circle")
        .data(player_data)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.umapX * 35)
        .attr("cy", (d) => FHeight - d.umapY * 50)
        .attr(
            "r",
            (d) => 3 + (d.pointsNorm + d.reboundsNorm + d.assistsNorm) / 3
        )
        .attr("stroke", "black")
        .attr("fill", (d) => {
            max_element = Math.max(d.pointsNorm, d.reboundsNorm, d.assistsNorm);
            if (max_element == d.pointsNorm) return "red";
            else if (max_element == d.reboundsNorm) return "green";
            return "blue";
        });

    var brush = d3
        .brush()
        .extent([
            [-50, -50],
            [WIDTH + 10, HEIGHT + 10],
        ])
        .on("start", brushed_scatter)
        .on("brush", brushed_scatter)
        .on("end", endbrushed_scatter);

    g.insert("g", ":first-child")
        .attr("width", 1000)
        .attr("height", 500)
        .attr("transform", `translate(38, 0)`)
        .call(brush);

    scatter_circle.on("mouseover", tip.show).on("mouseout", tip.hide);

    const legend = svg
        .append("g")
        .attr("transform", `translate(${MARGIN.LEFT + 40}, ${MARGIN.TOP})`);
    legend
        .append("rect")
        .attr("y", -10)
        .attr("x", 10)
        .attr("width", 100)
        .attr("height", 50)
        .attr("fill", "white")
        .attr("stroke", "black");

    legend
        .append("circle")
        .attr("cy", 2)
        .attr("cx", 22)
        .attr("r", 7)
        .attr("fill", "red")
        .attr("stroke", "black");
    legend
        .append("text")
        .text("pts")
        .style("font-size", "16px")
        .attr("y", 6)
        .attr("x", 30);

    legend
        .append("circle")
        .attr("cy", 2)
        .attr("cx", 67)
        .attr("r", 7)
        .attr("fill", "blue")
        .attr("stroke", "black");
    legend
        .append("text")
        .text("reb")
        .style("font-size", "16px")
        .attr("y", 6)
        .attr("x", 75);

    legend
        .append("circle")
        .attr("cy", 22)
        .attr("cx", 22)
        .attr("r", 7)
        .attr("fill", "green")
        .attr("stroke", "black");
    legend
        .append("text")
        .text("ast")
        .style("font-size", "16px")
        .attr("y", 27)
        .attr("x", 30);

    legend
        .append("text")
        .text("r:avg")
        .style("font-size", "16px")
        .attr("y", 27)
        .attr("x", 67);

    console.log("Scatter Done");
}

sel_pts_data = Array(100).fill(0);
sel_reb_data = Array(100).fill(0);
sel_ast_data = Array(100).fill(0);
sel_age_data = Array(100).fill(0);
sel_gp_data = Array(100).fill(0);
sel_draft_number_data = Array(100).fill(0);
sel_team_data = [];

function brushed_scatter() {
    sel_pts_data = Array(100).fill(0);
    sel_reb_data = Array(100).fill(0);
    sel_ast_data = Array(100).fill(0);
    sel_age_data = Array(100).fill(0);
    sel_gp_data = Array(100).fill(0);
    sel_draft_number_data = Array(100).fill(0);
    sel_team_data = {};
    var extent = d3.event.selection;
    scatter_circle.classed("selected", function (d) {
        selected =
            d.umapX * 35 - 35 >= extent[0][0] &&
            d.umapX * 35 - 35 <= extent[1][0] &&
            FHeight - d.umapY * 50 >= extent[0][1] &&
            FHeight - d.umapY * 50 <= extent[1][1];
        if (selected) {
            sel_pts_data[Math.floor(Number(d.points))]++;
            sel_reb_data[Math.floor(Number(d.rebounds))]++;
            sel_ast_data[Math.floor(Number(d.assists))]++;
            sel_age_data[Math.floor(Number(d.age))]++;
            sel_gp_data[Math.floor(Number(d.gameplay))]++;
            sel_draft_number_data[Math.floor(Number(d.draft_number))]++;
            sel_team_data[d.team_abbreviation] =
                (sel_team_data[d.team_abbreviation] || 0) + 1;
        }
        return selected;
    });
}

function endbrushed_scatter() {
    endbrushed_inner_scatter(inner_pts, sel_pts_data, pts_data, true);
    endbrushed_inner_scatter(inner_reb, sel_reb_data, reb_data, true);
    endbrushed_inner_scatter(inner_ast, sel_ast_data, ast_data, true);
    endbrushed_inner_scatter(inner_age, sel_age_data, age_data, true);
    endbrushed_inner_scatter(inner_gp, sel_gp_data, gp_data, true);
    endbrushed_inner_scatter(
        inner_draft_number,
        sel_draft_number_data,
        draft_number_data,
        true
    );
    var t = d3.transition().duration(1000);
    if (Object.values(sel_team_data).length === 0) {
        map_circle.transition(t).attr("r", (d) => d.quantity);
    } else {
        map_circle.transition(t).attr("r", (d) => sel_team_data[d.name]);
    }

    console.log("update bar chart fin");
}

function endbrushed_inner_scatter(inner, sel_data, data, fromscatter) {
    min_key = -1;
    max_key = -1;
    for (var i = 0; i < data.length; i++) {
        if (data[i] != 0) {
            if (min_key == -1) min_key = i;
            max_key = i;
        }
    }

    xDomain = max_key - min_key;
    yDomain = Math.max(...data) - Math.min(...data);
    xRange = WIDTH;
    yRange = HEIGHT;
    xScale = xRange / xDomain;
    yScale = yRange / yDomain;

    var t = d3.transition().duration(1000);
    if (sel_data.some(Boolean) || !fromscatter) {
        inner
            .transition(t)
            .attr("y", (d, i) => HEIGHT - sel_data[i] * yScale + MARGIN.BOTTOM)
            .attr("height", (d, i) => sel_data[i] * yScale);
    } else {
        inner
            .transition(t)
            .attr("y", (d, i) => HEIGHT - data[i] * yScale + MARGIN.BOTTOM)
            .attr("height", (d, i) => data[i] * yScale);
    }
}
