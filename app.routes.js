//-----------------------------------------------------------------------
// <copyright file="app.routes.js" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

(function () {
    'use strict';

    angular
        .module('gdco')
        .config(routes);

    routes.$inject = [
        '$stateProvider',
        '$urlRouterProvider',
        'configProvider',
        'commonConfig'
    ];

    function routes($stateProvider, $urlRouterProvider, configProvider, commonConfig) {
        var commonEnv = configProvider.get(commonConfig);

        $urlRouterProvider.otherwise('/');

        // Global controller and view
        $stateProvider.state('gdco', {
            url: '',
            templateUrl: 'App/gdco.html',
            controller: 'GdcoController',
            controllerAs: 'gdcoCtrl',
            abstract: true,
            resolve: {
                flighting:  function (flightingService, userSettingsFactory, adalAuthenticationService) {
                    var settings = {};
                    if (angular.isObject(adalAuthenticationService.userInfo)) {
                        settings = userSettingsFactory.getSettings(adalAuthenticationService.userInfo.userName) || {};
                    }

                    return flightingService.getFlightings(settings.datacenter, settings.datacenter, adalAuthenticationService.userInfo.userName);
                },
                userGroupIds: function (msGraphFactory) {
                    return msGraphFactory.getUsersGroupIds();
                }
            }
        });

        // User Settings routing
        $stateProvider.state('gdco.usersettings', {
            url: '/user/settings',
            templateUrl: 'App/user/usersettings.html',
            controller: 'userSettingsController',
            controllerAs: 'settingsCtrl',
            requireADLogin: commonEnv.requireADLogin
        });

        // FAQ pages.
        $stateProvider.state('gdco.faq', {
            url: '/faq/faqlist',
            templateUrl: 'App/faq/faqlist.html',
            controller: 'faqController',
            controllerAs: 'faqCtrl',
            requireADLogin: commonEnv.requireADLogin
        });

        // Prevent router from automatic state resolving
        $urlRouterProvider.deferIntercept();
    }
})();