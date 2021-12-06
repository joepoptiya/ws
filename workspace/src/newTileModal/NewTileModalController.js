(function () {
    'use strict';

    angular
        .module('workspace')
        .controller('NewTileModalController', NewTileModalController);

    NewTileModalController.$inject = [
        '$uibModalInstance',
        'taskModelFactory',
        'tile'
    ];

    function NewTileModalController($uibModalInstance, taskModelFactory, tile) {
        tile = tile || {};

        var vm = this;
        
        vm.fields = taskModelFactory.getAllProperties().sort();
        vm.dateProperties = vm.fields.filter(function (item) {
            return taskModelFactory.getPropertyType(item) === 'date';
        });

        vm.availableColumns = [];
        vm.selectedColumns = tile.tableColumns || ['Id', 'FaultDetail', 'Severity', 'Status', 'Datacenter', 'AssignedTo', 'TaskType', 'Group', 'DueDate', 'CreatedOn'];

        vm.selectedOfAvailable = [];
        vm.selectedOfSelected = []

        vm.columns = ['1', '2', '3', '4'];
        vm.rows = ['1', '2', '3', '4', '5', '6'];

        vm.title = tile.title || '';
        vm.sizeY = angular.isDefined(tile.sizeY) ? tile.sizeY + '': '1';
        vm.sizeX = angular.isDefined(tile.sizeX) ? tile.sizeX + '' : '1';
        vm.type = tile.type || '';
        vm.displayType = tile.displayType || '';
        vm.overTime = tile.overTime || false;
        vm.group = tile.group || '';
        vm.groupAlt = tile.groupAlt || '';
        vm.appearance = tile.appearance || 'default';

        vm.filter = angular.isArray(tile.filter) && tile.filter.length > 0
            ? tile.filter
            : [
                {
                    logicalOperator: 'and',
                    field: '',
                    operation: '',
                    value: ''
                }
            ];

        vm.addFilter = function (index) {
            vm.filter.splice(index, 0, {
                logicalOperator: 'and',
                field: '',
                operation: '',
                value: ''
            });
        };

        vm.removeFilter = function (index) {
            vm.filter.splice(index, 1);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.save = function () {
            $uibModalInstance.close({
                title: vm.title,
                appearance: vm.appearance,
                sizeY: angular.isString(vm.sizeY) ? parseInt(vm.sizeY) : vm.sizeY,
                sizeX: angular.isString(vm.sizeX) ? parseInt(vm.sizeX) : vm.sizeX,
                tableColumns: vm.selectedColumns,
                type: vm.type,
                displayType: vm.displayType,
                //overTime: vm.overTime,
                group: vm.group,
                groupAlt: vm.groupAlt,
                filter: vm.filter
            });
        };

        vm.addSelected = function () {
            vm.selectedColumns = vm.selectedColumns.concat(vm.selectedOfAvailable);
            
            angular.forEach(vm.selectedOfAvailable, function (selected) {
                var index = vm.availableColumns.indexOf(selected);
                if (index !== -1) {
                    vm.availableColumns.splice(index, 1);
                }
            });
        };

        vm.removeSelected = function () {
            vm.availableColumns = vm.availableColumns.concat(vm.selectedOfSelected);
            vm.availableColumns.sort();

            angular.forEach(vm.selectedOfSelected, function (selected) {
                var index = vm.selectedColumns.indexOf(selected);
                if (index !== -1) {
                    vm.selectedColumns.splice(index, 1);
                }
            });
        };

        vm.moveSelected = function (direction) {
            angular.forEach(vm.selectedOfSelected, function (selected) {
                var index = vm.selectedColumns.indexOf(selected);
                if (index !== -1) {
                    if (direction === 'up' && index !== 0) {
                        vm.selectedColumns.splice(index, 1);
                        vm.selectedColumns.splice(index - 1, 0, selected);
                    } else if (direction === 'down' && index !== vm.selectedColumns.length - 1) {
                        vm.selectedColumns.splice(index, 1);
                        vm.selectedColumns.splice(index + 1, 0, selected);
                    }
                }
            });
        };

        vm.fieldType = function (field) {
            return taskModelFactory.getPropertyType(field);
        };

        vm.fieldValues = function (field) {
            return taskModelFactory.getPropertyValues(field);
        };

        vm.getOperators = function (field) {
            return taskModelFactory.getOperators(field);
        };

        activate();

        function activate() {
            var properties = angular.copy(vm.fields);

            angular.forEach(vm.selectedColumns, function (column) {
                var index = properties.indexOf(column);
                if (index !== -1) {
                    properties.splice(index, 1);
                }
            });

            vm.availableColumns = properties;
        }
    }
})();