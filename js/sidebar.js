
function fermerSidebar() {
    sidebarContainer.classed("hidden", true);
}

function afficherSidebar() {
    sidebarContainer.classed("hidden", false);
}

function remplirSidebar(d) {
    console.log(d)
    sidebar.html("");
    sidebar.append("h1").text(d.nom);
    sidebar.append("h2").text(d.nom_ligne);
    sidebar.append("div").text(d.adresse);
    sidebar.append("div").text( d.commune);
    sidebar.append("div").attr("id","affluence");

    var width = 200
    height = 200
    margin = 40
    var svg = d3.select("#affluence")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var data = d.frequentation

    var
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

    // Generate the pie
    var pie = d3.pie()
        .value(function(d) {
            return d[1] });

    // Utiliser Object.entries() pour obtenir un tableau des paires clé-valeur
    var data_ready = pie(Object.entries(data));


    // Generate the arcs
    var arc = d3.arc()
        .innerRadius(100)
        .padAngle(.1)
        .outerRadius(radius);

    //Generate groups
    var arcs = g.selectAll("arc")
        .data(data_ready)
        .enter();

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);

    arcs
        .append('text')
        .text(function(d){return d.value})
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", "1.5em");
}
