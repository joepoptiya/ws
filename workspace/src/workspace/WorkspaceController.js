(function () {
    'use strict';

    angular
        .module('workspace')
        .controller('WorkspaceController', WorkspaceController);

    WorkspaceController.$inject = [
        '$scope',
        '$interval',
        '$uibModal',
        'adalAuthenticationService',
        'notificationsFactory',
        'utils',
        'workspacesFactory'
    ];

    function WorkspaceController($scope, $interval, $uibModal, adalAuthenticationService, notificationsFactory, utils, workspacesFactory) {
        var tileIncreaseCount = 20;
        var maxColumns = 8;

        var vm = this;
        vm.workspaces = [];
        vm.currentIndex = -1;
        vm.tileLimit = 8;

        vm.removeWorkspace = function (index) {
            vm.workspaces.splice(index, 1);

            if (index <= vm.currentIndex) {
                if (vm.workspaces.length !== 0) {
                    vm.setCurrentWorkspace(index - 1);
                }
            }

            if (vm.workspaces.length === 0) {
                vm.currentIndex = -1;
            }
        }

        vm.gridsterOpts = {
            columns: maxColumns,
            margins: [15, 15],
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: false
            }
        }

        $scope.$watch(function () {
            var elem = document.getElementById('grid');
            if (elem) {
                return elem.offsetWidth;
            }
        }, function (newValue) {
            if (angular.isDefined(newValue)) {
                if (newValue < 500) {
                    vm.gridsterOpts.columns = 2;
                } else if (newValue < 768) {
                    vm.gridsterOpts.columns = 3;
                } else if (newValue < 992) {
                    vm.gridsterOpts.columns = 4;
                } else if (newValue < 1200) {
                    vm.gridsterOpts.columns = 5;
                } else if (newValue < 1500) {
                    vm.gridsterOpts.columns = 6;
                } else {
                    vm.gridsterOpts.columns = maxColumns;
                }
            }
        });

        $scope.$watch(function () {
            return vm.gridsterOpts.columns;
        }, function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }

            if (vm.currentIndex < 0) {
                return;
            }

            vm.workspaces[vm.currentIndex].tiles = determineLayout(vm.workspaces[vm.currentIndex].tiles, vm.gridsterOpts.columns);
        });

        vm.setCurrentWorkspace = function (index) {
            vm.editWorkspace(false);

            if (index !== vm.currentIndex) {
                vm.currentIndex = index;
                loadTiles(tileIncreaseCount);
            }

        };

        vm.newWorkspace = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'App/workspace/src/newWorkspaceModal/newWorkspaceModal.html',
                controller: 'NewWorkspaceModalController',
                controllerAs: 'newWorkspaceModalCtrl'
            });

            modalInstance.result
                .then(function (workspace) {
                    vm.workspaces.push(workspace);
                    vm.currentIndex = vm.workspaces.length - 1;

                    vm.editWorkspace(true);
                });
        }

        vm.openWorkspace = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'App/workspace/src/openWorkspaceModal/openWorkspaceModal.html',
                controller: 'OpenWorkspaceModalController',
                controllerAs: 'openWorkspaceModalCtrl'
            });

            modalInstance.result
                .then(function (workspace) {
                    // Check if the workspace is already open
                    var items = vm.workspaces.filter(function (item) {
                        return item.name === workspace.name;
                    });

                    if (items && items.length > 0) {
                        vm.currentIndex = vm.workspaces.indexOf(items[0]);
                    } else {
                        workspace.tiles = determineLayout(workspace.tiles, vm.gridsterOpts.columns);
                        vm.workspaces.push(workspace);
                        vm.setCurrentWorkspace(vm.workspaces.length - 1);
                    }
                });
        };

        vm.editWorkspace = function (edit) {
            edit = edit === true;

            vm.backup = angular.copy(vm.workspaces[vm.currentIndex]);

            vm.editing = edit;
            vm.gridsterOpts.resizable.enabled = edit;
            vm.gridsterOpts.draggable.enabled = edit;
        };

        vm.saveWorkspace = function () {
            if (vm.currentIndex < 0) {
                return;
            }

            var workspace = angular.copy(vm.workspaces[vm.currentIndex]);

            workspace.tiles = determineLayout(workspace.tiles, 8);
            loadTiles(vm.tileLimit);

            workspacesFactory.saveWorkspace(workspace)
                .then(function (result) {
                    notificationsFactory.addNotification('Success', 'Successfully saved workspace.',
                        utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.SUCCESS);

                    vm.editWorkspace(false);
                })
                .catch(function (result) {
                    notificationsFactory.addNotification('Error', 'Failed to save workspace.',
                        utils.getServiceCallDetails(result), notificationsFactory.notificationTypes.ERROR);
                });
        };

        vm.increaseTileLimit = function () {
            loadTiles(vm.tileLimit + 8, true);
        };

        vm.cancel = function () {
            vm.workspaces[vm.currentIndex] = vm.backup;

            vm.editWorkspace(false);
        };

        vm.removeTile = function (index) {
            if (index < 0 || index >= vm.workspaces[vm.currentIndex].tiles.length) {
                return;
            }

            vm.workspaces[vm.currentIndex].tiles.splice(index, 1);
        }

        vm.editTile = function (index) {
            if (index < 0 || index >= vm.workspaces[vm.currentIndex].tiles.length) {
                return;
            }

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'App/workspace/src/newTileModal/newTileModal.html',
                size: 'lg',
                controller: 'NewTileModalController',
                controllerAs: 'newTileModalCtrl',
                resolve: {
                    tile: function () {
                        return vm.workspaces[vm.currentIndex].tiles[index];
                    }
                }
            });

            modalInstance.result.then(function (tile) {
                //vm.workspaces[vm.currentIndex].tiles.splice(index, 1, tile);
                vm.workspaces[vm.currentIndex].tiles[index] = tile;

                tile.originalSizeX = tile.sizeX;
                tile.originalSizeY = tile.sizeY;
            });
        };

        vm.newTile = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'App/workspace/src/newTileModal/newTileModal.html',
                size: 'lg',
                controller: 'NewTileModalController',
                controllerAs: 'newTileModalCtrl',
                resolve: {
                    tile: function () {
                        return null;
                    }
                }
            });

            vm.editing = false;

            modalInstance.result
                .then(function (tile) {
                    vm.workspaces[vm.currentIndex].tiles.push(tile);

                    tile.originalSizeX = tile.sizeX;
                    tile.originalSizeY = tile.sizeY;

                    vm.editing = true;
                })
                .catch(function () {
                    vm.editing = true;
                });
        };

        vm.expandTile = function (index, expand) {
            if (index < 0 || index >= vm.workspaces[vm.currentIndex].tiles.length) {
                return false;
            }

            vm.gridsterOpts.resizable.enabled = !vm.gridsterOpts.resizable.enabled;

            if (expand) {
                vm.workspaces[vm.currentIndex].tiles[index].originalCol = vm.workspaces[vm.currentIndex].tiles[index].col;
                vm.workspaces[vm.currentIndex].tiles[index].col = 0;
            } else {
                vm.workspaces[vm.currentIndex].tiles[index].col = vm.workspaces[vm.currentIndex].tiles[index].originalCol;
            }

            vm.workspaces[vm.currentIndex].tiles[index].sizeX = expand ? maxColumns : vm.workspaces[vm.currentIndex].tiles[index].originalSizeX;
            vm.workspaces[vm.currentIndex].tiles[index].sizeY = expand ? 4 : vm.workspaces[vm.currentIndex].tiles[index].originalSizeY;

            vm.gridsterOpts.resizable.enabled = !vm.gridsterOpts.resizable.enabled;

            return expand;
        };

        vm.shareWorkspace = function () {
            if (vm.currentIndex < 0) {
                return;
            }

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'App/workspace/src/shareWorkspaceModal/shareWorkspaceModal.html',
                controller: 'ShareWorkspaceModalController',
                controllerAs: 'shareWorkspaceModalCtrl',
                resolve: {
                    workspace: function () {
                        return vm.workspaces[vm.currentIndex];
                    }
                }
            });
        };

        vm.addTile = function (tile) {
            vm.workspaces[vm.currentIndex].tiles.push(tile);
        };

        vm.canEditWorkspace = function () {
            if (vm.currentIndex < 0 || vm.editing) {
                return false;
            }

            if (vm.workspaces[vm.currentIndex].createdBy === adalAuthenticationService.userInfo.userName) {
                return true;
            }

            var sharedWith = vm.workspaces[vm.currentIndex].sharedWith.filter(function (item) { return item.user === adalAuthenticationService.userInfo.userName; });

            return sharedWith.length === 1 && sharedWith[0].permissions !== 'View';
        };

        vm.canShareWorkspace = function () {
            if (vm.currentIndex < 0 || vm.editing) {
                return false;
            }

            if (vm.workspaces[vm.currentIndex].createdBy === adalAuthenticationService.userInfo.userName) {
                return true;
            }

            var sharedWith = vm.workspaces[vm.currentIndex].sharedWith.filter(function(item) { return item.user === adalAuthenticationService.userInfo.userName; });

            return sharedWith.length === 1 && sharedWith[0].permissions === 'Full';
        };

        function loadTiles(limit, dontReset) {
            dontReset = dontReset === true;

            if (vm.loadingTiles) {
                return;
            }

            vm.loadingTiles = true;

            if (!dontReset) {
                vm.tileLimit = 8;
            }

            var loadCount = Math.ceil(limit / 8);

            loadCount -= vm.tileLimit / 8;

            $interval(function () {
                vm.tileLimit += 8;
            }, 500, loadCount).finally(function () {
                vm.loadingTiles = false;
            });
        }

        function determineLayout(workspaceTiles, columns) {
            var grid = [];
            var currentRow = 0;
            var currentCol = 0;
            var i;
            var j;

            var tiles = angular.copy(workspaceTiles);
            //var tiles = workspaceTiles;

            tiles.sort(function (a, b) {
                return a.col - b.col;
            });

            tiles.sort(function (a, b) {
                return a.row - b.row;
            });

            angular.forEach(tiles, function (tile) {
                // If too wide, shrink
                if (tile.sizeX > columns) {
                    tile.sizeX = columns;
                }

                var fits = true;

                do {
                    // Any overlap?
                    for (i = currentCol; i < currentCol + tile.sizeX; i++) {
                        if (angular.isUndefined(grid[i])) {
                            grid[i] = [];
                        }

                        if (angular.isDefined(grid[i][currentRow]) || i >= columns) {
                            currentRow += 1;
                            currentCol = 0;
                            break;
                        }
                    }

                    fits = i === currentCol + tile.sizeX &&
                        currentCol + tile.sizeX <= columns;
                } while (!fits);

                tile.col = currentCol;
                tile.row = currentRow;

                // Reserve the spot for the tile
                for (i = currentCol; i < currentCol + tile.sizeX; i++) {
                    for (j = currentRow; j < currentRow + tile.sizeY; j++) {
                        grid[i][j] = true;
                    }
                }

                currentCol = i % columns;

                if (i === columns) {
                    currentRow += 1;
                }
            });

            return tiles;
        }
    }
})();