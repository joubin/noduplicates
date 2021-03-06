function createHooks() {
    ids = new Set();
    thistab = 0;
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        chrome.storage.sync.get(null, function(value) {
            tabduplicate(value["ignoreList"], value["strictList"], tabId, changeInfo, tab)

        })
    });
}

function tabduplicate(ignorelist = [], strictList = [], tabId, changeInfo, tab) {

    thistab = tabId
    if (changeInfo.status == 'complete' && tab.active) {
        chrome.tabs.query({}, function test(test) {
            for (variable of test) {
              if ((!(tabId == variable.id) && !(tab.url == "chrome://newtab/"))) {


                if ((tab.url === variable.url && isDomainInDomains(tab.url, ignorelist))
                || (isDomainInDomains(tab.url, strictList) == 0 && (getDomain(tab.url) == getDomain(variable.url)))  ) {
                    ids.add(variable.id)
                }
              }
            }
        });
        setTimeout(function() {
            if (ids.size > 0) {
                myids = ids;
                ids = new Set();

                chrome.notifications.create("", {
                    type: "basic",
                    iconUrl: 'logo.png',
                    title: "Duplicate",
                    message: "It looks like you have " + tab.url + " open " + myids.size + " times",
                    contextMessage: "",
                    buttons: [{
                        title: "Close this and go to the other one",
                        iconUrl: 'leave.png',
                    }, {
                        title: "Close the others and keep this",
                        iconUrl: 'close.png',
                    }]
                }, function(id) {
                    myNotificationID = id;
                });
                /* Respond to the user's clicking one of the buttons */
                chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
                    if (notifId === myNotificationID) {
                        if (btnIdx === 0) {
                            picked = myids.values().next().value
                            myids.add(thistab)
                            myids.forEach(function(item) {
                                if (item !== picked) {
                                    chrome.tabs.remove(item, function() {})
                                }

                            })
                            chrome.tabs.update(picked, {
                                selected: true
                            });

                            chrome.notifications.clear(notifId, function() {})
                        } else if (btnIdx === 1) {

                            myids.forEach(function(item) {
                                chrome.tabs.remove(item, function() {})
                            })
                            chrome.notifications.clear(notifId, function() {})

                        }
                    }
                });

            }
        }, 100)
    }


}

function getDomain(url, prematch) {
    var prefix = /^https?:\/\//;
    var domain = /^[^\/]+/;
    // remove any prefix
    url = url.replace(prefix, "");
    // assume any URL that starts with a / is on the current page's domain

    // now extract just the domain
    var match = url.match(domain);
    if (match) {
        return (match[0]);
    }
    return (null);
}

function getDomains(urls) {
    newurls = []
    urls.forEach(function(url) {
        newurls.push(getDomain(url));
    })
    return newurls;
}

function isDomainInDomains(domain, domains) {

    result = getDomains(domains).indexOf(getDomain(domain))
    return result
}

function main() {

}


document.addEventListener('DOMContentLoaded', function() {
    createHooks();
    main();
});
