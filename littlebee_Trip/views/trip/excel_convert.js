var apiUrl = apiPathRoot + '?userid=' + sessionStorage.getItem('userid') + '&token=' + sessionStorage.getItem('token') + '&page=' + routerPage;

$(function () {

    var IndexPager = {
        _files: $('#files') || null,
        _filesData: null,
        init: function () {
            kendo.bind($(".card"), ViewModel);
            this.initKendoControls();
        },
        initKendoControls: function (e) {

            this._filesData = this._files.kendoUpload({
                multiple: false,
                width:"200px",
                validation: {
                    allowedExtensions: [".xls", ".xlsx"]
                },
                async: {
                    autoUpload: false,
                    saveUrl: apiUrl + "&action=ExcelConvert",
                    concurrent: false
                },
                complete: function (e) {
                    $('#loading').hide();
                },
                open: function (e) {
                    ViewModel.set("downloadUrl", "");
                    ViewModel.set("downloadUrl", "javascript:");
                },
                success: function (e) {
                    console.log(e);
                    var data = e.response;
                    if (e.operation == "upload" && data.result == "y" && data.data != null) {

                        if (data.data.downfileName != "" && data.data.error_row == "") {
                            ViewModel.set("downloadUrl", DownloadUrl + data.data.downfileName);
                            noticeMsg('上传转换成功，请点击下载!', 'success', 'center', 2000, function () {
                            });
                        } else if (data.data.downfileName != "" && data.data.error_row != "") {
                            ViewModel.set("downloadUrl", DownloadUrl + data.data.downfileName);                            
                            noticeMsg('上传转换部份行失败，可下载查看，失败行号：' + data.data.error_row, 'error', 'center', 5000, function () {

                            });
                        } else {
                            noticeMsg('上传转换失败，文件格式或者内容有误', 'error', 'center', 2000, function () {
                            });
                        }

                    } else if (e.operation == "upload" && data.result == "y" && data.data != null) {
                        noticeMsg('上传转换失败，文件格式或者内容有误', 'error', 'center', 2000, function () {
                        });
                    } else if (e.operation == "upload" && data.result != "y") {
                        noticeMsg('上传转换失败，错误信息:' + data.msg, 'error', 'center', 2000, function () {
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
        downloadUrl: "javascript:", 
        data: {},
        doUploadConvert: function (e) {
            var file = IndexPager._filesData.getFiles();
            if (file.length > 0 && file[0].validationErrors == null) {
                $('#loading').show();
                IndexPager._filesData.upload();
            }
        },
        doDonwnload: function (e) { }
    });

    // 初始化页面
    IndexPager.init();
});