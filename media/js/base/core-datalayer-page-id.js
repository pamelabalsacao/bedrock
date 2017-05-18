/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

if (typeof Mozilla == 'undefined') {
    var Mozilla = {};
}

(function() {
    // init dataLayer object
    var dataLayer = window.dataLayer = window.dataLayer || [];
    var Analytics = {};

    /** Returns page ID used in Event Category for GA events tracked on page.
    * @param {String} path - URL path name fallback if page ID does not exist.
    * @return {String} GTM page ID.
    */
    Analytics.getPageId = function(path) {
        var pageId = document.getElementsByTagName('html')[0].getAttribute('data-gtm-page-id');
        var pathName = path ? path : document.location.pathname;

        return pageId ? pageId : pathName.replace(/^(\/\w{2}\-\w{2}\/|\/\w{2,3}\/)/, '/');
    };

    var dataObj = {
        'event': 'page-id-loaded',
        'pageId': Analytics.getPageId(),
        'customReferrer': 'direct'
    };

    // check for an original referrer set by traffic cop
    var trafficCopOriginalReferrer = Mozilla.Cookies.getItem('mozilla-traffic-cop-original-referrer');

    // if original referrer exists, pass it to ga
    if (trafficCopOriginalReferrer) {
        console.log('trying to set referrer to ' + trafficCopOriginalReferrer);

        dataObj.customReferrer = trafficCopOriginalReferrer;

        // referrer shouldn't persist, right?
        Mozilla.Cookies.removeItem('mozilla-traffic-cop-original-referrer');
    }

    console.log(dataObj);

    // Push page ID into dataLayer so it's ready when GTM container loads.
    dataLayer.push(dataObj);

    Mozilla.Analytics = Analytics;
})();

