(function () {
    'use strict';

    angular
        .module('workspace')
        .directive('tile', tile);

    function tile() {
        var directive = {
            restrict: 'E',
            templateUrl: 'App/workspace/src/tile/tile.html',
            scope: {
                tile: '=tileData',
                index: '=',
                editing: '=',
                query: '=',
                datacenters: '=',
                expandTile: '&',
                editTile: '&',
                removeTile: '&',
                addTile: '&'
            },
            controller: TileController,
            controllerAs: 'tileCtrl',
            bindToController: true
        };

        return directive;
    }

    TileController.$inject = [
        '$scope',
        '$timeout',
        '$interval',
        '$uibModal',
        'geolocation',
        'adalAuthenticationService',
        'domainDataFactory',
        'tasksFactory',
        'taskHelper',
        'taskListHelper',
        'taskModelFactory'//,
        //'uiGridConstants'
    ];

    function TileController($scope, $timeout, $interval, $uibModal, geolocation, adalAuthenticationService, domainDataFactory, tasksFactory, taskHelper, taskListHelper, taskModelFactory/*, uiGridConstants*/) {
        var updatedTaskListener;
        var newTaskListener;
        var tileSizeListener;
        var exandedListener;
        var tileListener;
        var timer;

        var vm = this;
        vm.loading = false;
        vm.expanded = false;
        vm.aggregation;
        vm.newTaskCount = 0;
        vm.datax;
        vm.eventSources = [];
        vm.timeRemaining;

        vm.tableHeaders = [];

        vm.expand = function () {
            if (angular.isFunction(vm.expandTile)) {
                vm.expanded = vm.expandTile({ index: vm.index, expand: !vm.expanded });

                if (!vm.expanded) {
                    vm.gridOptions.data = vm.tasks;
                }
            }
        };

        vm.showGrid = false;

        vm.gridOptions = {
            rowData: null,
            angularCompileRows: true,
            angularCompileFilters: true,
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'multiple',
            enableColResize: true,
            rowHeight: 40,
            headerHeight: 40
        };

        var columnResized = true;

        var gridApiWatch = $scope.$watch(function () {
            return vm.gridOptions.api;
        }, function (newValue) {
            if (newValue) {
                vm.gridOptions.api.addEventListener('columnResized', function () {
                    columnResized = true;
                });

                gridApiWatch();
            }
        });

        $interval(function () {
            if (columnResized && vm.showGrid && vm.gridOptions.api) {
                vm.gridOptions.api.sizeColumnsToFit();

                $timeout(function () {
                    columnResized = false;
                }, 200);
            }
        }, 250);
        //vm.gridOptions = {
        //    appScopeProvider: vm,
        //    data: [],
        //    enableSorting: true,
        //    enableFiltering: true,
        //    enableColumnResizing: true,
        //    fastWatch: true,
        //    flatEntityAccess: true,
        //    rowHeight: 40,
        //    headerRowHeight: 40,
        //    enableColumnMenus: false,
        //    onRegisterApi: function (gridApi) {
        //        vm.gridApi = gridApi;
        //    }
        //};

        vm.uiConfig = {
            calendar: {
                height: 450,
                editable: false,
                header: {
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                }//,
                //eventClick: $scope.alertEventOnClick,
                //eventDrop: $scope.alertOnDrop,
                //eventResize: $scope.alertOnResize
            }
        };

        tileSizeListener = $scope.$watch(function () {
            var elem = document.getElementById('tile' + vm.index);
            if (elem) {
                return { h: elem.offsetHeight, w: elem.offsetWidth };
            }
        }, function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                if (vm.expanded) {
                    vm.gridHeight = newValue.h - 65;
                } else if (vm.chart) {
                    vm.chart.resize({ height: newValue.h - 60, width: newValue.w - 60 })
                } else if (vm.tile.type === 'table') {
                    if (newValue.w < 250) {
                        vm.tableColumnCount = 1;
                    } else if (newValue.w < 500) {
                        vm.tableColumnCount = 2;
                    } else if (newValue.w < 768) {
                        vm.tableColumnCount = 3;
                    } else if (newValue.w < 992) {
                        vm.tableColumnCount = 5;
                    } else if (newValue.w < 1200) {
                        vm.tableColumnCount = 7;
                    } else {
                        vm.tableColumnCount = 9;
                    }

                    vm.tableRowCount = newValue.h / 40 - 2;
                } else if (vm.tile.type === 'calendar') {
                    vm.uiConfig.calendar.height = newValue.h - 100;
                }
            }
        }, true);

        exandedListener = $scope.$watch(function () {
            return vm.expanded;
        }, function (newValue) {
            if (angular.isDefined(newValue)) {
                if (newValue) {
                    $timeout(function () {
                        vm.showGrid = true;
                    }, 350);
                } else {
                    vm.showGrid = false;
                }
            }
        });

        tileListener = $scope.$watch(function () {
            return vm.tile;
        }, function () {
            activate();
        });

        vm.previewTask = function (task) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'App/workspace/src/previewTaskModal/previewTaskModal.html',
                controller: 'PreviewTaskModalController',
                controllerAs: 'previewTaskModalCtrl',
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });
        };

        vm.pinTask = function (task) {
            if (angular.isFunction(vm.addTile)) {
                var newTile = {
                    title: 'Task ' + task.Id + ' due in',
                    appearance: 'default',
                    type: 'timer',
                    displayType: '',
                    group: 'DueDate',
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    originalSizeX: 2,
                    originalSizeY: 1,
                    filter: [
                        {
                            logicalOperator: '',
                            field: 'Id',
                            operator: '=',
                            value: task.Id
                        }
                    ],
                    tableColumns: [
                        'Id',
                        'FaultDetails',
                        'Severity',
                        'Status',
                        'Datacenter',
                        'AssignedTo',
                        'TaskType',
                        'Group',
                        'DueDate',
                        'CreatedOn'
                    ]
                };

                vm.addTile({ tile: newTile });
            }
        };

        vm.moveColumns = function (direction) {
            var right = direction === 'right';

            var hide = true;

            if (right) {
                for (var i = 1; i < vm.gridOptions.columnDefs.length; i++) {
                    if (hide && (vm.gridOptions.columnDefs[i].visible || vm.gridOptions.columnDefs[i].visible === undefined)) {
                        vm.gridOptions.columnDefs[i].visible = false;
                        hide = false;
                        continue;
                    }

                    if (!hide && vm.gridOptions.columnDefs[i].visible === false) {
                        vm.gridOptions.columnDefs[i].visible = true;
                        break;
                    }
                }
            } else {
                for (var i = vm.gridOptions.columnDefs.length - 1; i > 0; i--) {
                    if (hide && (vm.gridOptions.columnDefs[i].visible || vm.gridOptions.columnDefs[i].visible === undefined)) {
                        vm.gridOptions.columnDefs[i].visible = false;
                        hide = false;
                        continue;
                    }

                    if (!hide && vm.gridOptions.columnDefs[i].visible === false) {
                        vm.gridOptions.columnDefs[i].visible = true;
                        break;
                    }
                }
            }

            vm.gridApi.core.refresh();
        }

        vm.handleCallback = function (chartObj) {
            vm.chart = chartObj;
        };

        vm.dataClicked = function (data) {
            vm.gridOptions.data = vm.tasks.filter(function (item) { return item[vm.tile.group] == data.name; });
            vm.expand();
        };

        vm.edit = function () {
            if (angular.isFunction(vm.editTile)) {
                vm.editTile({ index: vm.index });
            }
        };

        vm.remove = function () {
            if (angular.isFunction(vm.removeTile)) {
                vm.removeTile({ index: vm.index });
            }
        };

        vm.columns;
        vm.points;

        vm.getState = function (task) {
            return 'tasks.taskdetails.' + task.TaskType.toLowerCase();
        };

        vm.getDateProperties = function () {
            return (function () {
                var dateProperties = [];

                angular.forEach(vm.tasks, function (task) {
                    for (var key in task) {
                        if (angular.isDate(task[key])) {
                            dateProperties.push()
                        }
                    }
                });
            })
        };

        vm.formatLabel = function (value, ratio, id) {
            return value;
        };

        activate();

        function activate() {
            vm.loading = true;

            var filter = {
                EndDateInLastDays: 7,
                Take: 200
            };

            if (vm.query === 'assignedToMe') {
                filter.UserAlias = adalAuthenticationService.userInfo.userName;
                loadTasks(filter);
            } else if (vm.query === 'atMyLocation') {
                geolocation.getCurrentPosition()
                    .then(function (result) {
                        return getClosestDatacenters(result.latitude, result.longitude);
                    })
                    .then(function (result) {
                        filter.Datacenter = result.map(function (item) { return item.DatacenterCode; });

                        return loadTasks(filter);
                    });
            } else if (vm.query === 'atDatacenters') {
                filter.Datacenter = vm.datacenters;
                loadTasks(filter);
            }

            // Set up grid columns
            if (angular.isArray(vm.tile.tableColumns)) {
                vm.gridOptions.columnDefs = [
                    {
                        headerName: '',
                        width: 100,
                        suppressSizeToFit: true,
                        suppressResize: true,
                        suppressFilter: true,
                        suppressSorting: true,
                        suppressSort: true,
                        template: '<div style="display: inline-block;"><button class="btn btn-default btn-xs" ng-click="tileCtrl.previewTask(data)"><span class="glyphicon glyphicon-eye-open"></span></button><button class="btn btn-default btn-xs" ng-click="tileCtrl.pinTask(data)"><span class="glyphicon glyphicon-pushpin"></span></button></div>',
                        checkboxSelection: true
                    }
                ];

                angular.forEach(vm.tile.tableColumns, function (column) {
                    var type = taskModelFactory.getPropertyType(column);
                    var values = taskModelFactory.getPropertyValues(column);

                    //var columnDef = {
                    //    field: column,
                    //    visible: true,
                    //    cellClass: function (grid, row) {
                    //        return row && row.entity.new ? 'new-task' : '';
                    //    }
                    //};

                    var columnDef = {
                        headerName: column,
                        field: column,
                        //visible: true
                    };

                    //if (column === 'Id') {
                    //    columnDef.cellTemplate = '<div class="ui-grid-cell-contents"><a ui-state="grid.appScope.getState(row.entity)" ui-state-params="{ id: row.entity.Id, source: row.entity.Source }">{{COL_FIELD}}</a></div>'
                    //}

                    if (type === 'date') {
                        columnDef.filter = DateFilter;
                        //columnDef.cellFilter = 'date';
                        //columnDef.filters = [
                        //    {
                        //        condition: uiGridConstants.filter.GREATER_THAN,
                        //        placeholder: 'greater than',
                        //        type: uiGridConstants.filter.DATE
                        //        //dateFormat: "MMMM dd, yyyy"
                        //    },
                        //    {
                        //        condition: uiGridConstants.filter.LESS_THAN,
                        //        placeholder: 'less than',
                        //        type: uiGridConstants.filter.DATE
                        //        //dateFormat: "MMMM dd, yyyy"
                        //    }
                        //];
                    }

                    if (angular.isArray(values)) {
                        //columnDef.filter = {
                        //    type: uiGridConstants.filter.SELECT,
                        //    selectOptions: values.map(function (value) { return { value: value, label: value }; })
                        //};
                        columnDef.filter = SetFilter;
                        columnDef.filterParams = { values: values, newRowsAction: 'keep' };
                    }

                    vm.gridOptions.columnDefs.push(columnDef);
                });
            }
        }

        function loadTasks(filter) {
            return taskHelper.loadPages(filter, null, false)
                .then(function (result) {
                    vm.tasks = filterTasks(result);
                    //vm.gridOptions.data = vm.tasks;
                    vm.gridOptions.rowData = vm.tasks;

                    if (vm.tile.type === 'aggregation') {
                        createAggregation();
                    } else if (vm.tile.type === 'chart') {
                        createChart();
                    } else if (vm.tile.type === 'table') {
                        createTable();
                    } else if (vm.tile.type === 'calendar') {
                        createCalendar();
                    } else if (vm.tile.type === 'timer') {
                        createTimer();
                    }

                    if (!updatedTaskListener) {
                        updatedTaskListener = tasksFactory.on(tasksFactory.events.TASK_UPDATED, newOrUpdatedTask);
                    }

                    if (!newTaskListener) {
                        newTaskListener = tasksFactory.on(tasksFactory.events.TASK_CREATED, newOrUpdatedTask);
                    }
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function newOrUpdatedTask(task) {
            if (filterTasks([task]).length > 0) {
                var tasks = vm.tasks.filter(function (item) { return item.Id === task.Id; });

                $scope.$apply(function () {
                    task.new = true;

                    if (tasks.length === 1) {
                        var index = vm.tasks.indexOf(tasks[0]);

                        vm.tasks.splice(index, 1, task);
                    } else {
                        vm.tasks.push(task);
                    }

                    if (vm.tile.type === 'aggregation') {
                        createAggregation();
                    } else if (vm.tile.type === 'chart') {
                        createChart();
                    } else if (vm.tile.type === 'table') {
                        createTable();
                    } else if (vm.tile.type === 'calendar') {
                        createCalendar();
                    } else if (vm.tile.type === 'timer') {
                        createTimer();
                    }

                    vm.newTaskCount += 1;
                });
            }
        }

        function filterTasks(tasks) {
            var filteredTasks = [];

            if (vm.tile.filter.length === 0 || !vm.tile.filter[0].field) {
                filteredTasks = tasks;
            } else {
                angular.forEach(tasks, function (task) {
                    var expression = [];

                    angular.forEach(vm.tile.filter, function (filter) {
                        expression.push({
                            operator: (vm.tile.filter[0] !== filter) ? filter.logicalOperator : null,
                            operand: filterTask(task, filter)
                        });
                    });

                    for (var i = 0; i < expression.length; i++) {
                        if (expression[i].operator === 'and') {
                            expression.splice(i - 1, 2, {
                                operator: expression[i - 1].operator,
                                operand: expression[i - 1].operand && expression[i].operand
                            });

                            i -= 1;
                        }
                    }

                    for (var i = 0; i < expression.length; i++) {
                        if (expression[i].operator === 'or') {
                            expression.splice(i - 1, 2, {
                                operator: expression[i - 1].operator,
                                operand: expression[i - 1].operand || expression[i].operand
                            });

                            i -= 1;
                        }
                    }

                    if (expression.length === 1 && expression[0].operand) {
                        filteredTasks.push(task);
                    }
                });
            }

            return filteredTasks;
        }

        function filterTask(task, filter) {
            if (!task || !filter) {
                return false;
            }

            var field = task[filter.field];

            if (angular.isUndefined(field)) {
                return false;
            }

            switch (filter.operator) {
                case '=':
                    return field === filter.value;
                case '<>':
                    return field !== filter.value;
                case '>':
                    return field > filter.value;
                case '>=':
                    return field >= filter.value;
                case '<':
                    return field < filter.value;
                case '<=':
                    return field <= filter.value;
                case 'contains':
                    return field.indexOf(filter.value) !== -1;
                case 'starts with':
                    return field.indexOf(filter.value) === 0;
                case 'next':
                    return moment(field) > moment().startOf('day') &&
                        moment(field) <= moment().endOf('day').add(filter.value, 'days');
                case 'last':
                    return moment(field) < moment().startOf('day') &&
                        moment(field) >= moment().startOf('day').subtract(filter.value, 'days');
                default:
                    return false;
            }
        }

        function createAggregation() {
            var aggregation;

            switch (vm.tile.displayType) {
                case 'count':
                    aggregation = vm.tasks.length;
                    break;
                case 'max':
                    aggregation = Math.max(vm.tasks.map(function (item) { return item[vm.tile.group]; }));
                    break;
                case 'min':
                    aggregation = Math.min(vm.tasks.map(function (item) { return item[vm.tile.group]; }));
                    break;
                case 'sum':
                    aggregation = 0;
                    angular.forEach(vm.tasks, function (task) {
                        aggregation += task[vm.tile.group];
                    });
                    break;
                case 'mean':
                    aggregation = 0;
                    angular.forEach(vm.tasks, function (task) {
                        aggregation += task[vm.tile.group];
                    });

                    aggregation = vm.tasks.length > 0 ? aggregation / vm.tasks.length : 'N/A';
                    break;
            }

            vm.aggregation = aggregation;
        }

        function createChart() {
            var points = [];
            var columns = [];

            if (vm.tile.displayType === 'line') {
                vm.datax = { id: 'x' };

                var today = moment();

                for (var i = 0; i < 7; i++) {
                    var day = today.clone().subtract(i, 'day');

                    var point = {};
                    point.x = day.format('YYYY-MM-DD');

                    angular.forEach(vm.tasks, function (task) {
                        if (task[vm.tile.group] == null) {
                            task[vm.tile.group] = 'None';
                        }

                        if (moment(task[vm.tile.groupAlt]).format('YYYY-MM-DD') === point.x) {
                            if (point[task[vm.tile.group]]) {
                                point[task[vm.tile.group]] += 1;
                            } else {
                                point[task[vm.tile.group]] = 1;
                            }
                        }
                    });

                    points.push(point);
                }

                for (var i = 0; i < points.length; i++) {
                    for (var key in points[i]) {
                        if (key !== 'x' && columns.filter(function (item) { return item.id === key; }).length === 0) {
                            columns.push({
                                id: key,
                                type: vm.tile.displayType
                            });
                        }
                    }
                }

                for (var i = 0; i < columns.length; i++) {
                    for (var j = 0; j < points.length; j++) {
                        if (!points[j][columns[i].id]) {
                            points[j][columns[i].id] = 0;
                        }
                    }
                }
            } else {
                points.push({});

                angular.forEach(vm.tasks, function (task) {
                    // If null or undefined mark as 'None'
                    if (task[vm.tile.group] == null) {
                        task[vm.tile.group] = 'None';
                    }

                    if (points[0][task[vm.tile.group]]) {
                        points[0][task[vm.tile.group]] += 1;
                    } else {
                        points[0][task[vm.tile.group]] = 1;
                    }
                });

                var keys = Object.keys(points[0]);

                // Gather everything after the 6 largest into 'Other'
                if (keys.length > 6) {
                    keys.sort(function (a, b) {
                        return points[0][b] - points[0][a];
                    });

                    var sum = 0;

                    for (var i = 5; i < keys.length; i++) {
                        sum += points[0][keys[i]];

                        delete points[0][keys[i]];
                    }

                    points[0]['Other'] = sum;
                }

                for (var key in points[0]) {
                    columns.push({
                        id: key,
                        type: vm.tile.displayType
                    });
                }
            }

            vm.columns = columns;
            vm.points = points;
        }

        function createTable() {
            vm.tableColumnHeaders = vm.tasks.map(function (item) {
                return item[vm.tile.group];
            }).filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });

            vm.tableColumnHeaders.sort();

            vm.tableRowHeaders = vm.tasks.map(function (item) {
                return item[vm.tile.groupAlt];
            }).filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });

            vm.tableRowHeaders.sort();

            var table = [];

            for (var i = 0; i < vm.tableRowHeaders.length; i++) {
                table[i] = [];

                for (var j = 0; j <= vm.tableColumnHeaders.length; j++) {
                    table[i][j] = 0;
                }
            }

            angular.forEach(vm.tasks, function (task) {
                var row = vm.tableRowHeaders.indexOf(task[vm.tile.groupAlt]);
                var column = vm.tableColumnHeaders.indexOf(task[vm.tile.group]);

                if (row !== -1 && column !== -1) {
                    table[row][column + 1] += 1;
                }
            });

            vm.table = table;
        }

        function createCalendar() {
            vm.eventSources = [];
            var events = [];

            angular.forEach(vm.tasks, function (task) {
                if (vm.tile.group || vm.tile.groupAlt) {
                    if (task[vm.tile.group] || task[vm.tile.groupAlt]) {
                        events.push({
                            title: task.Id,
                            start: moment(task[vm.tile.group]).format('YYYY-MM-DD hh:mm'),
                            end: moment(task[vm.tile.groupAlt]).format('YYYY-MM-DD hh:mm')
                        });
                    }
                }
            });

            vm.eventSources.push(events);
        }

        function createTimer() {
            vm.tasks.sort(function (a, b) {
                return a[vm.tile.group] - b[vm.tile.group];
            });
            
            if (vm.tasks.length > 0) {
                var date = moment(vm.tasks[0][vm.tile.group]);

                if (timer) {
                    $interval.cancel(timer);
                    timer = undefined;
                }

                timer = $interval(function () {
                    var now = moment();
                    var duration = moment.duration(date - now);

                    vm.timeRemaining = duration.days() + 'd:' +
                        Math.abs(duration.hours()) + 'h:' +
                        Math.abs(duration.minutes()) + 'm:' +
                        Math.abs(duration.seconds()) + 's';

                    $(window).trigger('resize');
                }, 1000);
            }
        }

        function getClosestDatacenters(latitude, longitude) {
            return domainDataFactory.getPhysicalDatacenters()
                .then(function (result) {
                    var closestDatacenter = null;
                    var closestDistance = Number.MAX_VALUE;

                    var datacenters = [];
                    
                    // Find closest data center
                    angular.forEach(result, function (datacenter) {
                        if (!closestDatacenter) {
                            closestDatacenter = datacenter;
                            return;
                        }

                        var dist = Math.sqrt(Math.pow(latitude - datacenter.Latitude, 2) + Math.pow(longitude - datacenter.Longitude, 2));
                        if (dist < closestDistance) {
                            closestDistance = dist;
                            closestDatacenter = datacenter;
                        }
                    });

                    // Get datacenters within 1 degree
                    angular.forEach(result, function (datacenter) {
                        if (!closestDatacenter) {
                            closestDatacenter = datacenter;
                            return;
                        }

                        var dist = Math.sqrt(Math.pow(latitude - datacenter.Latitude, 2) + Math.pow(longitude - datacenter.Longitude, 2));
                        if (dist < 1) {
                            datacenters.push(datacenter);
                        }
                    });

                    datacenters.push(closestDatacenter);

                    return datacenters;
                });
        }

        $scope.$on('$destroy', function () {
            if (angular.isFunction(tileSizeListener)) {
                tileSizeListener();
            }

            if (angular.isFunction(updatedTaskListener)) {
                updatedTaskListener();
            }

            if (angular.isFunction(newTaskListener)) {
                newTaskListener();
            }

            if (angular.isFunction(exandedListener)) {
                exandedListener();
            }

            if (angular.isFunction(tileListener)) {
                tileListener();
            }

            if (timer) {
                $interval.cancel(timer);
            }
        });
    }

    function SetFilter() {
    }

    SetFilter.prototype.init = function (params) {
        this.valueGetter = params.valueGetter;
        this.$scope = params.$scope;
        this.$scope.values = params.values || [];
        this.setupGui(params);
    };

    // not called by ag-Grid, just for us to help setup
    SetFilter.prototype.setupGui = function (params) {
        this.gui = document.createElement('div');
        this.gui.innerHTML =
            '<div style="padding: 4px; width: 200px;">' +
            '<select class="form-control" size="10" ng-options="value for value in values" ng-model="selectedValues" multiple></select>' +
            '</div>';

        var self = this;

        this.$scope.$watch(function () {
            return self.$scope.selectedValues;
        }, function () {
            params.filterChangedCallback();
        }, true);
    };

    SetFilter.prototype.getGui = function () {
        return this.gui;
    };

    SetFilter.prototype.doesFilterPass = function (params) {
        var value = this.valueGetter(params);

        return angular.isArray(this.$scope.selectedValues) && this.$scope.selectedValues.indexOf(value) !== -1;
    };

    SetFilter.prototype.isFilterActive = function () {
        return angular.isArray(this.$scope.selectedValues) && this.$scope.selectedValues.length > 0;
    };

    SetFilter.prototype.getModel = function () {
        var model = { value: this.$scope.selectedValues.value };
        return model;
    };

    SetFilter.prototype.setModel = function (model) {
        this.$scope.selectedValues.value = model.value;
    };

    function DateFilter() {
    }

    DateFilter.prototype.init = function (params) {
        this.valueGetter = params.valueGetter;
        this.$scope = params.$scope;
        this.setupGui(params);
    };

    // not called by ag-Grid, just for us to help setup
    DateFilter.prototype.setupGui = function (params) {
        this.gui = document.createElement('div');
        this.gui.innerHTML =
            '<div style="padding: 4px; width: 200px;">' +
            '<p class="input-group" ng-init="opened = false; date = null">' +
            '<input type="text" placeholder="greater than" class="form-control" uib-datepicker-popup ng-model="filterStartDate" datepicker-append-to-body="true" is-open="opened" close-text="Close" />' +
            '<span class="input-group-btn">' +
            '<button type="button" class="btn btn-default" ng-click="opened = true"><i class="glyphicon glyphicon-calendar"></i></button>' +
            '</span>' +
            '</p>' +
            '<p class="input-group" ng-init="opened2 = false; date2 = null">' +
            '<input type="text" placeholder="less than" class="form-control" uib-datepicker-popup ng-model="filterEndDate" datepicker-append-to-body="true" is-open="opened2" close-text="Close" />' +
            '<span class="input-group-btn">' +
            '<button type="button" class="btn btn-default" ng-click="opened2 = true"><i class="glyphicon glyphicon-calendar"></i></button>' +
            '</span>' +
            '</p>' +
            '</div>';

        var self = this;

        this.$scope.$watch(function () {
            return { startDate: self.$scope.filterStartDate, endDate: self.$scope.filterEndDate };
        }, function () {
            params.filterChangedCallback();
        }, true);
    };

    DateFilter.prototype.getGui = function () {
        return this.gui;
    };

    DateFilter.prototype.doesFilterPass = function (params) {
        var value = this.valueGetter(params);

        if (this.$scope.filterStartDate) {
            if (this.$scope.filterStartDate > value) {
                return false;
            }
        }

        if (this.$scope.filterEndDate) {
            if (this.$scope.filterEndDate < value) {
                return false;
            }
        }

        return true;
    };

    DateFilter.prototype.isFilterActive = function () {
        return this.$scope.filterStartDate || this.$scope.filterEndDate;
    };

    DateFilter.prototype.getModel = function () {
        var model = { value: this.$scope.filterStartDate.value };
        return model;
    };

    DateFilter.prototype.setModel = function (model) {
        this.$scope.filterStartDate.value = model.value;
    };
})();