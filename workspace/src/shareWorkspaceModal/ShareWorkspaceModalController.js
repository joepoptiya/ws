(function () {
    'use strict';

    angular
        .module('workspace')
        .controller('ShareWorkspaceModalController', ShareWorkspaceModalController);

    ShareWorkspaceModalController.$inject = [
        '$http',
        '$q',
        'workspacesFactory',
        'notificationsFactory',
        'utils',
        '$uibModalInstance',
        'workspace'
    ];

    function ShareWorkspaceModalController($http, $q, workspacesFactory, notificationsFactory, utils, $uibModalInstance, workspace) {
        var vm = this;
        vm.user;
        vm.public = workspace.public;

        vm.gridOptions = {
            appScopeProvider: vm,
            data: [],
            fastWatch: true,
            flatEntityAccess: true,
            enableCellEditOnFocus: true,
            headerRowHeight: 40,
            rowHeight: 40,
            minRowsToShow: 7,
            enableSorting : false,
            enableColumnMenus: false,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
            },
            columnDefs: [
                {
                    displayName: '',
                    name: 'temp',
                    cellTemplate: '<div class="ui-grid-cell-contents"><button class="btn btn-xs" ng-click="grid.appScope.removeUser(row.entity)"><span class="glyphicon glyphicon-remove red"></span></button></div>',
                    width: 40,
                    enableCellEdit: false
                },
                {
                    displayName: 'User',
                    field: "user",
                    enableCellEdit: false
                },
                {
                    displayName: 'Permissions (click to edit)',
                    field: "permissions",
                    enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownOptionsArray: [
                        { id: 'View', value: 'View' },
                        { id: 'Edit', value: 'Edit' },
                        { id: 'Full', value: 'Full' }
                    ]
                }
            ]
        };

        vm.addUser = function () {
            if (!vm.user) {
                return;
            }

            vm.gridOptions.data.push({
                user: vm.user,
                permissions: 'View'
            });
        };

        vm.getAlias = function (value) {
            if (vm.user.length >= 3) {
                return $http.get('https://graph.microsoft.com/v1.0/users/?$filter=startswith%28userPrincipalName%2C%20%27' + value + '%27%29')
                    .then(function (result) {
                        return result.data.value;
                    })
                    .catch(function (result) {
                        var x = 5;
                    });
            }
        };

        vm.removeUser = function (user) {
            var index = vm.gridOptions.data.indexOf(user);
            if (index !== -1) {
                vm.gridOptions.data.splice(index, 1);
            }
        }

        vm.share = function () {
            workspace.public = vm.public;
            workspace.sharedWith = vm.gridOptions.data;

            workspacesFactory.saveWorkspace(workspace)
                .then(function (result) {
                    notificationsFactory.addNotification('Success', 'Successfully shared workspace.',
                        utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.SUCCESS);

                    $uibModalInstance.close();
                })
                .catch(function (result) {
                    notificationsFactory.addNotification('Error', 'Failed to share workspace.',
                        utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.ERROR);
                });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        activate();

        function activate() {
            vm.gridOptions.data = angular.copy(workspace.sharedWith);
        }
    }
})();