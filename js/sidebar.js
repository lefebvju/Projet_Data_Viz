sumFrequentation = function (freq) {
    let somme = 0;

    for (let cle in freq) {
        if (!list_filter.includes(cle)) {
            somme += freq[cle];
        }
    }

    return somme;
}

minFreq = function (freq) {
    let min = 1000000;

    for (let cle in freq) {
        if (!list_filter.includes(cle)) {
            if (freq[cle] < min) {
                min = freq[cle];
            }
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
    let option = sidebar.append("div").style("display", "flex").style("justify-content", "space-evenly").style("margin","20px").style("border-bottom", "1px solid black").style("padding-bottom", "20px").style("padding-top", "10px")

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
    sidebar.append("div").attr("id", "affluence").append("text").text("Affluence de la station").style("font-size","18px").style("text-align", "center").style("text-decoration", "underline");


    var margin = 60
    var width = sidebarContainer.node().getBoundingClientRect().width;
    var height = width-2*margin

    var svg = d3.select("#affluence")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = width / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var frequentation = data.frequentation


    function affichePie() {

        svg.html("");
        if (sumFrequentation(data.frequentation) == 0) {
            svg.append("text").text("Pas de données disponibles")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", "20px")
                .attr("fill", "black")
                .attr("font-weight", "bold")
            return
        }
        var
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


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
                return colorLigne[d.data[0]];
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

    affichePie()
    refresh.push(affichePie)


}
