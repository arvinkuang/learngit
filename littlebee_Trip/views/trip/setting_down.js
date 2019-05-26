$(function () {

    var IndexPager = {
        init: function () {
            ViewModel.getData();
            kendo.bind($(".card"), ViewModel);
            //$(".k-button").kendoButton();
        }
    },
    ViewModel = kendo.observable({
        conditionModel: {},
        Sys_value1: "",
        Sys_value2: "",
        data: {},
        getData: function () {

            $('#loading').show();

            $.fn.ajaxPost({
                ajaxData: [],
                ajaxUrl: 'GetSettingDown',
                finished: function (res) {
                    $('#loading').hide();
                },
                succeed: function (res) {
                    if (res.data != null) {
                        ViewModel.set("data", res.data);
                        ViewModel.set("Sys_value1", res.data.Sys_value1);
                        ViewModel.set("Sys_value2", res.data.Sys_value2 == "Y" ? "开启" : "关闭");
                    }
                },
                failed: function (res) {
                    //obj.refresh();
                }
            });
        },
        doOperation: function (model) {
            $('#loading').show();
            $.fn.ajaxPost({
                ajaxData: { model: JSON.stringify(model) },
                ajaxUrl: 'AddSettingDown',
                finished: function (res) {
                    $('#loading').hide();
                },
                succeed: function (res) {

                    if (res.result = "y") {
                        ViewModel.set("data", res.data);
                        noticeMsg('修改成功……', 'success', 'center', 500, function () {
                            ViewModel.getData();
                        });
                    } else {
                        noticeMsg('修改错误，错误描述：' + res.msg, 'error', 'center', 500, function () {
                            ViewModel.getData();
                        });
                    }
                },
                failed: function (res) {
                    //res.refresh();
                }
            });
        },
        doSave: function () {
            var model = $.extend({}, this.data);
            if (model.Sys_value1 <= 0) {
                noticeMsg('最小要大于1分钟', 'error', 'center', 500, function () {
                });
            } else {
                this.doOperation(model);
            }
        },
        doOpen: function () {
            var model = $.extend({}, this.data);
            model.Sys_value1 = this.Sys_value1;
            model.Sys_value2 = "Y";
            this.doOperation(model);
        },
        doClose: function () {
            var model = $.extend({}, this.data);
            model.Sys_value1 = this.Sys_value1;
            model.Sys_value2 = "N";
            this.doOperation(model);
        },
    });

    // 初始化页面
    IndexPager.init();
});