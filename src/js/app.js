import xr from 'xr'
import config from './../../config.json'
import Mustache from 'mustache'
import charttemplate from './../templates/chart.html'


function ordercandidates(candidates) {
    candidates = candidates.sort(function(a,b){return parseFloat(b.votes) - parseFloat(a.votes)});
    var winner = candidates[0];
    candidates = candidates.map(function(c){
        c.fraction = parseFloat(c.votes) / parseFloat(winner.votes);
        c.width = (100 * c.fraction) + "%"
        return c;
    })



    console.log(candidates);
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
    document.querySelector(".heading").innerHTML = sheets.totals[0].heading;
    document.querySelector(".results").innerHTML = charthtml;
});