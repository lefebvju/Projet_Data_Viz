function mouseover(affichageTooltip) {
    return function f(e, d) {
        d3.select(this).attr("stroke-width", 5)
        var mousePosition = [e.x, e.y];
        // on affiche le toolip
        tooltip.classed('hidden', false)
            // on positionne le tooltip en fonction
            // de la position de la souris
            .attr('style', 'left:' + (mousePosition[0] + 15) +
                'px; top:' + (mousePosition[1] - 35) + 'px')
            // on recupere le nom de l'etat

            .html(affichageTooltip(d));
    }
}

function mouseoverLigne() {
    return mouseover(function (d) {
        console.log(d)
        return "<b>Ligne: "+d.properties.ligne+"</b>";
    })
}

