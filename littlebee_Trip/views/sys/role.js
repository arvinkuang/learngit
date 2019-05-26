//var apiUrl = 'http://localhost:59950/Api/ApiHandler.ashx?userid=' + sessionStorage.getItem('userid') + '&token=' + sessionStorage.getItem('token') + '&page=' + routerPage;

var apiUrl = apiPathRoot + '?userid=' + sessionStorage.getItem('userid') + '&token=' + sessionStorage.getItem('token') + '&page=' + routerPage;

$(function () {

    var IndexPager = {
        _grid: $('#grid') || null,
        _gridData: null,
        _dialog: $('#dialogRole') || null,
        _dialogData: null,
        _griddialog: $('#griddialog') || null,
        _griddialogData: null,
        _gridColumns: [
            {
                title: '操作', width: '350px',
                command: [
                    {
                        name: 'detail', text: '角色权限详情',
                        iconClass: 'k-icon k-i-txt',
                        click: function (e) {
                            e.preventDefault();
                            var data = this.dataItem($(e.target).closest('tr'));

                            ViewModel.Role_Rid = data.id;
                            IndexPager.getDialogDataSource.read();
                            IndexPager._dialogData.open();
                        }
                    },
                    {
                        name: 'edit2',
                        text: '编辑',
                        iconClass: 'k-icon k-i-edit',
                        click: function (e) {
                            e.preventDefault();
                            noticeMsg('未开发', 'error', 'center', 800, function () {});
                        }
                    },
                    {
                        name: 'destroy2',
                        iconClass: 'k-icon k-i-x',
                        text: '删除',
                        click: function (e) {
                            e.preventDefault();
                            noticeMsg('未开发', 'error', 'center', 800, function () { });
                        }
                    }
                ]
            },
            {
                field: "RID",
                hidden: true,
                title: "RID"
            },
            {
                field: "RoleName",
                title: "角色名称"
            },
            {
                field: "PowerValue",
                title: "角色权重"
            }
        ],
        _gridDialogColumns: [
            {
                field: "RID",
                hidden: true,
                title: "RID"
            },
            {
                field: "RoleName",
                title: "角色名称"
            },
            {
                field: "MenuName",
                title: "菜单名称"
            },
            {
                field: "MenuTypeName",
                title: "菜单类型"
            }
        ],        
        // 搜索
        search: function () {
            IndexPager.getDataSource.read();
        },
        init: function () {
            this.initKendoControls();            
        },
        // 获取数据源
        getDataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: apiUrl + "&action=GetRoleName",
                    dataType: "json",
                    cache: false,
                    type: "POST"
                },
                parameterMap: function (options, operation) {
                    
                }
            },
            requestEnd: function (e) {
            },
            batch: true,
            schema: {
                model: {
                    id: "RID",
                    fields: {
                        RID: { editable: false, type: "string" }
                    }
                },
                data: function (response) {
                    return response.data;
                },
                total: function (response) {
                    return response.data == null ? 0 : response.data.length;
                }
            },
            pageSize: 20
        }),
        // 获取数据源
        getDialogDataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: apiUrl + "&action=GetRoleList",
                    dataType: "json",
                    cache: false,
                    type: "POST"
                },
                parameterMap: function (options, operation) {
                    if (operation == "read") {
                        return { Role_Rid: ViewModel.Role_Rid }
                    }
                }
            },
            requestEnd: function (e) {
            },
            batch: true,
            schema: {
                model: {
                    id: "RID",
                    fields: {
                        RID: { editable: false, type: "string" }
                    }
                },
                data: function (response) {
                    return response.data;
                },
                total: function (response) {
                    return response.data == null ? 0 : response.data.length;
                }
            },
            pageSize: 20
        }),
        // 初始化Kendo控件
        initKendoControls: function () {

            this._gridData = this._grid.kendoGrid({
                selectable: "row",
                noRecords: {
                    template: '<div class="text-center p-4">无相关数据</div>'
                },
                persistSelection: true,
                reorderable: true,
                allowCopy: true,
                navigatable: true,
                columns: this._gridColumns,
                dataSource: this.getDataSource,                
                filterable: true,
                sortable: true,
                resizable: true,
                pageable: {
                    pageSizes: [10, 15, 20,50,100, "all"],
                    buttonCount: 5
                },
                toolbar: [
                    {
                        template: '<button class="k-button k-primary" style="width:120px;" onclick="alert(\"未开放\")">新增</button>'
                    }
                ],
                excel: {
                    fileName: "用户列表导出" + kendo.toString(new Date(), "yyyy-MM-dd"),
                    filterable: true
                },
                dataBound: function () {
                },
            }).data('kendoGrid');

            this._griddialogData = this._griddialog.kendoGrid({
                selectable: "row",
                noRecords: {
                    template: '<div class="text-center p-4">无相关数据</div>'
                },
                persistSelection: true,
                reorderable: true,
                allowCopy: true,
                navigatable: true,
                columns: this._gridDialogColumns,
                dataSource: this.getDialogDataSource,
                filterable: true,
                sortable: true,
                resizable: true,
                pageable: {
                    pageSizes: [10, 15, 20, 50, 100, "all"],
                    buttonCount: 5
                },
                dataBound: function () {
                },
            }).data('kendoGrid');

            this._dialogData = this._dialog.kendoDialog({
                width: "550px",
                title: "权限权限列表",
                closable: true,
                modal: false,
                visible: false,
                open: function (e) { }
            }).data('kendoDialog');
        },
        
    },

    ViewModel = kendo.observable({
        conditionModel: {},
        data: {},
        Role_Rid:"",
    });

    // 初始化页面
    IndexPager.init();
});

function doExplore(e) {
    $("#grid").data("kendoGrid").saveAsExcel();
    return false;
}