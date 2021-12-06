//-----------------------------------------------------------------------
// <copyright file="app.module.js" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

(function () {
    'use strict';

    angular
        .module('gdco', [
            'workspace',
            'flighting',
            'portal.common',
            'gdcoService',
            'home',
            'spares',
            'dbds',
            'rma',
            'tasks.common',
            'azurerma',
            'breakfix',
            'escalate',
            'omc',
            'simpleChange',
            'sop',
            'deployment',
            'gfsd',
            'decomm',
            'icm',
            'generalRequest',
            'receiveToTile',
            'logistics',
            'ui.router',
            'AdalAngular',
            'toastr',
            'xeditable',
            'portal.env',
            'portal.core.env',
            'permission.ui'
        ]);

    angular
        .module('gdco')
        .run(run);

    run.$inject = [
        '$window',
        '$rootScope',
        '$urlRouter',
        '$state',
        'editableOptions',
        'userRolesFactory',
        'adalAuthenticationService',
        'userSettingsFactory',
        'homepages'
    ];

    function run($window, $rootScope, $urlRouter, $state, editableOptions, userRolesFactory, adalAuthenticationService, userSettingsFactory, homepages) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // When the user first logs into the app, redirect them the their set homepage.
            if (!fromState.name && toState.name === 'gdco.home') {
                var settings = userSettingsFactory.getSettings(adalAuthenticationService.userInfo.userName);

                if (settings && settings.homepage) {
                    event.preventDefault();

                    $state.go(settings.homepage, toParams, { location: 'replace' });
                }
            }

            // Note: Uncomment these commands to debug routing; comment when not dubugging.
            //console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
        });

        // Note: Uncomment these commands to debug routing; comment when not dubugging.
        //$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
        //    console.log('$s$tateChangeError - fired when an error occurs during transition.');
        //    console.log(arguments);
        //});

        //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //    console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
        //});

        //$rootScope.$on('$viewContentLoaded', function (event) {
        //    console.log('$viewContentLoaded - fired after dom rendered', event);
        //});

        //$rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        //    console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
        //    console.log(unfoundState, fromState, fromParams);
        //});

        // Set application theme
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

        // Set up all permissions
        userRolesFactory.initAllPerms();

        // Setup offline events
        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function () {
            $rootScope.$apply(function () {
                $rootScope.isOnline = false;
            });
        }, false);
        $window.addEventListener("online", function () {
            $rootScope.$apply(function () {
                $rootScope.isOnline = true;
            });
        }, false);

        // Also enable router to listen to url changes
        $urlRouter.listen();
    }
})();