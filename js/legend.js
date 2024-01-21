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

const sizeLegend = (selection, props) => {
    const {
        sizeScale,
        spacing,
        textOffset,
        numTicks,
        circleFill,
    } = props;

    // console.log(sizeScale.domain());
    // console.log(sizeScale.ticks().filter(d => d !== 0));

    const ticks = sizeScale.ticks(numTicks).reverse();

    const groups = selection.selectAll('g')
        .data(ticks);
    
    const groupsEnter = groups
        .enter()
        .append('g')
            .attr('class', 'tick');

    groupsEnter
        .merge(groups)
            .attr('transform', (d, i) => 
                `translate(0, ${i * spacing})`
            );
    
    groups.exit().remove();

    groupsEnter.append('circle')
        .merge(groups.select('circle'))
            .attr('r', sizeScale)
            .attr('fill', circleFill);
    
    groupsEnter.append('text')
        .merge(groups.select('text'))
            //Le replace permet d'ajouter des espaces tous les 3 chiffres
            .text(d => d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
            .attr('dy', '0.32em')
            .attr('x', d => sizeScale(d) + textOffset)
            .append('tspan')
                .attr('fill-opacity', 0.9)
                .attr('font-style', 'italic')
                .text('  voy/jour');
}

