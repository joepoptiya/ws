(function () {
    'use strict';

    angular
        .module('workspace')
        .factory('presetWorkspaces', presetWorkspaces);

    function presetWorkspaces() {
        var assignedToMePreset = {
            id: '2b9c304b-17ec-488c-afbe-2b24b1ccaa54',
            name: 'assignedToMe',
            displayName: 'Assigned to Me',
            query: 'assignedToMe',
            createBy: 'mattric@microsoft.com',
            createdDate: '2016-11-04',
            sharedWith: [],
            tiles: [
                {
                    title: 'Total',
                    appearance: 'default',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [],
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
                },
                {
                    title: 'Active',
                    appearance: 'info',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 1,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            logicalOperator: '',
                            field: 'Status',
                            operator: '=',
                            value: 'Active'
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
                },
                {
                    title: 'In Progress',
                    appearance: 'primary',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            logicalOperator: '',
                            field: 'Status',
                            operator: '=',
                            value: 'In Progress'
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
                },
                {
                    title: 'Blocked',
                    appearance: 'danger',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            logicalOperator: '',
                            field: 'Status',
                            operator: '=',
                            value: 'Blocked'
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
                },
                {
                    title: 'Paused',
                    appearance: 'warning',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 4,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            logicalOperator: '',
                            field: 'Status',
                            operator: '=',
                            value: 'Paused'
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
                },
                {
                    title: 'Completed',
                    appearance: 'success',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 5,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            logicalOperator: '',
                            field: 'Status',
                            operator: '=',
                            value: 'Done'
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
                },
                {
                    title: 'Severity vs Status Count',
                    appearance: 'default',
                    type: 'table',
                    displayType: 'association',
                    group: 'Severity',
                    groupAlt: 'Status',
                    sizeX: 2,
                    sizeY: 1,
                    row: 0,
                    col: 6,
                    originalSizeX: 2,
                    originalSizeY: 1,
                    filter: [],
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
                },
                {
                    title: 'Task Type',
                    appearance: 'default',
                    type: 'chart',
                    displayType: 'bar',
                    sizeX: 2,
                    sizeY: 2,
                    row: 2,
                    col: 0,
                    originalSizeX: 2,
                    originalSizeY: 2,
                    group: 'TaskType',
                    filter: [],
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
                },
                {
                    title: 'Severity',
                    appearance: 'default',
                    type: 'chart',
                    displayType: 'pie',
                    sizeX: 2,
                    sizeY: 2,
                    row: 2,
                    col: 2,
                    originalSizeX: 2,
                    originalSizeY: 2,
                    group: 'Severity',
                    filter: [],
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
                },
                {
                    title: 'Group',
                    appearance: 'default',
                    type: 'chart',
                    displayType: 'bar',
                    sizeX: 2,
                    sizeY: 2,
                    row: 2,
                    col: 4,
                    originalSizeX: 2,
                    originalSizeY: 2,
                    group: 'Group',
                    filter: [],
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
                },
                {
                    title: 'Status of Tasks Due',
                    appearance: 'default',
                    type: 'chart',
                    displayType: 'line',
                    group: 'Status',
                    groupAlt: 'DueDate',
                    overTime: true,
                    sizeX: 2,
                    sizeY: 2,
                    row: 2,
                    col: 6,
                    originalSizeX: 2,
                    originalSizeY: 2,
                    filter: [],
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
                }
            ]
        };

        var siteServicesPreset = {
            name: 'siteServices',
            displayName: 'Site Services',
            query: 'atMyLocation',
            tiles: [
                {
                    title: 'BreakFix Total',
                    appearance: 'default',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 0,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'BreakFix'
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
                },
                {
                    title: 'BreakFix Active',
                    appearance: 'info',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 1,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'BreakFix'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Active'
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
                },
                {
                    title: 'BreakFix In Progress',
                    appearance: 'primary',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 2,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'BreakFix'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'InProgress'
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
                },
                {
                    title: 'BreakFix Blocked',
                    appearance: 'danger',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 3,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'BreakFix'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Blocked'
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
                },
                {
                    title: 'BreakFix Paused',
                    appearance: 'warning',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 4,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'BreakFix'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Paused'
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
                },
                {
                    title: 'BreakFix Completed',
                    appearance: 'success',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 0,
                    col: 5,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'BreakFix'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Done'
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
                },
                {
                    title: 'Simple Change Total',
                    appearance: 'default',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 0,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SimpleChange'
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
                },
                {
                    title: 'Simple Change Active',
                    appearance: 'info',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 1,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SimpleChange'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Active'
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
                },
                {
                    title: 'Simple Change In Progress',
                    appearance: 'primary',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 2,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SimpleChange'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'InProgress'
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
                },
                {
                    title: 'Simple Change Blocked',
                    appearance: 'danger',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 3,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SimpleChange'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Blocked'
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
                },
                {
                    title: 'Simple Change Paused',
                    appearance: 'warning',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 4,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SimpleChange'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Paused'
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
                },
                {
                    title: 'Simple Change Completed',
                    appearance: 'success',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 5,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SimpleChange'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Done'
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
                },
                {
                    title: 'SOP Total',
                    appearance: 'default',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 2,
                    col: 0,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SOP'
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
                },
                {
                    title: 'SOP Active',
                    appearance: 'info',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 2,
                    col: 1,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SOP'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Active'
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
                },
                {
                    title: 'SOP In Progress',
                    appearance: 'primary',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 2,
                    col: 2,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SOP'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'InProgress'
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
                },
                {
                    title: 'SOP Blocked',
                    appearance: 'danger',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 2,
                    col: 3,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SOP'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Blocked'
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
                },
                {
                    title: 'SOP Paused',
                    appearance: 'warning',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 2,
                    col: 4,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SOP'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Paused'
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
                },
                {
                    title: 'SOP Completed',
                    appearance: 'success',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 2,
                    col: 5,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'SOP'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Done'
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
                },
                {
                    title: 'OMC Total',
                    appearance: 'default',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 3,
                    col: 0,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'OMC'
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
                },
                {
                    title: 'OMC Active',
                    appearance: 'info',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 3,
                    col: 1,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'OMC'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Active'
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
                },
                {
                    title: 'OMC In Progress',
                    appearance: 'primary',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 3,
                    col: 2,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'OMC'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'InProgress'
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
                },
                {
                    title: 'OMC Blocked',
                    appearance: 'danger',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 3,
                    col: 3,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'OMC'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Blocked'
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
                },
                {
                    title: 'OMC Paused',
                    appearance: 'warning',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 3,
                    col: 4,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'OMC'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Paused'
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
                },
                {
                    title: 'OMC Completed',
                    appearance: 'success',
                    type: 'aggregation',
                    displayType: 'count',
                    sizeX: 1,
                    sizeY: 1,
                    row: 3,
                    col: 5,
                    originalSizeX: 1,
                    originalSizeY: 1,
                    filter: [
                        {
                            field: 'TaskType',
                            operator: '=',
                            value: 'OMC'
                        },
                        {
                            logicalOperator: 'and',
                            field: 'Status',
                            operator: '=',
                            value: 'Done'
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
                },
                {
                    title: 'Status',
                    appearance: 'default',
                    type: 'chart',
                    displayType: 'pie',
                    sizeX: 2,
                    sizeY: 2,
                    row: 4,
                    col: 0,
                    originalSizeX: 2,
                    originalSizeY: 2,
                    group: 'Status',
                    filter: [],
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
                },
                {
                    title: 'Assigned To',
                    appearance: 'default',
                    type: 'chart',
                    displayType: 'pie',
                    sizeX: 2,
                    sizeY: 2,
                    row: 4,
                    col: 2,
                    originalSizeX: 2,
                    originalSizeY: 2,
                    group: 'AssignedTo',
                    filter: [],
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
                },
                {
                    title: 'Task Type',
                    appearance: 'default',
                    type: 'chart',
                    displayType: 'bar',
                    sizeX: 2,
                    sizeY: 2,
                    row: 4,
                    col: 4,
                    originalSizeX: 2,
                    originalSizeY: 2,
                    group: 'TaskType',
                    filter: [],
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
                }
            ]
        };

        var presets = [
            assignedToMePreset,
            siteServicesPreset
        ];

        var service = {
            presets: presets,
            getPreset: getPreset
        };

        return service;

        function getPreset(name) {
            switch (name) {
                case 'Assigned to Me':
                    return assignedToMePreset;
                case 'Site Services':
                    return siteServicesPreset;
                default:
                    return null;
            }
        }
    }
})();