(function () {
    'use strict';

    angular
        .module('workspace')
        .controller('OpenWorkspaceModalController', OpenWorkspaceModalController);

    OpenWorkspaceModalController.$inject = [
        '$uibModalInstance',
        'presetWorkspaces',
        'workspacesFactory',
        'notificationsFactory',
        'utils'
    ];

    function OpenWorkspaceModalController($uibModalInstance, presetWorkspaces, workspacesFactory, notificationsFactory, utils) {
        var vm = this;
        vm.presets = presetWorkspaces.presets;
        vm.myWorkspaces = [];
        vm.sharedWorkspaces = [];
        vm.query = '';
        vm.searchOptions = 'name';
        vm.loadingMyWorkspaces = false;
        vm.loadingSharedWorkspaces = false;
        vm.searching = false;

        vm.gridOptions = {
            appScopeProvider: vm,
            data: [],
            enableSorting: true,
            enableFiltering: true,
            enableRowSelection: true,
            enableSelectAll: false,
            multiSelect: false,
            fastWatch: true,
            flatEntityAccess: true,
            headerRowHeight: 40,
            minRowsToShow: 7,
            enableColumnMenus: false,
            onRegisterApi: function (gridApi) {
                vm.gridApi = gridApi;
            },
            columnDefs: [
                {
                    displayName: 'Name',
                    field: "name",
                    filter: { disableCancelFilterButton: true }
                },
                {
                    displayName: 'Author',
                    field: "createdBy",
                    filter: { disableCancelFilterButton: true }
                }
            ]
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.open = function () {
            var selectedRows = [];

            if (vm.gridApi) {
                selectedRows = vm.gridApi.selection.getSelectedRows();
            }

            if (!vm.workspace && selectedRows.length > 0) {
                vm.workspace = selectedRows[0];
            }

            if (vm.workspace) {
                workspacesFactory.getWorkspace(vm.workspace.id)
                    .then(function (result) {
                        $uibModalInstance.close(result.data);
                    })
                    .catch(function (result) {
                        notificationsFactory.addNotification('Error', 'Failed to get open workspace.',
                            utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.ERROR);

                        $uibModalInstance.dismiss('cancel');
                    });
            }
        };

        vm.search = function () {
            if (vm.searching) {
                return;
            }

            if (vm.query.length > 0) {
                vm.searching = true;

                workspacesFactory.searchWorkspaces(vm.query, vm.searchOptions)
                    .then(function (result) {
                        if (result.status !== 204) {
                            vm.gridOptions.data = result.data;
                        }
                    })
                    .catch(function (result) {
                        notificationsFactory.addNotification('Error', 'Failed to get search workspaces.',
                            utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.ERROR);
                    })
                    .finally(function () {
                        vm.searching = false;
                    });
            }
        };

        activate();

        function activate() {
            vm.loadingMyWorkspaces = true;
            vm.loadingSharedWorkspaces = true;

            // Load my workspaces
            workspacesFactory.getWorkspacesCreatedByMe()
                .then(function (result) {
                    vm.myWorkspaces = result.data;
                })
                .catch(function (result) {
                    notificationsFactory.addNotification('Error', 'Failed to get created workspaces.',
                        utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.ERROR);
                })
                .finally(function () {
                    vm.loadingMyWorkspaces = false;
                });

            // Load shared workspaces
            workspacesFactory.getWorkspacesSharedWithMe()
                .then(function (result) {
                    vm.sharedWorkspaces = result.data;
                })
                .catch(function (result) {
                    notificationsFactory.addNotification('Error', 'Failed to get shared workspaces.',
                        utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.ERROR);
                })
                .finally(function () {
                    vm.loadingSharedWorkspaces = false;
                });
        }
    }
})();