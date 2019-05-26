var apiUrl = apiPathRoot + '?userid=' + sessionStorage.getItem('userid') + '&token=' + sessionStorage.getItem('token') + '&page=' + routerPage;

$(function () {
    var IndexPager = {
        _grid: $('#grid') || null,
        _gridData: null,
        _dialog: $('#dialog') || null,
        _dialogData: null,
        _files: $('#files') || null,
        _filesData: null,
        _gridColumns: [
            { selectable: true, width: '40px' },
            {
                field: "RID",
                hidden: true,
                title: "Key"
            },
            {
                field: "asc_cabin_sort",
                hidden: true,
                title: "顺序"
            },            
            {
                field: "Order_No",
                title: "订单号",
                filterable: {
                    multi: true,
                    search: true
                }

            },
            {
                field: "fromcity",
                title: "起飞机场",
                filterable: false
            },
            {
                field: "tocity",
                title: "到达机场",
                filterable: false
            },
            {
                field: "flightdate",
                title: "航班日期",
                format: "{0:yyyy-MM-dd}",
                filterable: {
                    multi: true,
                    search: true
                },
            },
            {
                field: "flightno",
                title: "航班号",
                filterable: {
                    multi: true,
                    search: true
                }
            },
            {
                field: "query_cabininfo",
                title: "查询舱位",
                filterable: {
                    multi: true,
                    search: true
                }
            },
            {
                field: "act_cabininfo",
                title: "实际舱位",
                filterable: {
                    multi: true,
                    search: true
                }
            },
            
            {
                field: "asc_cabin",
                title: "升舱/降舱",
                template: function (dataItem) {
                    if (dataItem.asc_cabin == "降舱")
                        return "降舱<span class='asc'><span>";
                    else if (dataItem.asc_cabin == "本舱位")
                        return "本舱位<span class='local'><span>";
                    else if (dataItem.asc_cabin == "升舱")
                        return "升舱<span class='desc'><span>";
                    else if (dataItem.asc_cabin == "无")
                        return "无<span class='no'><span>";
                    else
                        return dataItem.asc_cabin;
                },
                filterable: {
                    multi: true,
                    search: true
                }
            },
            {
                field: "qty_cabin",
                title: "余位",
                filterable: {
                    multi: true,
                    search: true
                }
            },
            {
                field: "Upload_Log",
                title: "日志",
                filterable: false
            },
            {
                field: "Refresh_Time",
                title: "数据刷新时间",
                filterable: false
            },
            {
                field: "Upload_Remark",
                title: "备注",
                filterable: false
            }
        ],
        // 搜索
        search: function () {

            if (ViewModel.Sys_value2 == "开启") {
                
                if (ViewModel.Interval <= 0) {
                    //刷新数据中，停止定时器
                    window.clearInterval(t1); 
                    $("#spanmsg").html("刷新数据中...");
                    IndexPager.getDataSource.read();
                }
                else {
                    ViewModel.set("Interval", ViewModel.Interval - 1);
                    var m = Math.ceil((ViewModel.Interval - 1) / 60.00);
                    if(m>0)
                        $("#spanmsg").html("大约(" + m + ")分钟后刷新数据");
                    else
                        $("#spanmsg").html("即将刷新数据");                     
                }
            } else {
                $("#spanmsg").html("目前定时刷新未开启");
            }
        },
        init: function () {
            this.initKendoControls();            
        },
        //获取刷新时间设置
        getData: function () {
            $('#loading').show();
            $.fn.ajaxPost({
                ajaxData: [],
                ajaxUrl: 'GetSettingDown',
                finished: function (res) {
                    $('#loading').hide();
                },
                succeed: function (res) {

                    //去掉定时器
                    window.clearInterval(t1);                    
                    $("#spanmsg").html("");

                    if (res.result == "y" && res.data != null) {
                        ViewModel.set("Sys_value1", res.data.Sys_value1 * 60);
                        ViewModel.set("Sys_value2", res.data.Sys_value2 == "Y" ? "开启" : "关闭");

                        ViewModel.set("Interval", res.data.Sys_value3);
                        t1 = window.setInterval(IndexPager.search, 1000);
                    } else {
                        $("#spanmsg").html("请先设置定时刷新频率");
                    }
                },
                failed: function (res) {
                    //obj.refresh();
                }
            });
        },
        //获取剩余流量
        GetUserActJson: function () {
            $('#loading').show();
            $.fn.ajaxPost({
                ajaxData: [],
                ajaxUrl: 'GetUserActJson',
                finished: function (res) {
                    $('#loading').hide();
                },
                succeed: function (res) {
                    if (res.result == "y" && res.data != null) {
                        ViewModel.set("UseSend", res.data.UseSend);
                        ViewModel.set("UserAct", res.data.UserAct);
                        $("#spanusemsg").html("[查询帐号：" + ViewModel.UserAct + "，已使用流量：" + ViewModel.UseSend + "条]");
                    }
                    else {
                        $("#spanusemsg").html("流量查询失败");
                    }
                },
                failed: function (res) {
                }
            });
        },

        // 获取数据源
        getDataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: apiUrl + "&action=GetSettingList",
                    dataType: "json",
                    cache: false,
                    type: "POST"
                },
                parameterMap: function (options, operation) {
                    
                }
            },
            requestEnd: function (e) {
                if (e.type == "read" && e.response != null && e.response != null && e.response.data != null) {
                    IndexPager.getData();
                    IndexPager.GetUserActJson();
                    var data = e.response.data;
                    var len = data.length;
                    var totalClass = { "asc": 0, "local": 0, "desc": 0, "no": 0 };
                    for (var i = 0; i < len; i++) {
                        var value = data[i].asc_cabin;
                        if (value == "降舱")
                            totalClass.asc = totalClass.asc + 1;
                    }
                    $("#spantotal").html("<strong>降舱数量：<u>" + totalClass.asc + "</u></strong>");

                }
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
            pageSize: 20,
            sort: [
                { field: "asc_cabin_sort", dir: "asc" },
                { field: "qty_cabin", dir: "asc" },
                { field: "Order_No", dir: "asc" }
            ],
            serverSorting: false,
            serverFiltering: false,
            serverPaging: false,
            serverGrouping: false,
            serverAggregates: false
        }),
        // 初始化Kendo控件
        initKendoControls: function () {

            this._gridData = this._grid.kendoGrid({
                selectable: "multiple cell",
                noRecords: {
                    template: '<div class="text-center p-4">无相关数据,请上传搜索文件</div>'
                },
                persistSelection: true,
                reorderable: true,
                allowCopy: {
                    delimeter: ",",
                },
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
                        template: '<button class="k-button k-primary" style="width:120px;" onclick="return doDialogUpload();">上传</button>'
                            + '<button class="k-button" style="width:120px;margin-left:30px;" onclick="return doDelete();" >删除</button>'
                            + '<button class="k-button"  style="width:120px;margin-left:30px;" onclick="return doExplore();" >导出</button>'
                            + '<span id="spantotal" style="margin-top:5px;margin-left:52px;color:green;font-size:20px;font-weight: bold;"></span>'

                            + '<span id="spanusemsg" style="float: right;color:orange;font-weight: bold;padding-top: 5px;margin-left:10px;"></span>'                            
                            + '<span id="spanmsg" style="float: right;color:red;font-weight: bold;padding-top: 5px;"></span>'
                            
                    }
                ],
                excel: {
                    fileName: "降舱订单导出" + kendo.toString(new Date(), "yyyy-MM-dd"),
                    filterable: true
                },
                dataBound: function (e) {
                    $("#grid").find("span.asc").parent().css({ "background-color": "green", "color": "black", "border-bottom":"#cccccc 1px solid" });
                    $("#grid").find("span.desc").parent().css({ "background-color": "red", "color": "black", "border-bottom": "#cccccc 1px solid" });
                    $("#grid").find("span.local").parent().css({ "background-color": "white", "color": "black", "border-bottom": "#cccccc 1px solid" });
                    $("#grid").find("span.no").parent().css({ "background-color": "#ccc", "color": "black", "border-bottom": "#cccccc 1px solid" });
                },
                dataBinding: function (e) {

                },
            }).data('kendoGrid');

            this._dialogData = this._dialog.kendoDialog({
                width: "450px",
                title: "搜索文件上传",
                closable: false,
                modal: false,
                visible: false,
                actions: [
                    { text: '关闭' },
                    { text: '上传', primary: true, action: ViewModel.onUpload }
                ],
                close: ViewModel.onClose
            });

            this._filesData = this._files.kendoUpload({
                multiple: false,
                validation: {
                    allowedExtensions: [".xls", ".xlsx"]
                },
                async: {
                    autoUpload: false,
                    saveUrl: apiUrl + "&action=SaveSettingFile",
                    concurrent: false
                },
                complete: function (e) {
                    $('#loading').hide();
                },
                success: function (e) {
                    var data = e.response;
                    if (e.operation == "upload" && data.result == "y" && data.data != null && data.data.length > 0) {
                        noticeMsg('上传成功，数据刷新中...', 'success', 'center', 2000, function () {
                        });
                        //IndexPager.getDataSource.read();
                        //刷新路由，调用ikki.router.js中方法
                        refresh();
                    } else if (e.operation == "upload" && data.result == "y" && data.data != null && data.data.length == 0) {
                        noticeMsg('上传失败，文件格式或者内容有误', 'error', 'center', 2000, function () {
                        });
                    } else if (e.operation == "upload" && data.result != "y") {
                        noticeMsg('上传失败，错误信息:'+data.msg, 'error', 'center', 2000, function () {
                        });
                    }
                },
                error: function (e) {
                    if (e.operation == "upload") {
                        noticeMsg('上传失败，请重试', 'error', 'center', 2000, function () {
                        });
                    }
                }
            }).data("kendoUpload");
        },
        
    },
    ViewModel = kendo.observable({
        conditionModel: {},
        data: {},
        Interval: 15 * 60,
        Sys_value1: 15 * 60,
        Sys_value2: "开启",
        UseSend: "",
        UserAct:"",
        onUpload: function (e) {
            var file = IndexPager._filesData.getFiles();
            if (file.length > 0 && file[0].validationErrors==null) {
                $('#loading').show();
                IndexPager._filesData.upload();
            }
        }
    });

    // 初始化页面
    IndexPager.init();
});

function doDialogUpload(e) {
    $("#dialog").data("kendoDialog").open();
    $("#files").data("kendoUpload").clearAllFiles();
    return false;
}
function doDelete(e) {
    var _grid = $("#grid").data("kendoGrid");

    var models = [];
    //var selectEle = _grid.select();
    
    //var len = selectEle.length;
    //for (var i = 0; i < len; i++) {
    //    var item = _grid.dataItem(selectEle[i]);
    //    models.push(item);
    //}

    var selectEle = $("#grid").find("tr.k-state-selected");
    var len = selectEle.length;
    for (var i = 0; i < len; i++) {
        var item = _grid.dataItem(selectEle[i]);
        models.push(item);
    }

    $('#loading').show();

    $.fn.ajaxPost({
        ajaxData: { model: kendo.stringify(models) },
        ajaxUrl: 'DeleteSettingList',
        finished: function (res) {
            $('#loading').hide();
        },
        succeed: function (res) {

            if (res.result == "y" && res.data != null) {
                for (var i = 0; i < len; i++) {
                    _grid.removeRow(selectEle[i]);
                }                
            }
        },
        failed: function (res) {
        }
    });


    return false;
}
function doExplore(e) {
    $("#grid").data("kendoGrid").saveAsExcel();
    return false;
}