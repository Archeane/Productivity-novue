/*
    chrome.storage.sync.get('blocked_sites', function(sites){
        console.log(sites['blocked_sites']);
        if(sites['blocked_sites']){
            for(site in sites['blocked_sites']){
                var li = document.createElement("li");
                //li.text(site);
                $('#blockedSites').append("<li>"+site+"</li>");
            }
        }
    });

    $('#addNewSite').on('click', function(){
        // add new site to blocked sites
        var newSite = $('#newSite').val().toString();
        console.log(newSite);
        chrome.storage.sync.get(['blocked_sites'], function(sites){
            blocked_sites = sites['blocked_sites'];
            if(blocked_sites){
                blocked_sites.push(newSite);
            }else{
                blocked_sites = [];
                blocked_sites.push(newSite);
            }
            console.log(blocked_sites);
            chrome.storage.sync.set({'blocked_sites': blocked_sites}, ()=>{
                console.log("new site added");
            }); 
        });
    });
*/
var ctx = document.getElementById('myChart').getContext('2d');
/*
    1. line chart indicating site usage/time
    2. bar chart indicating site usage/time
    3. pie chart indicating site usage/time
    4. line or bar chart indicating total web usage/time
    5. line mixed with bar chart indicating site_usage/time and total web usage/time
*/
init(()=>{
    //console.log(`total time for ${getDateString(TODAY)}: ${usages_week[getDateString(TODAY)].total}s`);
    (usages_week && usages_week[getDateString(TODAY)]) ? $('#total-time').text(secondsToMinutes(usages_week[getDateString(TODAY)].total)) : $('#total-time').text("0");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: weekChartTotalTime(WEEK, TODAY, usages),
        options: CHART_OPTIONS
    });
});
window.setInterval(function() {
    chrome.runtime.sendMessage({request:REQUEST.GET_TIME_TABLE}, function(response){
        timeTable = response.done;
        usages_week = getSiteUsageFromDate(getWeekFrame(TODAY), timeTable, THRESH_HOLD);
        //console.log(`total time for ${getDateString(TODAY)}: ${usages[getDateString(TODAY)].total}s`);
        $('#total-time').text(secondsToMinutes(usages_week[getDateString(TODAY)].total));
    });
}, INTERVAL_SAVE_MS)


/*
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: '# of Votes',
                    data: [13, 2, 16, 4, 9, 20],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: false
                },
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
*/    
