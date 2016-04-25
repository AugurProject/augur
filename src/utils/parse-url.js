export function ParseURL(url) {
    var splitURL = url.split('?'),
        parsed = {};

    if (splitURL.length >= 1) {
        parsed.pathArray = parsePath(splitURL[0]);
    }
    if (splitURL.length >= 2) {
        parsed.searchParams = parseSearch(splitURL[1]);
    }

    return MakeLocation(parsed.pathArray, parsed.searchParams);
}

export function MakeLocation(pathArray = [], searchParams = {}) {
    var pathname = pathArray.join(''),
        search = searchParams && Object.keys(searchParams).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(searchParams[key])).join('&') || '',
        url;

    if (!pathname.length) {
        pathname = '/';
    }

    if (search.length) {
        url = pathname + '?' + search;
    }
    else {
        url = pathname;
    }

    return {
        pathArray,
        searchParams,
        url
    };
}

function parsePath(pathString) {
    if (!pathString || pathString === '/') {
        return ['/'];
    }
    return pathString.split('/').filter(pathItem => pathItem && pathItem.indexOf('.') <= -1).map(pathItem => '/' + pathItem);
}

function parseSearch(searchString) {
    var pairSplit;
    return (searchString || '').replace(/^\?/, '').split('&').reduce((p, pair) => {
        pairSplit = pair.split('=');
        if (pairSplit.length >= 1) {
            if (pairSplit[0].length) {
                if (pairSplit.length >= 2 && pairSplit[1]) {
                    p[decodeURIComponent(pairSplit[0])] = decodeURIComponent(pairSplit[1]);
                }
                else {
                    p[decodeURIComponent(pairSplit[0])] = '';
                }
            }
        }
        return p;
    }, {});
}
