var list_filter = []
var x = d3.scaleLinear()
var y = d3.scaleBand()

function addFilter(onchange=[]){
    var data = Object.entries(infoLigne).map(([cle, valeur]) => ({ cle, ...valeur }));

// Trier la liste en fonction de la clé
    data.sort((a, b) => (a.cle > b.cle) ? 1 : ((b.cle > a.cle) ? -1 : 0));
        var filter=d3.select("#filter-section")
            var div=filter.selectAll()
            .data(data)
            .enter()
                .append("div");

    div.append("div")
            .attr("class", "filter")
            .style("background-color", d =>{
                return d.color
            })
            .text(d=>d.cle)
                .on('click', function(e, d) {
                    if(d3.select(this).classed("clicked")){
                        list_filter = list_filter.filter(function(value, index, arr){
                            return value !== d.cle;
                        });
                        d3.select(this) .style("background-color", d =>{
                            return d.color
                        })
                            .classed("clicked", false);
                        d3.selectAll(".freq" + d.cle).style("display", "block")
                        d3.selectAll("#freq" + d.cle)
                            .transition()
                            .duration(1000)
                            .attr("width", function (d) {
                                return x(d.frequentation);
                            })

                        d3.select("#" + d.cle).style("display", "block")
                        d3.selectAll("."+  d.cle).style("display", "block")
                    }else {

                        d3.selectAll(".freq" + d.cle).style("display", "none")
                        d3.selectAll("#freq" + d.cle)
                            .transition()
                            .duration(1000)
                            .attr("width", 0)

                        list_filter.push(d.cle)
                        d3.select(this).style("background-color", "#575757FF")
                            .classed("clicked", true);
                        d3.select("#" + d.cle).style("display", "none")
                        d3.selectAll("."+d.cle).style("display", t=>{
                            //list_filter.includes(t.properties.nom_ligne)
                            if(t.properties.nom_ligne.every(element => list_filter.includes(element))){
                                return "none"
                            }else{
                                return "block"
                            }

                        })

                    }
                    for (let i = 0; i < onchange.length; i++) {
                        onchange[i]()
                    }

                })


}

function addfreq(){
    var data = Object.entries(infoLigne).map(([cle, valeur]) => ({ cle, ...valeur }));

// Trier la liste en fonction de la clé
    data.sort((a, b) => (a.cle > b.cle) ? 1 : ((b.cle > a.cle) ? -1 : 0));

    var margin = {top: 0, right: 47, bottom: 0, left: 0},
        width = 300 - margin.left - margin.right,
        height = 660 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#freqLigne")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        // Add X axis
        x
            .domain([0, Math.max(...data.map(item => item.frequentation))])
            .range([0, width]);


        // Y axis
        y
            .range([0, height])
            .domain(data.map(item => item.cle).reverse())
            .paddingInner(.6)
            .paddingOuter(.4)



        //Bars
        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect").attr("transform", "rotate(180,"+ width/2+","+height/2+")")
            .attr("id", d=>"freq"+d.cle)
            .attr("x", 0)//(d) =>{ return width-x(d.frequentation)} )
            .attr("y", function (d) {
                return y(d.cle);
            })
            .attr("rx", 5)
            .attr("ry", 5)
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return x(d.frequentation);
            })
            .attr("height", "20px")
            .attr("fill", (d) => d.color)


// Text
    svg.selectAll("myText")
        .data(data)
        .enter()
        .append("text")
        .attr("class", d=>"freq"+d.cle)
        .attr("y", function (d) {
            y.domain(data.map(item => item.cle))
            return y(d.cle) + y.bandwidth() / 2;
        })
        .transition()
        .duration(1000)
        .text(function(d) { return d.frequentation; })
        .attr("x", (d) => {
            // Adjust the threshold value as needed
            if (x(d.frequentation) > d.frequentation.toString().length*10) {
                return width - x(d.frequentation) + 5; // Inside the bar
            } else {
                return width - x(d.frequentation) - Math.max((d.frequentation.toString().length-3),0)*10-20; // Outside the bar
            }
        })
        .attr("dy", "0.35em") // Vertical alignment
        .attr("fill", "black")
        .attr("font-size", "12px")

}