main();

async function main() {
    // processing America map
    map_data = await d3.json("us-states.json");
    const svg = d3
        .select("#map_chart")
        .append("svg")
        .attr("width", 1400)
        .attr("height", 800)
        .attr("transform", `translate(800, -1000)`);

    const map = svg.append("g").attr("transform", "scale(0.8)");

    // processing the team player and location
    var team_data = {};
    await d3.csv("TeamLoc.csv", (d) => {
        team_data[d.team_abbreviation] = {
            name: d.team_abbreviation,
            loc: {
                x: Number(d.lon),
                y: Number(d.lat),
            },
            quantity: 0,
        };
    });
    await d3.csv("NBA1516.csv", (d) => {
        team_data[d.team_abbreviation].quantity++;
    });
    team_data = Object.values(team_data);

    draw_map(map, team_data);
}

var map_circle;
function draw_map(map, team_data) {
    var projection = d3.geoMercator().fitExtent(
        [
            [0, 0],
            [1000, 800],
        ],
        map_data
    );

    var geoGenerator = d3.geoPath().projection(projection);

    map.selectAll("path")
        .data(map_data.features)
        .enter()
        .append("path")
        .attr("stroke", "white")
        .attr("fill", "steelblue")
        .attr("d", geoGenerator);

    map_circle = map
        .selectAll("circle")
        .data(team_data)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([d.loc.x, d.loc.y])[0])
        .attr("cy", (d) => projection([d.loc.x, d.loc.y])[1])
        .attr("r", (d) => d.quantity)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("opacity", 0.8);

    map.selectAll("text")
        .data(team_data)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .text((d) => d.name)
        .attr("x", (d) => projection([d.loc.x, d.loc.y])[0])
        .attr("y", (d) => projection([d.loc.x, d.loc.y])[1]);
}
