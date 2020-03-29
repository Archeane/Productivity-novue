var validURL = function(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    },
    // convert the string to prper url format httos://www.google.com
    urlFormat = function(str){
        return str;
    },

    error = function(message){
        $(".error span").text(message);
        console.log("URL ERROR");
        //clear input fields
        // $(".error span").style.display = 'block';
    },
    success = function(message){
        $(".success span").text(message);
    },
    blockedSitesObj = function(site, time){
        var container = document.createElement("tr");
        var th = document.createElement("th");
        var a = document.createElement("a");
        a.style = "none";
        a.href.append(site.name);
        th.body.append(site.name);
        var x = document.createElement("i");
        x.attr("class", "fa-close delete-site");
        th.body.append(x);
        container.append(th);
        return container;
    },
    siteObj = function(domain, limit){
        //convert domain to proper url format
        return {
            name: domain,
            daylimit:{
                seconds: limit
            }
        }
    };


$(document).ready(init(()=>{
    $(".content").attr("style", "display: none");
    $(".menu li").on("click", function(){
        $(".content").attr("style", "display:none");
        $("."+$(this).attr("class")).attr("style", "display:block");
    });
    $(".controls").on("click", function(){$(this).toggleClass('activeControl'), $(this).siblings().toggleClass('activeControl');});
    console.log(blockedSites);
    console.log(timeTable);
    
   
    //dashboard
    var mainChart = document.getElementById('mainChart').getContext('2d');
    var week = getWeekFrame(TODAY);
    console.log(weekChartTotalTime(week, TODAY, usages));
    var myChart = new Chart(mainChart, {
        type: 'line',
        data: weekChartTotalTime(week, TODAY, usages),
        options: CHART_OPTIONS
    });
    



    //Block sites
    $('#addBlockSiteForm').on('submit', function(e){
        e.preventDefault();
        var site = $('#blockSiteName').val();
        var time = $("#blockSiteTime").val();
        console.log(site, time);
        chrome.runtime.sendMessage({request: REQUEST.APPEND_BLOCK_SITE}, function(response){
            return (response.done == true) ? $("#blockedSitesTable").body.append(blockedSitesObj(site, time)) : error(response.message);
        });
    });
    $(".deleteBlockedSite").on('click', function(){
        chrome.runtime.sendMessage({request: REQUEST.DELETE_BLOCK_SITE}, function(response){
            return response.done == true ? $("#blockedSitesTable").delete(this.parent()) : error(response.message);
        })
    });


    // $(".error span").style.display = 'none';
    /*chrome.runtime.sendMessage({request: "getBlockedSites"}, function(response) {
        const blockedSites = response.done;
        console.log(blockedSites, Object.keys(blockedSites).length);
        for(const prop in blockedSites){
            var site = blockedSites[prop];
            console.log(`obj.${prop} = ${blockedSites[prop].name} ${blockedSites[prop].daylimit.seconds}`);
            $('#blockedSites').append("<li>"+site.name+"    "+site.daylimit.seconds+"</li>");
        }
    });*/
}));