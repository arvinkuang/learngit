/*!
 *  v1.0.0 by IKKI & Amikoko - https://ikki2000.github.io/
 * Copyright 2018-2019 IKKI Studio
 * Released under the MIT License - http://localhost:61571/LICENSE
 * Email: ikki2002@qq.com
 */

/* JS for All Pages | Written by IKKI | 2018-02-03 */


// 配置接口路径
//var apiPath = 'http://localhost:61571/';
//var DownloadUrl = 'http://localhost:59950/UploadFiles/Download/';
var DownloadUrl = 'http://134.175.163.36/test/UploadFiles/Download/';
//var apiPathRoot = 'http://localhost:59950/Api/ApiHandler.ashx';
var apiPathRoot = 'http://134.175.163.36/test/Api/ApiHandler.ashx';
var apiPath = apiPathRoot+'?action=';
var routerPage = '';
var t1 = null;

jQuery.support.cors = true;

/* 初始化 ****************************************************************************/
$(function () {
    //$(document).css("-webkit-transform", "scale(0.9)");
    //$(window).resize(function () {
    //    $(document).css("-webkit-transform", "scale(0.9)");
    //}); 

    // 移动端
    if (/Android|iPhone|iPad|iPod|Windows Phone|webOS|SymbianOS|BlackBerry/i.test(navigator.userAgent)) {

    }
    // 回车搜索
    $('#section').on('keyup', '#searchKeywords', function (event) {
        if (event.keyCode === 13) {
            conditionSearch();
        }
    });
    // 回到顶部
    $('#section').append('<button class="k-button k-state-selected" id="goTop"><i class="fas fa-angle-up"></i></button>').scroll(function () {
        if ($(this).scrollTop() > 800) {
            $('#goTop').fadeIn();
        } else {
            $('#goTop').fadeOut();
        }
    });
    $('#goTop').click(function () {
        $('#section').animate({ scrollTop: 0 }, 500);
    });
    
});

/* Ajax 提交 ****************************************************************************/
(function ($) {
    $.fn.ajaxPost = function (options) {
        
        var defaults = { // 参数默认值
                ajaxAsync: true,
                ajaxType: 'post', // GitHub Pages 演示只支持 get 请求，正常使用请改回 post 请求
                ajaxData: '',
                urlType: 'api', // GitHub Pages 演示接口为静态 json 文件，正常使用请改回 api 类型
                ajaxUrl: '', // GitHub Pages 模拟返回的 json 文件，正常使用请改回空字符串
                ajaxContentType: 'application/x-www-form-urlencoded', // 标准表单提交请使用：application/x-www-form-urlencoded
                finished: noFunc,
                succeed: noFunc,
                failed: noFunc,
                isMsg: false
            },
            opts = $.extend({}, defaults, options),
            urls = '';

        //判断如果不是登录页面，同时不存在token+userid则退出到登录页面
        if (opts.ajaxUrl != "Login" && (sessionStorage.getItem('token') == null || sessionStorage.getItem('userid') == null)) {

            noticeMsg('登录超时', 'error', 'center', 500, function () {
                logout();
            });

            return false;
        }

        if (opts.ajaxType === 'get') {
            $.ajaxSetup({
                cache: false
            });
        }
        if (opts.urlType === 'api') {
            //添加userid+token做为验证
            if (opts.ajaxUrl != "Login")
                urls = apiPath + opts.ajaxUrl + "&userid=" + sessionStorage.getItem('userid') + "&token=" + sessionStorage.getItem('token') + "&page=" + routerPage;
            else
                urls = apiPath + opts.ajaxUrl;

        } else if (opts.urlType === 'static') {
            urls = opts.ajaxUrl;
        }


        $.ajax({
            //headers: {
            //    'Authorization': sessionStorage.getItem('token'),
            //},
            async: opts.ajaxAsync,
            type: opts.ajaxType,
            //data: JSON.stringify(opts.ajaxData), // 标准表单提交请去除：JSON.stringify
            data: opts.ajaxData,
            url: urls,
            contentType: opts.ajaxContentType,
            dataType: 'json',
            success: function (res, status, xhr) {
                if (res.result !== 'denied') {
                    if (opts.urlType === 'api') {
                        sessionStorage.setItem('token', xhr.getResponseHeader('Authorization'));
                    }
                    opts.finished(res);
                    if (res.result === 'y') {
                        opts.succeed(res);
                        if (opts.isMsg && res.msg.length > 0) {
                            alertMsgNoBtn(res.msg, 'success');
                        }
                    } else if (res.result === 'n') {
                        opts.failed(res);
                        if (res.msg.length > 0) {
                            alertMsg(res.msg, 'error');
                        }
                    }
                }
                else {
                    noticeMsg('权限异常', 'error', 'center', 500, function () {
                        logout();
                    });
                }
            },
            error: function (xhr, status, thrown) {
                alertMsg(thrown, 'error');
            },
            statusCode: {
                403: function () {
                    alertMsg('服务器拒绝请求！', 'error');
                },
                404: function () {
                    alertMsg('页面未找到！', 'error');
                },
                405: function () {
                    alertMsg('请求方法被禁用！', 'error');
                },
                500: function () {
                    alertMsg('服务器内部错误！', 'error');
                },
                502: function () {
                    alertMsg('错误网关！', 'error');
                },
                503: function () {
                    alertMsg('服务不可用！', 'error');
                },
                504: function () {
                    alertMsg('网关超时！', 'error');
                },
                505: function () {
                    alertMsg('HTTP 版本不受支持！', 'error');
                }
            }
        });
    };
})(jQuery);

// 带二进制流的 Ajax 提交
(function ($) {
    $.fn.ajaxPostBlob = function (options) {
        var defaults = { // 参数默认值
                ajaxAsync: true,
                ajaxType: 'get', // GitHub Pages 演示只支持 get 请求，正常使用请改回 post 请求
                ajaxData: '',
                ajaxUrl: 'json/response.json', // GitHub Pages 模拟返回的 json 文件，正常使用请改回空字符串
                finished: noFunc,
                succeed: noFunc,
                failed: noFunc,
                isMsg: true
            },
            opts = $.extend({}, defaults, options);
        $.ajax({
            headers: {
                'Authorization': sessionStorage.getItem('token'),
            },
            async: opts.ajaxAsync,
            type: opts.ajaxType,
            data: new FormData(opts.ajaxData),
            url: apiPath + opts.ajaxUrl,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (res, status, xhr) {
                if (res.result !== 'denied') {
                    sessionStorage.setItem('token', xhr.getResponseHeader('Authorization'));
                    opts.finished(res);
                    if (res.result === 'y') {
                        opts.succeed(res);
                        if (opts.isMsg && res.msg.length > 0) {
                            alertMsgNoBtn(res.msg, 'success');
                        }
                    } else if (res.result === 'n') {
                        opts.failed(res);
                        if (res.msg.length > 0) {
                            alertMsg(res.msg, 'error');
                        }
                    }
                } else {
                    logout();
                }
            },
            error: function (xhr, status, thrown) {
                alertMsg(thrown, 'error');
            },
            statusCode: {
                403: function () {
                    alertMsg('服务器拒绝请求！', 'error');
                },
                404: function () {
                    alertMsg('页面未找到！', 'error');
                },
                405: function () {
                    alertMsg('请求方法被禁用！', 'error');
                },
                500: function () {
                    alertMsg('服务器内部错误！', 'error');
                },
                502: function () {
                    alertMsg('错误网关！', 'error');
                },
                503: function () {
                    alertMsg('服务不可用！', 'error');
                },
                504: function () {
                    alertMsg('网关超时！', 'error');
                },
                505: function () {
                    alertMsg('HTTP 版本不受支持！', 'error');
                }
            }
        });
    };
})(jQuery);

// 空方法
function noFunc() {}

/* 模态框 ****************************************************************************/

// 提示框
function tipMsg(dom, msg, position) {
    var tips = $(dom).kendoTooltip({
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        position: position,
        content: msg
    }).data('kendoTooltip');
    $(dom).on('mouseenter', function () {
        tips.show();
    });
    $(dom).on('mouseleave', function () {
        tips.hide();
    });
}

// 通知框
function noticeMsg(msg, type, position, time, hided) {
    var notification = $('<div class="notice-box"></div>').kendoNotification({
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        position: {
            pinned: false
        },
        show: function (e) {
            var el = e.element.parent(),
                cTop = Math.floor(($(window).height() - el.height()) / 2),
                cLeft = Math.floor(($(window).width() - el.width()) / 2);
            if (position === 'center') {
                el.css({top: cTop, left: cLeft});
            } else if (position === 'top') {
                el.css({top: 10, left: cLeft});
            } else if (position === 'left') {
                el.css({top: cTop, left: 10});
            } else if (position === 'right') {
                el.css({top: cTop, right: 10});
            } else if (position === 'bottom') {
                el.css({left: cLeft, bottom: 10});
            } else if (position === 'left top') {
                el.css({top: 10, left: 10});
            } else if (position === 'right top') {
                el.css({top: 10, right: 10});
            } else if (position === 'left bottom') {
                el.css({left: 10, bottom: 10});
            } else if (position === 'right bottom') {
                el.css({right: 10, bottom: 10});
            }
        },
        autoHideAfter: time,
        hide: function () {
            if (hided) {
                hided();
            }
        }
    }).data('kendoNotification');
    notification.showText(msg, type);
}

// 信息类型判断
function checkInfoType(type) {
    if (type === 'success') {
        return '<i class="fas fa-check-circle"></i>';
    } else if (type === 'info') {
        return '<i class="fas fa-info-circle"></i>';
    } else if (type === 'question') {
        return '<i class="fas fa-question-circle"></i>';
    } else if (type === 'warning') {
        return '<i class="fas fa-exclamation-circle"></i>';
    } else if (type === 'error') {
        return '<i class="fas fa-times-circle"></i>';
    } else {
        return '';
    }
}

// 警告框
function alertMsg(msg, type, closed) {
    var alertDialog = $('<div class="dialog-box"></div>').kendoDialog({
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        closable: false,
        maxWidth: '30%',
        maxHeight: '30%',
        minWidth: 320,
        minHeight: 196,
        title: '信息',
        content: '<dl class="d-flex align-items-center m-0"><dt>' + checkInfoType(type) + '</dt><dd class="m-0">' + msg + '</dd></dl>',
        actions: [
            {
                text: '确定',
                primary: true,
                action: function (e) {
                    if (closed) {
                        closed();
                    }
                    alertDialog.close();
                }
            }
        ],
        close: function () {
            alertDialog.destroy();
        }
    }).data('kendoDialog');
    alertDialog.open();
}

// 警告框小按钮
function alertMsgBtn(msg, type, closed) {
    var alertWindow = $('<div class="dialog-box"></div>').kendoWindow({
        actions: [],
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        maxWidth: '30%',
        maxHeight: '30%',
        minWidth: 320,
        minHeight: 196,
        title: '信息',
        modal: true,
        pinned: true,
        resizable: false,
        close: function () {
            alertWindow.destroy();
        }
    }).data('kendoWindow');
    alertWindow.content('<dl class="d-flex align-items-center m-0"><dt>' + checkInfoType(type) + '</dt><dd class="m-0">' + msg + '</dd></dl>' + '<div class="k-window-buttongroup"><button class="k-button k-button-lg k-state-selected" type="button">确 定</button></div>').center().open();
    $('.dialog-box .k-window-buttongroup .k-button').click(function () {
        if (closed) {
            closed();
        }
        alertWindow.close();
    });
}

// 警告框无按钮
function alertMsgNoBtn(msg, type, closed) {
    var alertDialog = $('<div class="dialog-box"></div>').kendoDialog({
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        maxWidth: '30%',
        maxHeight: '30%',
        minWidth: 320,
        minHeight: 160,
        title: '信息',
        content: '<dl class="d-flex align-items-center m-0"><dt>' + checkInfoType(type) + '</dt><dd class="m-0">' + msg + '</dd></dl>',
        open: function () {
            if (closed) {
                closed();
            }
            setTimeout(function (){
                alertDialog.close();
            }, 2000);
        },
        close: function () {
            alertDialog.destroy();
        }
    }).data('kendoDialog');
    alertDialog.open();
}

// 确认框
function confirmMsg(title, msg, type, confirmed) {
    var confirmDialog = $('<div class="dialog-box"></div>').kendoDialog({
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        closable: false,
        maxWidth: '30%',
        maxHeight: '30%',
        minWidth: 320,
        minHeight: 196,
        title: title,
        content: '<dl class="d-flex align-items-center m-0"><dt>' + checkInfoType(type) + '</dt><dd class="m-0">' + msg + '</dd></dl>',
        actions: [
            {
                text: '确定',
                primary: true,
                action: function (e) {
                    confirmed();
                }
            },
            {
                text: '取消',
                action: function (e) {
                    confirmDialog.close();
                }
            }
        ],
        close: function () {
            confirmDialog.destroy();
        }
    }).data('kendoDialog');
    confirmDialog.open();
}

// 确认框小按钮
function confirmMsgBtn(title, msg, type, confirmed) {
    var confirmWindow = $('<div class="dialog-box"></div>').kendoWindow({
        actions: [],
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        maxWidth: '30%',
        maxHeight: '30%',
        minWidth: 320,
        minHeight: 196,
        title: title,
        modal: true,
        pinned: true,
        resizable: false,
        close: function () {
            confirmWindow.destroy();
        }
    }).data('kendoWindow');
    confirmWindow.content('<dl class="d-flex align-items-center m-0"><dt>' + checkInfoType(type) + '</dt><dd class="m-0">' + msg + '</dd></dl>' + '<div class="k-window-buttongroup"><button class="k-button k-button-lg k-state-selected" type="button">确 定</button><button class="k-button k-button-lg" type="button">取 消</button></div>').center().open();
    $('.dialog-box .k-window-buttongroup .k-state-selected').click(function () {
        confirmed();
    });
    $('.dialog-box .k-window-buttongroup .k-button').click(function () {
        confirmWindow.close();
    });
}

// 弹出层
function divWindow(title, width, height, content) {
    var divWindow = $('<div class="window-box"></div>').kendoWindow({
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        title: title,
        width: width,
        height: height,
        modal: true,
        pinned: true,
        resizable: false,
        close: function () {
            divWindow.destroy();
        }
    }).data('kendoWindow');
    divWindow.content(content).center().open();
}

// 弹出页
function iframeWindow(title, width, height, url) {
    var iframeWindow = $('<div class="iframe-box"></div>').kendoWindow({
        actions: ['Pin', 'Refresh', 'Minimize', 'Maximize', 'Close'],
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        title: title,
        width: width,
        height: height,
        modal: true,
        pinned: true,
        iframe: true,
        content: url,
        close: function () {
            iframeWindow.destroy();
        }
    }).data('kendoWindow');
    iframeWindow.center().open();
}

// 大图预览
function showBigPic(url) {
    var picWindow = $('<div class="pic-box"></div>').kendoWindow({
        animation: {open: {effects: 'fade:in'}, close: {effects: 'fade:out'}},
        title: '图片预览',
        modal: true,
        pinned: true,
        resizable: false,
        close: function () {
            picWindow.destroy();
        }
    }).data('kendoWindow');
    picWindow.content('<img src="'+ url +'">').center().open().maximize();
}

/* 表单操作 ****************************************************************************/

// 高级搜索
function advSearch(dom) {
    if ($('.adv-search-area:visible').length > 0) {
        $('form.condition').get(0).reset();
    }
    $('#searchBtn').fadeToggle();
    $(dom).find('i').toggleClass('fa-angle-double-up');
    $('.adv-search-area').slideToggle();
}

// 条件搜索
function conditionSearch() {
    if ($('#grid').length > 0) {
        var dataSource = $('#grid').data('kendoGrid').dataSource;
        dataSource.read();
        dataSource.query({
            page: 1,
            pageSize: dataSource.pageSize()
        });
    }
    if ($('#listView').length > 0) {
        var dataSource = $('#listView').data('kendoListView').dataSource;
        dataSource.read();
        dataSource.query({
            page: 1,
            pageSize: dataSource.pageSize()
        });
    }
}

// 数字型范围
function numericRange(rangeStart, rangeEnd, format, decimals, step, min, max) {
    var start = rangeStart.kendoNumericTextBox({
            change: startChange,
            format: format,
            decimals: decimals,
            step: step,
            min: min,
            max: max
        }).data('kendoNumericTextBox'),
        end = rangeEnd.kendoNumericTextBox({
            change: endChange,
            format: format,
            decimals: decimals,
            step: step,
            min: min,
            max: max
        }).data('kendoNumericTextBox');
    start.max(end.value());
    end.min(start.value());
    function startChange() {
        var startNumeric = start.value(),
            endNumeric = end.value();
        if (startNumeric) {
            start.max(max);
            end.min(startNumeric);
        } else if (endNumeric) {
            start.max(endNumeric);
            end.min(min);
        } else {
            start.max(max);
            end.min(min);
        }
    }
    function endChange() {
        var endNumeric = end.value(),
            startNumeric = start.value();
        if (endNumeric) {
            start.max(endNumeric);
            end.min(min);
        } else if (startNumeric) {
            start.max(max);
            end.min(startNumeric);
        } else {
            start.max(max);
            end.min(min);
        }
    }
}

// 日期型范围
function dateRange(rangeStart, rangeEnd, type) {
    if (type === 'Year') {
        var start = rangeStart.kendoDatePicker({
                change: startChange,
                start: 'decade',
                depth: 'decade',
                format: 'yyyy',
                footer: '今年：#= kendo.toString(data, "yyyy年") #'
            }).data('kendoDatePicker'),
            end = rangeEnd.kendoDatePicker({
                change: endChange,
                start: 'decade',
                depth: 'decade',
                format: 'yyyy',
                footer: '今年：#= kendo.toString(data, "yyyy年") #'
            }).data('kendoDatePicker');
    } else if (type === 'Month') {
        var start = rangeStart.kendoDatePicker({
                change: startChange,
                start: 'year',
                depth: 'year',
                format: 'yyyy-MM',
                footer: '当月：#= kendo.toString(data, "yyyy年MM月") #'
            }).data('kendoDatePicker'),
            end = rangeEnd.kendoDatePicker({
                change: endChange,
                start: 'year',
                depth: 'year',
                format: 'yyyy-MM',
                footer: '当月：#= kendo.toString(data, "yyyy年MM月") #'
            }).data('kendoDatePicker');
    } else if (type === 'Time') {
        var start = rangeStart.kendoTimePicker({
                change: startChange,
                format: 'HH:mm'
            }).data('kendoTimePicker'),
            end = rangeEnd.kendoTimePicker({
                change: endChange,
                format: 'HH:mm'
            }).data('kendoTimePicker');
    } else if (type === 'DateTime') {
        var start = rangeStart.kendoDateTimePicker({
                change: startChange,
                format: 'yyyy-MM-dd HH:mm',
                footer: '现在：#= kendo.toString(data, "yyyy年MM月dd日 HH:mm") #'
            }).data('kendoDateTimePicker'),
            end = rangeEnd.kendoDateTimePicker({
                change: endChange,
                format: 'yyyy-MM-dd HH:mm',
                footer: '现在：#= kendo.toString(data, "yyyy年MM月dd日 HH:mm") #'
            }).data('kendoDateTimePicker');
    } else {
        var start = rangeStart.kendoDatePicker({
                change: startChange,
                format: 'yyyy-MM-dd',
                footer: '今天：#= kendo.toString(data, "yyyy年MM月dd日") #'
            }).data('kendoDatePicker'),
            end = rangeEnd.kendoDatePicker({
                change: endChange,
                format: 'yyyy-MM-dd',
                footer: '今天：#= kendo.toString(data, "yyyy年MM月dd日") #'
            }).data('kendoDatePicker');
    }
    start.max(end.value());
    end.min(start.value());
    function startChange() {
        var startDate = start.value(),
            endDate = end.value();
        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
            end.min(startDate);
        } else if (endDate) {
            start.max(new Date(endDate));
            end.min(new Date('1900'));
        } else {
            start.max(new Date('2100'));
            end.min(new Date('1900'));
        }
    }
    function endChange(){
        var endDate = end.value(),
            startDate = start.value();
        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate());
            start.max(endDate);
        } else if (startDate) {
            end.min(new Date(startDate));
            start.max(new Date('2100'));
        } else {
            end.min(new Date('1900'));
            start.max(new Date('2100'));
        }
    }
}

// 日期输入型范围
function dateInputRange(rangeStart, rangeEnd, type) {
    if (type === 'Year') {
        var start = rangeStart.kendoDateInput({
                change: startChange,
                format: 'yyyy'
            }).data('kendoDateInput'),
            end = rangeEnd.kendoDateInput({
                change: endChange,
                format: 'yyyy'
            }).data('kendoDateInput');
    } else if (type === 'Month') {
        var start = rangeStart.kendoDateInput({
                change: startChange,
                format: 'yyyy-MM'
            }).data('kendoDateInput'),
            end = rangeEnd.kendoDateInput({
                change: endChange,
                format: 'yyyy-MM'
            }).data('kendoDateInput');
    } else if (type === 'Time') {
        var start = rangeStart.kendoDateInput({
                change: startChange,
                format: 'HH:mm:ss'
            }).data('kendoDateInput'),
            end = rangeEnd.kendoDateInput({
                change: endChange,
                format: 'HH:mm:ss'
            }).data('kendoDateInput');
    } else if (type === 'DateTime') {
        var start = rangeStart.kendoDateInput({
                change: startChange,
                format: 'yyyy-MM-dd HH:mm'
            }).data('kendoDateInput'),
            end = rangeEnd.kendoDateInput({
                change: endChange,
                format: 'yyyy-MM-dd HH:mm'
            }).data('kendoDateInput');
    } else {
        var start = rangeStart.kendoDateInput({
                change: startChange,
                format: 'yyyy-MM-dd'
            }).data('kendoDateInput'),
            end = rangeEnd.kendoDateInput({
                change: endChange,
                format: 'yyyy-MM-dd'
            }).data('kendoDateInput');
    }
    start.max(end.value());
    end.min(start.value());
    function startChange() {
        var startDate = start.value(),
            endDate = end.value();
        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
            end.min(startDate);
        } else if (endDate) {
            start.max(new Date(endDate));
            end.min(new Date('1900'));
        } else {
            start.max(new Date('2100'));
            end.min(new Date('1900'));
        }
    }
    function endChange() {
        var endDate = end.value(),
            startDate = start.value();
        if (endDate){
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate());
            start.max(endDate);
        } else if (startDate){
            end.min(new Date(startDate));
            start.max(new Date('2100'));
        } else {
            end.min(new Date('1900'));
            start.max(new Date('2100'));
        }
    }
}

// 表单序列化 Json 对象
$.fn.serializeObject = function () {
    'use strict';
    var result = {};
    var extend = function (i, element) {
        var node = result[element.name];
        if ('undefined' !== typeof node && node !== null) {
            if ($.isArray(node)) {
                node.push(element.value);
            } else {
                result[element.name] = [node, element.value];
            }
        } else {
            result[element.name] = element.value;
        }
    };
    $.each(this.serializeArray(), extend);
    return result;
};

/* 数据操作 ****************************************************************************/

// 新增条目
function createItem(options, url, succeed) {
    cudItem(options, options.data, url, succeed);
}

// 删除条目
function destroyItem(options, url, succeed) {
    cudItem(options, $.extend({}, {'id': options.data.id}, $('.condition').serializeObject()), url, succeed);
}

// 编辑条目
function updateItem(options, url, succeed) {
    cudItem(options, options.data, url, succeed);
}

// 增删改条目
function cudItem(options, data, url, succeed) {
    $('#loading').show();
    $.fn.ajaxPost({
        ajaxData: data,
        ajaxUrl: url,
        finished: function () {
            $('#loading').hide();
        },
        succeed: function (res) {
            options.success(res);
            if ($('#grid').length > 0) {
                refreshGrid();
            }
            if ($('#listView').length > 0) {
                refreshList();
            }
            if (succeed) {
                succeed(res);
            }
        },
        failed: function (res) {
            options.error(res);
        },
        isMsg: true
    });
}

// 读取条目
function readItem(options, url, succeed) {
    $.fn.ajaxPost({
        ajaxData: $('.condition').serializeObject(),
        ajaxUrl: url,
        succeed: function (res) {
            options.success(res);
            if (succeed) {
                succeed(res);
            }
        },
        failed: function (res) {
            options.error(res);
        }
    });
}

// 读取节点
function readNode(options, url, succeed) {
    $.fn.ajaxPost({
        ajaxUrl: url,
        succeed: function (res) {
            options.success(res);
            if (succeed) {
                succeed(res);
            }
        },
        failed: function (res) {
            options.error(res);
        }
    });
}

// 刷新表格
function refreshGrid() {
    $('#grid').data('kendoGrid').dataSource.read();
}

// 刷新树形
function refreshTree() {
    $('#treeView').data('kendoTreeView').dataSource.read();
}

// 刷新列表
function refreshList() {
    $('#listView').data('kendoListView').dataSource.read();
}

// 批量提交ID
function batchSubmitId(url, succeed) {
    var ids = [];
    if ($('#grid').length > 0) {
        ids = $('#grid').data('kendoGrid').selectedKeyNames();
    }
    if ($('#treeView').length > 0) {
        $.each($('#treeView :checkbox'), function () {
            if ($(this).prop('checked') || $(this).prop('indeterminate')) {
                ids.push($('#treeView').data('kendoTreeView').dataItem($(this).closest('li')).id);
            }
        });
    }
    if ($('#listView').length > 0) {
        $.each($('#listView .ids'), function () {
            if ($(this).prop('checked')) {
                ids.push($(this).val());
            }
        });
    }
    if (ids.length > 0) {
        $('#loading').show();
        $.fn.ajaxPost({
            ajaxData: {
                'ids': ids
            },
            ajaxUrl: url,
            finished: function () {
                $('#loading').hide();
            },
            succeed: function (res) {
                if ($('#grid').length > 0) {
                    refreshGrid();
                }
                if ($('#treeView').length > 0) {
                    refreshTree();
                }
                if ($('#listView').length > 0) {
                    refreshList();
                }
                if (succeed) {
                    succeed(res);
                }
            },
            isMsg: true
        });
    } else {
        alertMsg('请先选择对象！', 'warning');
    }
}

// 批量提交数据
function batchSubmitData(url, succeed) {
    var models = [];
    if ($('#grid').length > 0) {
        $.each($('#grid').data('kendoGrid').selectedKeyNames(), function () {
            models.push($('#grid').data('kendoGrid').dataSource.get(this));
        });
    }
    if ($('#treeView').length > 0) {
        $.each($('#treeView :checkbox'), function () {
            if ($(this).prop('checked') || $(this).prop('indeterminate')) {
                models.push($('#treeView').data('kendoTreeView').dataItem($(this).closest('li')));
            }
        });
    }
    if ($('#listView').length > 0) {
        $.each($('#listView .ids'), function () {
            if ($(this).prop('checked')) {
                models.push($('#listView').data('kendoListView').dataItem($(this).closest('.listItem')));
            }
        });
    }
    if (models.length > 0) {
        $('#loading').show();
        $.fn.ajaxPost({
            ajaxData: {
                'models': models
            },
            ajaxUrl: url,
            finished: function () {
                $('#loading').hide();
            },
            succeed: function (res) {
                if ($('#grid').length > 0) {
                    refreshGrid();
                }
                if ($('#treeView').length > 0) {
                    refreshTree();
                }
                if ($('#listView').length > 0) {
                    refreshList();
                }
                if (succeed) {
                    succeed(res);
                }
            },
            isMsg: true
        });
    } else {
        alertMsg('请先选择对象！', 'warning');
    }
}

// 按钮详情
function btnDetails(e) {
    e.preventDefault();
    divWindow('详情', '80%', '40%', kendo.template($('#detailsTemplate').html())(this.dataItem($(e.target).closest('tr'))));
}

// 链接详情
function linkDetails(dataItem) {
    $('.k-grid-content').on('click', 'a[data-uid='+ dataItem.uid +']', function () {
        if ($('body > .k-overlay').length === 0) {
            divWindow('详情', '80%', '40%', kendo.template($('#detailsTemplate').html())(dataItem));
        }
    });
}
