//var apiUrl = 'http://localhost:59950/Api/ApiHandler.ashx?userid=' + sessionStorage.getItem('userid') + '&token=' + sessionStorage.getItem('token') + '&page=' + routerPage;

var apiUrl = apiPathRoot + '?userid=' + sessionStorage.getItem('userid') + '&token=' + sessionStorage.getItem('token') + '&page=' + routerPage;

$(function () {

    var IndexPager = {
        _grid: $('#grid') || null,
        _gridData: null,
        _gridColumns: [
            {
                title: '操作', width: '170px',
                command: [
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
                        text: '禁用',
                        click: function (e) {
                            e.preventDefault();
                            noticeMsg('未开发', 'error', 'center', 800, function () { });
                        }
                    }
                ]
            },
            {
                field: "UserId",
                title: "登录名"
            },
            {
                field: "UserName",
                title: "姓名"
            },
            {
                field: "RoleName",
                title: "角色名称"
            },
            {
                field: "Avatar",
                title: "头像"
            },
            {
                field: "Phone1",
                title: "手机号"
            },
            {
                field: "Email1",
                title: "邮箱"
            },
            {
                field: "Sex_Name",
                title: "姓别"
            },
            {
                field: "Birthday",
                title: "出生年月"
            },
            {
                field: "Remark",
                title: "备注"
            },
            {
                field: "ModifyDate",
                title: "修改日期",
                format: "{0:yyyy-MM-dd HH:mm:ss}"
            },
            {
                field: "Lock_Name",
                title: "帐号状态"
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
                    url: apiUrl + "&action=GetUserList",
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
                    id: "UserId",
                    fields: {
                        UserId: { editable: false, type: "string" },
                        ModifyDate: { editable: false, type: "date" }
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
        },
        
    },

    ViewModel = kendo.observable({
        conditionModel: {},
        data: {},
    });

    // 初始化页面
    IndexPager.init();
});

function doExplore(e) {
    $("#grid").data("kendoGrid").saveAsExcel();
    return false;
}