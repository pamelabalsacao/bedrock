/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function(Mozilla) {
    'use strict';

    var GTM_CONTAINER_ID = document.getElementsByTagName('html')[0].getAttribute('data-gtm-container-id');
    var trafficCopOriginalReferrer;

    // If doNotTrack is not enabled, it is ok to add GTM
    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=1217896 for more details
    if (typeof window._dntEnabled === 'function' && !window._dntEnabled() && GTM_CONTAINER_ID) {
        (function(w,d,s,l,i,j,f,dl,k,q){
            w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});f=d.getElementsByTagName(s)[0];
            k=i.length;q='//www.googletagmanager.com/gtm.js?id=@&l='+(l||'dataLayer');
            while(k--){j=d.createElement(s);j.async=!0;j.src=q.replace('@',i[k]);f.parentNode.insertBefore(j,f);}
        }(window,document,'script','dataLayer',[GTM_CONTAINER_ID]));

        // check for an original referrer set by traffic cop
        trafficCopOriginalReferrer = Mozilla.Cookies.getItem('mozilla-traffic-cop-original-referrer');

        // if original referrer exists, pass it to ga
        if (trafficCopOriginalReferrer) {
            setTimeout(function() {
                console.log('trying to set referrer to ' + trafficCopOriginalReferrer);
                if (window.ga) {
                    console.log('ga is here! we are setting the referrer!');
                    window.ga('set', 'referrer', trafficCopOriginalReferrer);
                } else {
                    console.log('ga is not ready :(');
                }

                // referrer shouldn't persist, right?
                Mozilla.Cookies.removeItem('mozilla-traffic-cop-original-referrer');
            }, 500);
        }
    }
})(window.Mozilla);
