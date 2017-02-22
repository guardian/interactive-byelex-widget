import xr from 'xr'
import config from './../../config.json'
import Mustache from 'mustache'
import charttemplate from './../templates/chart.html'


function cleannumber(input) {
    input = input.replace(/,/g, "");
    return parseFloat(input);
}

function ordercandidates(candidates) {
    //sort
    candidates = candidates.sort(function (a, b) { return cleannumber(b.votes) - cleannumber(a.votes) });
    //find winner (so that bar widths can be calced)
    var winner = candidates[0];
    //calc bar widths
    candidates = candidates.map(function (c) {
        c.changevalue = cleannumber(c.change);
        if (c.changevalue > 0) {
            c.change = "+" + c.change;
        }
        c.fraction = cleannumber(c.votes) / cleannumber(winner.votes);
        c.width = (100 * c.fraction) + "%"
        return c;
    });

    return candidates;
}


xr.get(config.docData).then((resp) => {
    var sheets = resp.data.sheets;
    var candidates = ordercandidates(sheets.generalresults);
    //   var candidates = sheets.generalresults;

    console.log(candidates);

    // render just the html for the blocks
    var charthtml = Mustache.render(charttemplate, candidates);



    // inject that rendered html into the empty div we declared in main.html
    document.querySelector(".gv-elex-heading").innerHTML = sheets.totals[0].heading;
    document.querySelector(".gv-elex-results").innerHTML = charthtml;
    window.resize();
});