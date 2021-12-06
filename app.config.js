//-----------------------------------------------------------------------
// <copyright file="app.config.js" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

(function () {
    'use strict';

    angular
        .module('gdco')
        .config(config);

    config.$inject = [
        '$compileProvider',
        '$httpProvider',
        '$locationProvider',
        'adalAuthenticationServiceProvider',
        'sidebarMenuProvider',
        'toastrConfig',
        'configProvider',
        'commonConfig',
        'coreConfig'
    ];

    function config($compileProvider, $httpProvider, $locationProvider, adalProvider, sidebarMenuProvider, toastrConfig, configProvider, commonConfig, coreConfig) {
        $locationProvider.html5Mode(false);

        // prevent angular from prepending "unsafe:" to URLs beginning with the following protocols
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|sharepoint|file):/);

        var coreEnv = configProvider.get(coreConfig);
        var commonEnv = configProvider.get(commonConfig);

        commonEnv.endpoints['https://graph.microsoft.com'] = 'https://graph.microsoft.com';

        adalProvider.init(
            {
                instance: coreEnv.instance,
                tenant: coreEnv.tenant,
                clientId: coreEnv.clientId,
                endpoints: commonEnv.endpoints,
                redirectUri: window.location.protocol + '//' + window.location.host + '/AdalFrame' // redirect back to a simple app for adal iframes
            },
            $httpProvider
        );

        /// TODO qixie 01/30/2017: Find a better way to control access to FAQ page for each module
        var permissionsFaq = ['azurerma_seeFaq', 'spares_seeFaq', 'siteServices_seeFaq', 'rma_seeFaq', 'logistics_seeFaq', 'deployment_seeFaq', 'tasks_common_seeFaq'];
        sidebarMenuProvider.addMenuItem('FAQ', 'gdco.faq', 'gdco.faq', 900, 'glyphicon glyphicon-info-sign', '', permissionsFaq);


        // angular-toastr configuration
        angular.extend(toastrConfig, {
            autoDismiss: true,
            closeButton: true,
            containerId: 'toast-container',
            maxOpened: 5,
            newestOnTop: false,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body',
            tapToDismiss: false
        });
    }
})();