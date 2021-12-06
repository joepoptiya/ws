(function () {
    'use strict';

    angular
        .module('workspace')
        .controller('PreviewTaskModalController', PreviewTaskModalController);

    PreviewTaskModalController.$inject = [
        '$uibModalInstance',
        'task'
    ];

    function PreviewTaskModalController($uibModalInstance, task) {
        var vm = this;
        vm.fields = [];
        vm.task = task;

        vm.close = function () {
            $uibModalInstance.close();
        };

        activate();

        function activate() {
            var fields = [];

            for (var key in task) {
                // Ignore angular properties
                if (key.indexOf('$$') !== 0) {
                    fields.push(key);
                }
            }

            fields.sort();

            vm.fields = fields;
        }
    }
})();