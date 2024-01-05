function addFilter(data){
        var filter=d3.select("#filter-section")
            filter.selectAll()
            .data(data.features.filter(function(d, i, self) {
                // Utilisez une fonction de filtrage pour éviter les doublons
                return i === self.findIndex((t) =>(t.properties.ligne === d.properties.ligne));
            }))
            .enter()
            .append("div")
            .attr("class", d=>"filter")
            .style("background-color", d =>{
                col = d.properties.couleur
                col = col.split(" ")
                return "rgb("+col[0]+","+col[1]+","+col[2]+")"
            })
            .text(d=>d.properties.ligne)
                .on('click', function(e, d) {
                    if(d3.select(this).classed("clicked")){
                        d3.select(this) .style("background-color", d =>{
                            col = d.properties.couleur
                            col = col.split(" ")
                            return "rgb("+col[0]+","+col[1]+","+col[2]+")"
                        })
                            .classed("clicked", false);
                        d3.select("#" + d.properties.ligne).style("display", "block")
                    }else {
                        d3.select(this).style("background-color", "#575757FF")
                            .classed("clicked", true);
                        d3.select("#" + d.properties.ligne).style("display", "none")
                    }
                })
}