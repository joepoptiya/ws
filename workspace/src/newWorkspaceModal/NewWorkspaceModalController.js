(function () {
    'use strict';

    angular
        .module('workspace')
        .controller('NewWorkspaceModalController', NewWorkspaceModalController);

    NewWorkspaceModalController.$inject = [
        '$uibModalInstance',
        'domainDataFactory',
        'uuid',
        'adalAuthenticationService',
        'notificationsFactory',
        'utils',
        'workspacesFactory'
    ];

    function NewWorkspaceModalController($uibModalInstance, domainDataFactory, uuid, adalAuthenticationService, notificationsFactory, utils, workspacesFactory) {
        var vm = this;
        vm.name;
        vm.query;

        vm.gridOptions = {
            appScopeProvider: vm,
            data: [],
            enableSorting: true,
            enableFiltering: true,
            enableRowSelection: true,
            enableSelectAll: true,
            multiSelect: true,
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
                    displayName: 'Code',
                    field: "DatacenterCode",
                    width: "100",
                    filter: { disableCancelFilterButton: true }
                },
                {
                    displayName: 'Name',
                    field: "DatacenterName",
                    filter: { disableCancelFilterButton: true }
                }
            ]
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.create = function () {
            var workspace = {
                id: uuid.v4(),
                name: vm.name,
                query: vm.query,
                datacenters: vm.gridApi ? vm.gridApi.selection.getSelectedRows().map(function (item) { return item.DatacenterCode; }) : [],
                createdBy: adalAuthenticationService.userInfo.userName,
                'public': false,
                sharedWith: [],
                tiles: []
            };

            workspacesFactory.createWorkspace(workspace)
                .then(function () {
                    $uibModalInstance.close(workspace);
                })
                .catch(function (result) {
                    notificationsFactory.addNotification('Error', 'Failed to create new workspace.',
                        utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.ERROR);

                    $uibModalInstance.dismiss('cancel');
                });
        };

        activate();

        function activate() {
            domainDataFactory.getPhysicalDatacenters()
                .then(function (result) {
                    vm.gridOptions.data = result;
                });
        };
    }
})();