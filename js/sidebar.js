sumFrequentation = function (freq) {
    let somme = 0;

    for (let cle in freq) {
        if (!list_filter.includes(cle)) {
            somme += freq[cle];
        }
    }

    return somme;
}

minFrequentation = function (freq) {
    let min = 1000000

    for (let cle in freq) {
        if (!list_filter.includes(cle) && freq[cle] < min) {
            min = freq[cle];
        }
    }

    return min;
}

function fermerSidebar() {
    sidebarContainer.classed("hidden", true);
}

function afficherSidebar() {
    sidebarContainer.classed("hidden", false);
}

function remplirSidebar(data) {
    sidebar.html("");
    sidebar.append("h1").text(data.nom);
    sidebar.append("h2").text("Ligne : " + data.nom_ligne.sort().join(", "));
    sidebar.append("div").text(data.adresse);
    sidebar.append("div").text(data.commune);
    let option = sidebar.append("div").style("display", "flex").style("justify-content", "space-evenly").style("margin", "20px").style("margin-bottom","5px").style("border-bottom", "1px solid black").style("padding-bottom", "20px").style("padding-top", "10px")

// Icône pour l'escalator
    let ascenseurIcon = option.append("div").html("<i class='fas fa-elevator fa-2x' style='color: #1a5fb4;'></i>");

// Icône pour l'ascenseur
    let escalatorIcon = option.append("div").html("<img src='img/escalator.svg' alt='escalator' width='30' height='30'>");

// Condition pour l'escalator
    if (!data.escalator) {
        // Ajouter une croix rouge à l'icône de l'escalator
        escalatorIcon.append("i").attr("class", "fas fa-ban fa-3x").style("color", "red").style("position", "absolute").style("transform", "translate(-40px, -10px)").style("opacity", "0.7")
    }

// Condition pour l'ascenseur
    if (!data.ascenseur) {
        // Ajouter une croix rouge à l'icône de l'ascenseur
        ascenseurIcon.append("i").attr("class", "fas fa-ban fa-3x").style("color", "red").style("position", "absolute").style("transform", "translate(-40px, -7px)").style("opacity", "0.7")
    }


    var affluence = sidebar.append("div").attr("id", "affluence")
    var btnAffluence = affluence.append("div").attr("id", "boutonAffluence")
    btnAffluence.append("div").html("Station").on("click", function () {
        svgStation.style("display", "block");
        d3.select("#affluenceLigne").style("display", "none");
        d3.select(this).style("color", "black");
        d3.select("#boutonAffluenceLigne").style("color", "grey");
        refresh.push(affichePie);
        affichePie();
    });
    btnAffluence.append("div").style("color", "grey").html("Ligne").attr("id", "boutonAffluenceLigne").on("click", function () {
        svgStation.style("display", "none");
        d3.select("#affluenceLigne").style("display", "block");
        d3.select(this).style("color", "black");
        d3.select("#boutonAffluence div").style("color", "grey");
        refresh = refresh.filter(function (value, index, arr) {
            return value != affichePie;
        });
        afficheBar();
    });
    affluence.append("div").attr("id", "affluenceStation")
    affluence.append("div").attr("id", "affluenceLigne")


    var margin = 60
    var width = sidebarContainer.node().getBoundingClientRect().width;
    var height = width - 2 * margin

    var svgStation = d3.select("#affluenceStation")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = width / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var frequentation = data.frequentation


    function affichePie() {
        var margin = 60
        var width = sidebarContainer.node().getBoundingClientRect().width;
        var height = width - 2 * margin

        svgStation.html("");
        if (sumFrequentation(data.frequentation) == 0) {
            svgStation.append("text").text("Pas de données disponibles")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", "20px")
                .attr("fill", "black")
                .attr("font-weight", "bold")
            return
        }
        var
            g = svgStation.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        // Generate the pie
        var pie = d3.pie()
            .value(function (d) {
                return d[1]
            });
        // Utiliser Object.entries() pour obtenir un tableau des paires clé-valeur
        var data_ready = pie(Object.entries(frequentation).filter(function (d, i, self) {
            return !list_filter.includes(d[0]);
        }));


        // Generate the arcs
        var arc = d3.arc()
            .innerRadius(radius * 0.5)         // This is the size of the donut hole
            .padAngle(.05)
            .outerRadius(radius * 0.8)

        //Generate groups
        var arcs = g.selectAll("arc")
            .data(data_ready)
            .enter()
        ;

        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                return infoLigne[d.data[0]].color;
            })
            .attr("d", arc);

// LEGENDES

        arcs
            .append('text')
            .text(function (d) {
                return d.data[0]
            })
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .style("text-anchor", "middle")
            .attr("dy", "0.35em")

        arcs.append("text")
            .text(sumFrequentation(data.frequentation))
            .style("text-anchor", "middle")
            .attr("dy", "0.35em")


        arcs
            .selectAll('allPolylines')
            .data(data_ready)
            .join('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function (d) {
                const posAWeight = 0.5; // Vous pouvez ajuster ce poids selon votre besoin (0 signifie arc.centroid(d), 1 signifie outerArc.centroid(d))
                const posA = [
                    arc.centroid(d)[0] * (1 - posAWeight) + outerArc.centroid(d)[0] * posAWeight,
                    arc.centroid(d)[1] * (1 - posAWeight) + outerArc.centroid(d)[1] * posAWeight
                ];
                const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                const posC = outerArc.centroid(d); // Label position = almost the same as posB
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })

        arcs
            .selectAll('allLabels')
            .data(data_ready)
            .join('text')
            .text(d => d.data[1])

            .attr('transform', function (d) {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style('text-anchor', function (d) {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })

            .attr("dy", "0.35em")

    }


    var margin = {top: 30, right: 30, bottom: 100, left: 60};
    var width = sidebarContainer.node().getBoundingClientRect().width
    var height = sidebarContainer.node().getBoundingClientRect().height / 2
    width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var affluenceLigne = d3.select("#affluenceLigne")
        .style("display", "none")
    var btnLigne = affluenceLigne.append("div").attr("id", "boutonLigne")
    for (let lign in data.nom_ligne) {

        btnLigne.append("div")
            .html(data.nom_ligne[lign])
            .style("background-color", () => {
                if (lign == 0) {
                    return infoLigne[data.nom_ligne[lign]].color
                } else {
                    return "grey"
                }
            })
            .attr("class", "choixLigne")
            .on("click", function () {
                d3.selectAll(".choixLigne").style("background-color", "grey");
                d3.select(this).style("background-color", infoLigne[data.nom_ligne[lign]].color);
                afficheBar(data.nom_ligne[lign]);
            });
    }
    var svgLigne = affluenceLigne.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    function afficheBar(ligne = data.nom_ligne[0]) {

        var margin = {top: 30, right: 30, bottom: 100, left: 60};
        var width = sidebarContainer.node().getBoundingClientRect().width
        var height = sidebarContainer.node().getBoundingClientRect().height / 2
        width = width - margin.left - margin.right,
            height = height - margin.top - margin.bottom;
        svgLigne.html("");
        var
            g = svgLigne.append("g");
        var stations = infoLigne[ligne].stations;
// X axis
        const x = d3.scaleBand()
            .range([width, 0])
            .domain(stations.map(d => d.nom))
            .padding(0.2);
        svgLigne.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
// Add Y axis
        const y = d3.scaleLinear()
            .domain([0, Math.max(...stations.map(item => item.frequentation[ligne]))])
            .range([height, 0]);
        svgLigne.append("g")
            .call(d3.axisLeft(y));

// Bars
        svgLigne.selectAll("mybar")
            .data(stations)
            .join("rect")
            .attr("x", d => x(d.nom))
            .attr("y", d => y(d.frequentation[ligne]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.frequentation[ligne]))
            .attr("fill", d => {
                if (d.nom === data.nom) {
                    return "grey"
                } else {
                    return infoLigne[ligne].color
                }
            })


    }

    afficheBar()

    affichePie()
    refresh.push(affichePie)


}
