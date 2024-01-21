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
            .text(d => d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
            .attr('dy', '0.32em')
            .attr('x', d => sizeScale(d) + textOffset);
}