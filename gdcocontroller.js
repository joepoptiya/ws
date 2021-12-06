//-----------------------------------------------------------------------
// <copyright file="gdcocontroller.js" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

(function () {
    'use strict';

    angular
        .module('gdco')
        .controller('GdcoController', GdcoController);

    GdcoController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$uibModal',
        'adalAuthenticationService',
        'notificationsFactory',
        'toastr',
        'sidebarMenu',
        'utils'
    ];

    /**
     * Parent controller for the entire GDCO App.
     */
    function GdcoController($rootScope, $scope, $state, $uibModal, adalProvider, notificationsFactory, toastr, sidebarMenu, utils) {
        var stateChangeStartListener;

        var vm = this;
        vm.notificaions = [];
        vm.notificationTypes = notificationsFactory.notificationTypes;
        vm.userInfo = adalProvider.userInfo;
        vm.sidebarMenuItems = sidebarMenu.getMenuItems();

        /**
         * Sets the given menu item to the selected state and deselects all other menu items.
         * @param {object} menuItem The menu item to select.
         */
        vm.selectSidebarMenuItem = function (menuItem) {
            if (!angular.isObject(menuItem)) {
                return;
            }

            angular.forEach(vm.sidebarMenuItems, function (item) {
                item.isSelected = false;
            });

            menuItem.isSelected = true;
        }

        /**
         * Removes all notifications.
         */
        vm.clearNotifications = function () {
            notificationsFactory.clearNotifications();
            vm.notifications = notificationsFactory.getNotifications();
        };

        /**
         * Returns the appropriate notification class to use based on the given notification' type.
         * @param {object} notification The notification to get the class for.
         */
        vm.getNotificationClass = function (notification) {
            if (!notification) {
                return 'notification';
            }

            switch (notification.type) {
                case notificationsFactory.notificationTypes.SUCCESS:
                    return 'notification-success';
                case notificationsFactory.notificationTypes.WARNING:
                    return 'notification-warning';
                case notificationsFactory.notificationTypes.ERROR:
                    return 'notification-error';
                case notificationsFactory.notificationTypes.INFO:
                    return 'notification-info';
                default:
                    return 'notification';
            }
        };

        /**
         * Removes the notification at the given index.
         * @param {object} notification The notification to remove.
         */
        vm.removeNotification = function (notification) {
            if (!notification) {
                return;
            }

            var index = vm.notifications.indexOf(notification);
            notificationsFactory.removeNotification(index);

            vm.notifications = notificationsFactory.getNotifications();
        };

        /**
         * Opens the given notification in a modal to show the details.
         * @param {object} notification The notification to show.
         */
        vm.openNotificationsModal = function (notification) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'App/common/src/notificationsModal/notificationsModal.html',
                controller: 'NotificationsModalController',
                controllerAs: 'notificationsModalCtrl',
                resolve: {
                    notification: function () {
                        return notification;
                    }
                }
            });
        };

        /**
         * Callback for when a notification is added to the notificationsFactory. 
         * Displays the notification using toastr.
         * @param {object} notification The notification added.
         */
        function displayNotification(notification) {
            if (!notification) {
                return;
            }

            var toast = angular.noop();
            
            switch (notification.type) {
                case notificationsFactory.notificationTypes.SUCCESS:
                    toast = toastr.success;;
                    break;
                case notificationsFactory.notificationTypes.WARNING:
                    toast = toastr.warning;
                    break;
                case notificationsFactory.notificationTypes.ERROR:
                    toast = toastr.error;
                    break;
                case notificationsFactory.notificationTypes.INFO:
                default:
                    toast = toastr.info;
                    break;
            }

            toast(notification.message, notification.title, {
                onTap: function (toast) {
                    vm.openNotificationsModal(toast.scope.extraData);
                },
                extraData: notification
            });

            vm.notifications = notificationsFactory.getNotifications();
        }

        activate();

        /**
         * Activates the controller.
         */
        function activate() {
            notificationsFactory.registerCallback(displayNotification);

            // Set the first menu item as the default selected item (should be home)
            if (angular.isArray(vm.sidebarMenuItems) && vm.sidebarMenuItems.length > 0) {
                vm.sidebarMenuItems[0].isSelected = true;
            }

            angular.forEach(vm.sidebarMenuItems, function (menuItem) {
                menuItem.isSelected = utils.isStartedWith($state.current.name, menuItem.statePrefix);
            });

            // Listen for state changes and update the selected sidebar menu item
            stateChangeStartListener = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                angular.forEach(vm.sidebarMenuItems, function (menuItem) {
                    menuItem.isSelected = utils.isStartedWith(toState.name, menuItem.statePrefix);
                });
            });
        }

        $scope.$on('$destroy', function () {
            stateChangeStartListener();
            notificationsFactory.unregisterCallback(displayNotification);
        });
    }
})();