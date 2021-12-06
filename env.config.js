//-----------------------------------------------------------------------
// <copyright file="env.config.js" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

(function () {
    'use strict';

    angular
        .module('portal.env')
        .config(config);

    config.$inject = [
        'portalConfig'
    ];

    function config(portalConfig) {
        if (typeof (mito) !== "undefined") {
            portalConfig.ENVIRONMENT = mito.angular.getEnvironment();
        }
    }
})();
