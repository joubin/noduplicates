function getDomain(url, prematch) {
    var prefix = /^https?:\/\//;
    var domain = /^[^\/]+/;
    // remove any prefix
    url = url.replace(prefix, "");
    // assume any URL that starts with a / is on the current page's domain

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

function isurl(url){
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  return url.match(regex)
}
