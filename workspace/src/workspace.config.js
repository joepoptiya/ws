//-----------------------------------------------------------------------
// <copyright file="workspace.config.js" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

(function () {
    'use strict';

    angular
        .module('workspace')
        .config(config);

    config.$inject = [
        'sidebarMenuProvider'
    ];

    function config(sidebarMenuProvider) {
        sidebarMenuProvider.addMenuItem('Workspace', 'workspace', 'workspace', 401, 'glyphicon glyphicon-th');
    }
})();