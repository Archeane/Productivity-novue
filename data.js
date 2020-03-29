var timeTable = {},
    blockedSites = {},
    usages_week = {},
    REQUEST = {
        GET_BLOCKED_SITES: "getBlockedSites",
        GET_TIME_TABLE: "getTimeTable",
        APPEND_BLOCK_SITE: "appendBlockedSites",
        DELETE_BLOCK_SITE: "deleteBlockedSites"
    }
    STORAGE_TIME_TABLE = "time-table",
    THRESH_HOLD = 30,
    
    WEEK_LABELS = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
    MONTH_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    YEAR_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    DEFAULT_CHART_COLOR = 'black',
    BACKGROUND_CHART_COLORS = ['rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'],
    BORDER_CHART_COLORS = ['rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'],
    CHART_OPTIONS = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

var getMonthFrame = function(date){
        return [];
    },
    secondsToMinutes = function(seconds){
        return Math.floor(seconds / 60);
    },
    getLastSevenDays = function(today){

    },
    // get weekdays in given day
    getWeekFrame = function(arg){
        let week = [];
        var date = new Date(arg);
        for (let i = 1; i <= 7; i++) {
          let first = date.getDate() - date.getDay() + i;
          let day = new Date(date.setDate(first)).toISOString().slice(0, 10);
          week.push(day);
        }
        return week;
    };

var WEEK_DATA = {
        week: [],                        //array of dates this week_data covers
        total_usage_week: 0,            //total seconds online this week
        each_site_usage: {},            //visited_site: total time on this site this week
        total_usage_per_day: [],        //how many seconds per day, null if date does not exist in daily_usage
        daily_usage: {}                 //date: json object of daily usage
    },
    getSiteUsageFromDate = function(dates, timeTable, THRESH_HOLD){
        usages = {};
        for(var date of dates){
            usages[date] = {
                total: 0,
                data: []
            };
            if (timeTable.hasOwnProperty(date)){
                for(var site in timeTable[date]){
                    if(timeTable[date][site] > THRESH_HOLD){
                        usages[date].data.push([site, timeTable[date][site]]);
                        usages[date].total += timeTable[date][site];
                    }
                }
                usages[date].data.sort(function(a, b) {
                    return b[1] - a[1];
                });
            }
            else{
                continue;
            }
        }
        return usages;
    },
    WEEK_DATA_INIT = function(today, timeTable){
        WEEK_DATA.week = getWeekFrame(today);
        WEEK_DATA.daily_usage = getSiteUsageFromDate(WEEK_DATA.week, timeTable, THRESH_HOLD);
        for(var date of WEEK_DATA.week){ //for each day in the week
            if(WEEK_DATA.daily_usage.hasOwnProperty(date)){
                WEEK_DATA.total_usage_week += WEEK_DATA.daily_usage[date].total;
                WEEK_DATA.total_usage_per_day.push(secondsToMinutes(WEEK_DATA.daily_usage[date].total)); 
                //top sites
                for(var site of WEEK_DATA.daily_usage[date].data){
                    if(site[1] > THRESH_HOLD && WEEK_DATA.each_site_usage.hasOwnProperty(site[0])){
                        WEEK_DATA.each_site_usage[site[0]] += site[1];
                    }else{
                        WEEK_DATA.each_site_usage[site[0]] = site[1];
                    }
                }
            }else{
                WEEK_DATA.total_usage_per_day.push(null);
            }
        }
    }
    weekChartTotalTime = (dates, date, usages) => {
        //var dates = getWeekFrame(date);
        //var usages = getSiteUsageFromDate(dates);
        var labels = dates;
        var dataset = [{
            label: 'Total time online',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false
        }]
        for(var date of dates){ //for each day in the week
            // console.log(`usage contains date ${date}: ${usages.hasOwnProperty(date)}`);
            if(usages.hasOwnProperty(date)){
                // console.log(`${date} has total time of: ${usages[date].total}`);
                dataset[0].data.push(secondsToMinutes(usages[date].total));
            }else{
                dataset[0].data.push(null);
            }
        }
        // console.log(dataset);
        return {
            labels: labels,
            datasets: dataset,
            
        }
    };

var TODAY = new Date("2020-01-18"),
    LAST_SEVEN_DAYS = getLastSevenDays(TODAY);
    //WEEK = getWeekFrame(TODAY);

console.log(`today is ${TODAY}\nlast_seven_days: ${LAST_SEVEN_DAYS} \nweek: ${WEEK}`);
function init(cb){
    chrome.runtime.sendMessage({request: REQUEST.GET_BLOCKED_SITES}, function(response) {
        blockedSites = response.done;
        chrome.runtime.sendMessage({request:REQUEST.GET_TIME_TABLE}, function(response){
            timeTable = response.done;
            //usages_week = getSiteUsageFromDate(WEEK, timeTable, THRESH_HOLD);

            WEEK_DATA_INIT(TODAY, timeTable);
            console.log(timeTable);
            //console.log(usages_week);
            console.log(WEEK_DATA);
            cb();
        });
    });
}
    