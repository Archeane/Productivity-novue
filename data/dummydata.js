function UserException(message){
    this.message = message;
    this.name = 'UserException'
}

// date utils
isWorkday = (date) => {return True;}
getWeekFrame = (date) => {return [];}
getMonthFrame = (date) => {return [];}

// url utils
urlFormatter = (url) => {   // strip http & www from url
    var prefix = 'http://';
    if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
    }
    return url;
}
validateUrl = (url) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}


class AllBlockSite {
    constructor(){
        this.AllBlockSite = {}
    }

    addBlockSite = (site, siteTimeLimit) => {
        var blockSite = new BlockSite(site, siteTimeLimit);
        AllBlockSite[blockSite.url] = blockSite;
    }

    isBlockSite = (url) => {return this.AllBlockSite.hasOwnProperty(urlFormatter(url));}

    siteReachedLimit = (url, siteTime) => {
        if(!isBlockSite(url)) {return false;}
        var formattedUrl = urlFormatter(url);
        if(isWorkday(new Date()) && this.AllBlockSite[formattedUrl].hasWorkDayLimit() && this.AllBlockSite[formattedUrl].workdayLimitReached(siteTime)){ return true; }
        if(this.AllBlockSite[formattedUrl].hasWeekLimit() && this.AllBlockSite[formattedUrl].weekLimitReached(siteTime)){ return true; }
        if(this.AllBlockSite[formattedUrl].dayLimitReached(siteTime)){ return true; }
        return false;
    }
}

class BlockSite {
    constructor(site, dayLimit, weekLimit=null, workdayLimit=null){
        this.url = urlFormatter(site);
        this.dayLimit = dayLimit;
        this.weekLimit = weekLimit;
        this.workdayLimit = workdayLimit;
        this.blockedOccurance = 0   // number of times the site is blocked
    }

    hasWorkDayLimit = () => {
        return this.workdayLimit != null
    }

    workdayLimitReached = (time) => {
        if(time >= this.workdayLimit){
            this.blockedOccurance++;
            return true;
        }
        return false;
    }

    hasWeekLimit = () => {
        return this.weekLimit != null
    }

    weekLimitReached = (time) => {
        if(time >= this.weekLimit){
            this.blockedOccurance++;
            return true;
        }
        return false;
    }

    dayLimitReached = (time) => {
        if(time >= this.dayLimit){
            this.blockedOccurance++;
            return true;
        }
        return false;
    }
}

class AllSiteUsage {
    constructor(){
        this.AllSiteUsage = {}  // (site -> BlockSite)
    }

    addTimeToSite = (url, time) => {
        formatedUrl = urlFormatter(url);
        if(!AllSiteUsage.hasOwnProperty(formatedUrl)){
            allSiteUsage[formatedUrl] = new SiteUsage(formatedUrl, 0, new Date());
        }
        allSiteUsage[formatedUrl].addTime(new Date(), time);
        // calls blocksite checker
        if(AllBlockedSites.siteReachedLimit(formatedUrl, allSiteUsage[formatedUrl].dayUsage())){
            //send a block request
        }
    }

    // get usage total per time unit
    getDayUsage = (day) => {}

    getWeekUsage = (week) => {}

    getMonthUsage = (month) => {}

    // get usage for specific site per time unit
    getSiteDayUsage = (site, day) => {}

    getSiteWeekUsage = (site, week) => {}

    getSiteMonthUsage = (site, month) => {}
}

class SiteUsage {
    constructor(url, time, date){
        
    }

    dayUsage = (date) => {return 0;}
    weekUsage = (week) => {return [];}
    monthUsage = (month) => {return [];}
    weekTotalUsage = (week) => {return 0;}
    monthTotalUsage = (month) => {return 0;}

    addTime = (date, time) => {}
}