main();

var brush_X1 = d3
    .brushX()
    .extent([
        [0, 0],
        [WIDTH + 25, HEIGHT],
    ])
    .on("start", brush_barchart1)
    .on("brush", brush_barchart1)
    .on("end", brushed_barchart);

var brush_X2 = d3
    .brushX()
    .extent([
        [0, 0],
        [WIDTH + 50, HEIGHT],
    ])
    .on("start", brush_barchart2)
    .on("brush", brush_barchart2)
    .on("end", brushed_barchart);

var brush_X3 = d3
    .brushX()
    .extent([
        [0, 0],
        [WIDTH + 65, HEIGHT],
    ])
    .on("start", brush_barchart3)
    .on("brush", brush_barchart3)
    .on("end", brushed_barchart);

var brush_X4 = d3
    .brushX()
    .extent([
        [0, 0],
        [WIDTH + 35, HEIGHT],
    ])
    .on("start", brush_barchart4)
    .on("brush", brush_barchart4)
    .on("end", brushed_barchart);

var brush_X5 = d3
    .brushX()
    .extent([
        [0, 0],
        [WIDTH + 10, HEIGHT],
    ])
    .on("start", brush_barchart5)
    .on("brush", brush_barchart5)
    .on("end", brushed_barchart);

var brush_X6 = d3
    .brushX()
    .extent([
        [0, 0],
        [WIDTH + 15, HEIGHT],
    ])
    .on("start", brush_barchart6)
    .on("brush", brush_barchart6)
    .on("end", brushed_barchart);

var range1 = [0, 0],
    range2 = [0, 0],
    range3 = [0, 0],
    range4 = [0, 0],
    range5 = [0, 0],
    range6 = [0, 0];

function brush_barchart1() {
    var extent = d3.event.selection;
    var scale = 30 / 700;
    range1[0] = extent[0] * scale;
    range1[1] = extent[1] * scale;
}

function brush_barchart2() {
    var extent = d3.event.selection;
    var scale = 14 / 700;
    range2[0] = extent[0] * scale;
    range2[1] = extent[1] * scale;
}

function brush_barchart3() {
    var extent = d3.event.selection;
    var scale = 11 / 700;
    range3[0] = extent[0] * scale;
    range3[1] = extent[1] * scale;
}

function brush_barchart4() {
    var extent = d3.event.selection;
    var scale = 22 / 700;
    range4[0] = extent[0] * scale + 18;
    range4[1] = extent[1] * scale + 18;
}

function brush_barchart5() {
    var extent = d3.event.selection;
    var scale = 82 / 700;
    range3[0] = extent[0] * scale;
    range3[1] = extent[1] * scale;
}

function brush_barchart6() {
    var extent = d3.event.selection;
    var scale = 60 / 700;
    range3[0] = extent[0] * scale;
    range3[1] = extent[1] * scale;
}

function inrange_test(d) {
    var inrange = true;
    if (
        range1[0] != range1[1] &&
        (d.points < range1[0] || range1[1] < d.points)
    )
        inrange = false;
    if (
        range2[0] != range2[1] &&
        (d.rebounds < range2[0] || range2[1] < d.rebounds)
    )
        inrange = false;
    if (
        range3[0] != range3[1] &&
        (d.assists < range3[0] || range3[1] < d.assists)
    )
        inrange = false;
    if (range4[0] != range4[1] && (d.age < range4[0] || range4[1] < d.age))
        inrange = false;
    if (
        range5[0] != range5[1] &&
        (d.gameplay < range5[0] || range5[1] < d.gameplay)
    )
        inrange = false;
    if (
        range6[0] != range6[1] &&
        (Number(d.draft_number) < range6[0] ||
            range6[1] < Number(d.draft_number))
    )
        inrange = false;
    return inrange;
}

function brushed_barchart() {
    scatter_circle
        .attr("fill", (d) => {
            var inrange = inrange_test(d);
            var max_element = Math.max(
                d.pointsNorm,
                d.reboundsNorm,
                d.assistsNorm
            );
            if (max_element == d.pointsNorm) return inrange ? "red" : "pink";
            else if (max_element == d.reboundsNorm)
                return inrange ? "green" : "lightgreen";
            return inrange ? "blue" : "lightblue";
        })
        .attr("stroke", (d) => {
            var inrange = inrange_test(d);
            return inrange ? "black" : "";
        });

    sel_pts_data = Array(100).fill(0);
    sel_reb_data = Array(100).fill(0);
    sel_ast_data = Array(100).fill(0);
    sel_age_data = Array(100).fill(0);
    sel_gp_data = Array(100).fill(0);
    sel_draft_number_data = Array(100).fill(0);
    sel_team_data = {};

    scatter_circle.classed("selected", (d) => {
        if (inrange_test(d)) {
            sel_pts_data[Math.floor(Number(d.points))]++;
            sel_reb_data[Math.floor(Number(d.rebounds))]++;
            sel_ast_data[Math.floor(Number(d.assists))]++;
            sel_age_data[Math.floor(Number(d.age))]++;
            sel_gp_data[Math.floor(Number(d.gameplay))]++;
            sel_draft_number_data[Math.floor(Number(d.draft_number))]++;
            sel_team_data[d.team_abbreviation] =
                (sel_team_data[d.team_abbreviation] || 0) + 1;
        }
    });
    endbrushed_inner_scatter(inner_pts, sel_pts_data, pts_data, false);
    endbrushed_inner_scatter(inner_reb, sel_reb_data, reb_data, false);
    endbrushed_inner_scatter(inner_ast, sel_ast_data, ast_data, false);
    endbrushed_inner_scatter(inner_age, sel_age_data, age_data, false);
    endbrushed_inner_scatter(inner_gp, sel_gp_data, gp_data, false);
    endbrushed_inner_scatter(
        inner_draft_number,
        sel_draft_number_data,
        draft_number_data,
        false
    );
    var t = d3.transition().duration(1000);
    if (Object.values(sel_team_data).length === 0) {
        map_circle.transition(t).attr("r", (d) => d.quantity);
    } else {
        map_circle.transition(t).attr("r", (d) => sel_team_data[d.name]);
    }
}

function bar_chart(g, data, name) {
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

    var xscale = d3.scaleLinear().domain([min_key, max_key]).range([0, WIDTH]);

    g.append("g")
        .call(d3.axisBottom(xscale))
        .attr(
            "transform",
            `translate(${MARGIN.LEFT}, ${HEIGHT + MARGIN.BOTTOM} )`
        );

    var yscale = d3
        .scaleLinear()
        .domain([Math.min(...data), Math.max(...data)])
        .range([HEIGHT, 0]);

    g.append("g")
        .call(d3.axisLeft(yscale))
        .attr("transform", `translate(${MARGIN.LEFT} , ${MARGIN.BOTTOM})`);

    var outer = g
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => MARGIN.LEFT + (i - min_key) * xScale)
        .attr("y", (d) => {
            return HEIGHT - d * yScale + MARGIN.BOTTOM;
        })
        .attr("width", WIDTH / xDomain)
        .attr("height", (d) => d * yScale)
        .attr("fill", "white")
        .attr("stroke", "black");

    sel_g = g.append("g");
    var inner = sel_g
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => MARGIN.LEFT + (i - min_key) * xScale)
        .attr("y", (d) => {
            return HEIGHT - d * yScale + MARGIN.BOTTOM;
        })
        .attr("width", WIDTH / xDomain)
        .attr("height", (d) => d * yScale)
        .attr("fill", "green")
        .attr("stroke", "black");

    switch (name) {
        case "pts":
            g.append("g")
                .attr("width", 1000)
                .attr("height", 500)
                .attr("transform", `translate(100, 130)`)
                .call(brush_X1);
            break;
        case "reb":
            g.append("g")
                .attr("width", 1000)
                .attr("height", 500)
                .attr("transform", `translate(100, 130)`)
                .call(brush_X2);
            break;
        case "ast":
            g.append("g")
                .attr("width", 1000)
                .attr("height", 500)
                .attr("transform", `translate(100, 130)`)
                .call(brush_X3);
            break;
        case "age":
            g.append("g")
                .attr("width", 1000)
                .attr("height", 500)
                .attr("transform", `translate(100, 130)`)
                .call(brush_X4);
            break;
        case "gp":
            g.append("g")
                .attr("width", 1000)
                .attr("height", 500)
                .attr("transform", `translate(100, 130)`)
                .call(brush_X5);
            break;
        case "draft_number":
            g.append("g")
                .attr("width", 1000)
                .attr("height", 500)
                .attr("transform", `translate(100, 130)`)
                .call(brush_X6);
            break;
    }

    g.append("text")
        .text(name)
        .style("font-size", "36px")
        .attr("y", 200)
        .attr("x", 600);

    return inner;
}

pts_data = Array(100).fill(0);
reb_data = Array(100).fill(0);
ast_data = Array(100).fill(0);
age_data = Array(100).fill(0);
gp_data = Array(100).fill(0);
draft_number_data = Array(100).fill(0);
var g_pts, g_reb, g_ast, g_age, g_gp, g_draft_number;
var inner_pts, inner_reb, inner_ast, inner_age, inner_gp, inner_draft_number;

async function main() {
    await d3.csv("NBA1516.csv", function (d) {
        pts_data[Math.floor(Number(d.pts))]++;
        reb_data[Math.floor(Number(d.reb))]++;
        ast_data[Math.floor(Number(d.ast))]++;
        age_data[Math.floor(Number(d.age))]++;
        gp_data[Math.floor(Number(d.gp))]++;
        draft_number_data[Math.floor(Number(d.draft_number))]++;
    });

    const svg = d3
        .select("#bar_chart")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 500);

    g_pts = svg.append("g");
    inner_pts = bar_chart(g_pts, pts_data, "pts");
    g_pts.attr("transform", "scale(0.3) translate(0, 0)");

    g_reb = svg.append("g");
    inner_reb = bar_chart(g_reb, reb_data, "reb");
    g_reb.attr("transform", "scale(0.3) translate(800, 0)");

    g_ast = svg.append("g");
    inner_ast = bar_chart(g_ast, ast_data, "ast");
    g_ast.attr("transform", "scale(0.3) translate(1600, 0)");

    g_age = svg.append("g");
    inner_age = bar_chart(g_age, age_data, "age");
    g_age.attr("transform", "scale(0.3) translate(0, 500)");

    g_gp = svg.append("g");
    inner_gp = bar_chart(g_gp, gp_data, "gp");
    g_gp.attr("transform", "scale(0.3) translate(800, 500)");

    g_draft_number = svg.append("g");
    inner_draft_number = bar_chart(
        g_draft_number,
        draft_number_data,
        "draft_number"
    );
    g_draft_number.attr("transform", "scale(0.3) translate(1600, 500)");

    console.log("Bar Chart Done");
}
