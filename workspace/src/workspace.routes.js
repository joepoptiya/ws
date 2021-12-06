//-----------------------------------------------------------------------
// <copyright file="workspace.routes.js" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

(function () {
    'use strict';

    angular
        .module('workspace')
        .config(routes);

    routes.$inject = [
        '$stateProvider',
        'configProvider',
        'commonConfig'
    ];

    function routes($stateProvider, configProvider, commonConfig) {
        var commonEnv = configProvider.get(commonConfig);

        $stateProvider.state('workspace', {
            url: '/workspace',
            templateUrl: 'App/workspace/src/workspace/workspace.html',
            controller: 'WorkspaceController',
            controllerAs: 'workspaceCtrl',
            requireADLogin: commonEnv.requireADLogin
        });
    }
})();