/**
 * jQuery ligerUI 1.1.0.1
 *
 * Author leoxie [ gd_star@163.com ]
 *
 */
//dialog 图片文件夹的路径 针对于IE6设置
var ligerDialogImagePath = easyloader.URI + "/js/plugins/" + (easyloader.theme == 'default' ? 'aqua' : easyloader.theme) + "/images/dialog/";//"../aqua/images/dialog/";

(function ($) {

    $.ligerDefaults = $.ligerDefaults || {};
    $.ligerDefaults.Dialog = {
        className:'l-dialog',
        opacity:0.5,
        cls:null, //给dialog附加css class
        id:null, //给dialog附加id
        buttons:null, //按钮集合
        isDrag:true, //是否拖动
        width:280, //宽度
        height:null, //高度，默认自适应
        content:'', //内容
        target:null, //目标对象，指定它将以appendTo()的方式载入
        url:null, //目标页url，默认以iframe的方式载入
        load:false, //是否以load()的方式加载目标页的内容
        type:'none', //类型 warn、success、error、question
        left:null, //位置left
        top:null, //位置top
        modal:true, //是否模态对话框
        name:null, //创建iframe时 作为iframe的name和id
        isResize:false, // 是否调整大小
        allowClose:true, //允许关闭
        opener:null,
        timeParmName:null, //是否给URL后面加上值为new Date().getTime()的参数，如果需要指定一个参数名即可
        closeWhenEnter:null, //回车时是否关闭dialog
        isNeedNoPaddingClass:false, //是否需要nopaddingclass
        completeFunction:null,       //回调函数
        scroll:false
    };
    $.ligerDefaults.DialogString = {
        titleMessage:'提示', //提示文本标题
        waittingMessage:'正在等待中,请稍候...'
    };
    ///	<param name="$" type="jQuery"></param>
    $.ligerDialog = {};
    $.ligerDialog.open = function (p) {
        p = $.extend({}, $.ligerDefaults.Dialog, $.ligerDefaults.DialogString, p || {});
        var g = {
            //按下回车
            enter:function () {
                var isClose;
                if (p.closeWhenEnter != undefined) {
                    isClose = p.closeWhenEnter;
                }
                else if (p.type == "warn" || p.type == "error" || p.type == "success" || p.type == "question") {
                    isClose = true;
                }
                if (isClose) {
                    g.dialog.close();
                }
            },
            esc:function () {
                g.dialog.close();
            },
            applyWindowMask:function () {
                //$(".l-window-mask:first").remove();
                //
                var mask = $("<div class='l-window-mask' style='display: block;'></div>").height($(window).height() + $(window).scrollTop());
                var zIndex = $('.l-dialog:last').css('z-index');
                var zIndex2 = $('.l-dialog').eq(-2).css('z-index');
                if (zIndex && zIndex2) {
                    mask.css('z-index', (Number(zIndex) + Number(zIndex2)) / 2);
                }
                mask.appendTo('body');
                $(mask).css("opacity", p.opacity);
            },
            removeWindowMask:function () {
                $(".l-window-mask:last").remove();
            },
            applyDrag:function () {
                if ($.fn.ligerDrag)
                    g.dialog.ligerDrag({ handler:'.l-dialog-title' });
            },
            applyResize:function () {
                if ($.fn.ligerResizable) {
                    g.dialog.ligerResizable({
                        onStopResize:function (current, e) {
                            var top = 0;
                            var left = 0;
                            if (!isNaN(parseInt(g.dialog.css('top'))))
                                top = parseInt(g.dialog.css('top'));
                            if (!isNaN(parseInt(g.dialog.css('left'))))
                                left = parseInt(g.dialog.css('left'));
                            if (current.diffTop != undefined) {
                                g.dialog.css({
                                    top:top + current.diffTop,
                                    left:left + current.diffLeft
                                });
                                g.dialog.body.css({
                                    width:current.newWidth - 26
                                });
                                $(".l-dialog-content", g.dialog.body).height(current.newHeight - 46 - $(".l-dialog-buttons", g.dialog).height());
                            }
                            return false;
                        }
                    });
                }
            },
            setImage:function () {
                if (p.type) {
                    if (p.type == 'success' || p.type == 'donne' || p.type == 'ok') {
                        $(".l-dialog-image", g.dialog).addClass("l-dialog-image-donne").show();
                        $(".l-dialog-content", g.dialog).css({ paddingLeft:64, paddingBottom:30 });
                    }
                    else if (p.type == 'error') {
                        $(".l-dialog-image", g.dialog).addClass("l-dialog-image-error").show();
                        $(".l-dialog-content", g.dialog).css({ paddingLeft:64, paddingBottom:30 });
                    }
                    else if (p.type == 'warn') {
                        $(".l-dialog-image", g.dialog).addClass("l-dialog-image-warn").show();
                        $(".l-dialog-content", g.dialog).css({ paddingLeft:64, paddingBottom:30 });
                    }
                    else if (p.type == 'question') {
                        $(".l-dialog-image", g.dialog).addClass("l-dialog-image-question").show();
                        $(".l-dialog-content", g.dialog).css({ paddingLeft:64, paddingBottom:40 });
                    }
                }
            }
        };
        g.dialog = $('<div class=' + p.className + '><table class="l-dialog-table" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="l-dialog-tl"></td><td class="l-dialog-tc"><div class="l-dialog-tc-inner"><div class="l-dialog-icon"></div><div class="l-dialog-title"></div><div class="l-dialog-close"></div></div></td><td class="l-dialog-tr"></td></tr><tr><td class="l-dialog-cl"></td><td class="l-dialog-cc"><div class="l-dialog-body"><div class="l-dialog-image"></div> <div class="l-dialog-content"></div><div class="l-dialog-buttons"><div class="l-dialog-buttons-inner"></div></td><td class="l-dialog-cr"></td></tr><tr><td class="l-dialog-bl"></td><td class="l-dialog-bc"></td><td class="l-dialog-br"></td></tr></tbody></table></div>');
        var zIndex = $('.l-dialog:last').css('z-index');
        $('body').append(g.dialog);
        g.dialog.css('z-index', Number(zIndex) + 10);
        //alert(g.dialog.css('z-index'));


        g.dialog.body = $(".l-dialog-body:first", g.dialog);
        g.dialog.close = function () {
            if (g.dialog.frame) {
                $(g.dialog.frame.document).ready(function () {
                    g.removeWindowMask();
                    g.dialog.remove();
                });
            }
            else {
                g.removeWindowMask();
                g.dialog.remove();
            }
            $('body').unbind('keydown.dialog');
        };
        g.dialog.doShow = function () {
            g.dialog.show();
            if (p.completeFunction)p.completeFunction();
        };
        if (p.allowClose == false) $(".l-dialog-close", g.dialog).remove();
        if (p.target || p.url || p.type == "none") p.type = null;
        if (p.cls) g.dialog.addClass(p.cls);
        if (p.id) g.dialog.attr("id", p.id);

        //设置锁定屏幕、拖动支持 和设置图片
        if (p.modal)
            g.applyWindowMask();
        if (p.isDrag)
            g.applyDrag();
        if (p.isResize)
            g.applyResize();
        if (p.type)
            g.setImage();
        else {
            $(".l-dialog-image", g.dialog).remove();
            $(".l-dialog-content", g.dialog.body).addClass("l-dialog-content-noimage");
        }
        //设置主体内容
        if (p.target) {
            $(".l-dialog-content", g.dialog.body).prepend(p.target);
        }
        else if (p.url) {
            if (p.timeParmName) {
                p.url += p.url.indexOf('?') == -1 ? "?" : "&";
                p.url += p.timeParmName + "=" + new Date().getTime();
            }
            var iframe = $("<iframe frameborder='0'></iframe>");
            var framename = p.name ? p.name : "ligerwindow" + new Date().getTime();
            if (p.scroll) {
                iframe.attr("scrolling", "yes");
            } else {
                iframe.attr("scrolling", "no");
            }
            iframe.attr("name", framename);
            iframe.attr("id", framename);
            $(".l-dialog-content", g.dialog.body).prepend(iframe);
            $(".l-dialog-content", g.dialog.body).addClass("l-dialog-content-nopadding");
            setTimeout(function () {
                iframe.attr("src", p.url);
                g.dialog.frame = window.frames[iframe.attr("name")];
            }, 0);
        }
        else if (p.content) {
            $(".l-dialog-content", g.dialog.body).html(p.content);
            //如果需要内容无padding样式，需要参数isNeedNoPaddingClass为true
            if (p.isNeedNoPaddingClass && typeof(p.isNeedNoPaddingClass) == 'boolean') {
                $(".l-dialog-content", g.dialog.body).addClass("l-dialog-content-nopadding");
            }
        }
        if (p.opener) g.dialog.opener = p.opener;
        //设置按钮
        if (p.buttons) {
            $(p.buttons).each(function (i, item) {
                var btn = $('<div class="l-dialog-btn"><div class="l-dialog-btn-l"></div><div class="l-dialog-btn-r"></div><div class="l-dialog-btn-inner"></div></div>');
                $(".l-dialog-btn-inner", btn).html(item.text);
                $(".l-dialog-buttons-inner", g.dialog.body).prepend(btn);
                item.width && btn.width(item.width);
                item.className && btn.addClass(item.className);
                item.onclick && btn.click(function () {
                    item.onclick(item, g.dialog, i)
                });
            });
        } else {
            $(".l-dialog-buttons", g.dialog).remove();
        }
        $(".l-dialog-buttons-inner", g.dialog).append("<div class='l-clear'></div>");

        //设置参数属性
        p.width && g.dialog.body.width(p.width - 26);
        if (p.height) {
            $(".l-dialog-content", g.dialog.body).height(p.height - 46 - $(".l-dialog-buttons", g.dialog).height());
        }
        p.title = p.title || p.titleMessage;
        p.title && $(".l-dialog-title", g.dialog).html(p.title);
        $(".l-dialog-title", g.dialog).bind("selectstart", function () {
            return false;
        });


        //设置事件
        $(".l-dialog-btn", g.dialog.body).hover(function () {
            $(this).addClass("l-dialog-btn-over");
        }, function () {
            $(this).removeClass("l-dialog-btn-over");
        });
        $(".l-dialog-tc .l-dialog-close", g.dialog).hover(
                function () {
                    $(this).addClass("l-dialog-close-over");
                },
                function () {
                    $(this).removeClass("l-dialog-close-over");
                }).click(function () {
            g.dialog.close();
        });

        //IE6 PNG Fix
        var ie55 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 5.5") != -1);
        var ie6 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 6.0") != -1);
        if ($.browser.msie && (ie55 || ie6)) {
            $(".l-dialog-tl:first", g.dialog).css({
                "background":"none",
                "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + ligerDialogImagePath + "dialog-tl.png',sizingMethod='crop');"
            });
            $(".l-dialog-tc:first", g.dialog).css({
                "background":"none",
                "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + ligerDialogImagePath + "ie6/dialog-tc.png',sizingMethod='crop');"
            });
            $(".l-dialog-tr:first", g.dialog).css({
                "background":"none",
                "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + ligerDialogImagePath + "dialog-tr.png',sizingMethod='crop');"
            });
            $(".l-dialog-cl:first", g.dialog).css({
                "background":"none",
                "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + ligerDialogImagePath + "ie6/dialog-cl.png',sizingMethod='crop');"
            });
            $(".l-dialog-cr:first", g.dialog).css({
                "background":"none",
                "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + ligerDialogImagePath + "ie6/dialog-cr.png',sizingMethod='crop');"
            });
            $(".l-dialog-bl:first", g.dialog).css({
                "background":"none",
                "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + ligerDialogImagePath + "dialog-bl.png',sizingMethod='crop');"
            });
            $(".l-dialog-bc:first", g.dialog).css({
                "background":"none",
                "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + ligerDialogImagePath + "ie6/dialog-bc.png',sizingMethod='crop');"
            });
            $(".l-dialog-br:first", g.dialog).css({
                "background":"none",
                "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + ligerDialogImagePath + "dialog-br.png',sizingMethod='crop');"
            });
        }
        //位置初始化
        var left = 0;
        var top = 0;
        var width = p.width || g.dialog.width();
        if (p.left != null) left = p.left;
        else left = 0.5 * ($(window).width() - width);
        if (p.top != null) top = p.top;
        else top = 0.5 * ($(window).height() - g.dialog.height()) + $(window).scrollTop() - 10;

        g.dialog.css({ left:left, top:top });
        g.dialog.doShow();
        $('#l-dialog').focus();


        $('body').bind('keydown.dialog', function (e) {
            var key = e.which;
            if (key == 13) {
                g.enter();
            }
            else if (key == 27) {
                g.esc();
            }
        });

        return g.dialog;
    };
    $.ligerDialog.close = function () {
        $(".l-dialog,.l-window-mask").remove();
    };
    //增加对话框class，允许自定义对话框样式
    $.ligerDialog.alert = function (content, title, type, className, callback) {
        content = content || "";
        if (typeof (title) == "function") {

            callback = title;
            type = null;
        }
        else if (typeof (type) == "function") {
            callback = type;
        } else if (typeof(className) == "function") {
            callback = className;
        }
        var btnclick = function (item, Dialog, index) {
            Dialog.close();
            if (callback)
                callback(item, Dialog, index);
        };
        p = {
            className:(className && typeof(className) == "string") ? className : $.ligerDefaults.Dialog.className,
            content:content,
            buttons:[
                { text:'确定', onclick:btnclick}
            ]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        if (typeof (type) == "string" && type != "") p.type = type;
        $.ligerDialog.open(p);
    };

    $.ligerDialog.confirm = function (content, title, callback, className, type) {
        var className = (callback && typeof(callback) == "string") ? callback : ((className && typeof(className == 'string')) ? className : $.ligerDefaults.Dialog.className);
        if (typeof (title) == "function") {
            callback = title;
            type = null;
        }
        var btnclick = function (item, Dialog) {
            Dialog.close();
            if (callback) {
                callback(item.type == 'ok');
            }
        };
        p = {
            opacity:$.ligerDialog.defaultProps.opacity,
            className:className,
            type:(type && typeof(type) == "string") ? type : 'question',
            content:content,
            buttons:[
                { text:'是', onclick:btnclick, type:'ok' },
                { text:'否', onclick:btnclick, type:'no'}
            ]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        $.ligerDialog.open(p);
    };

    $.ligerDialog.warning = function (content, title, callback) {
        if (typeof (title) == "function") {
            callback = title;
            type = null;
        }
        var btnclick = function (item, Dialog) {
            Dialog.close();
            if (callback) {
                callback(item.type);
            }
        };
        p = {
            type:'question',
            content:content,
            buttons:[
                { text:'是', onclick:btnclick, type:'yes' },
                { text:'否', onclick:btnclick, type:'no' },
                { text:'取消', onclick:btnclick, type:'cancel'}
            ]
        };
        if (typeof (title) == "string" && title != "") p.title = title;
        $.ligerDialog.open(p);
    };
    $.ligerDialog.waitting = function (title, delayMillions) {
        title = title || $.ligerDefaults.Dialog.waittingMessage;
        $.ligerDialog.open({cls:'l-dialog-waittingdialog', type:'none', content:'<div style="padding:4px">' + title + '</div>', allowClose:false});
        setTimeout($.ligerDialog.closeWaitting, delayMillions ? delayMillions : 2000);
    };
    $.ligerDialog.closeWaitting = function () {
        $(".l-dialog-waittingdialog,.l-window-mask:last").remove();
    };
    $.ligerDialog.success = function (content, title, className, onBtnClick) {
        $.ligerDialog.alert(content, title, 'success', className, onBtnClick);
    };
    $.ligerDialog.error = function (content, title, className, onBtnClick) {
        $.ligerDialog.alert(content, title, 'error', className, onBtnClick);
    };
    $.ligerDialog.warn = function (content, title, className, onBtnClick) {
        $.ligerDialog.alert(content, title, 'warn', className, onBtnClick);
    };
    $.ligerDialog.question = function (content, title, className) {
        $.ligerDialog.alert(content, title, 'question', className);
    };


    $.ligerDialog.prompt = function (title, value, multi, callback) {
        var target = $('<input type="text" class="l-dialog-inputtext"/>');
        if (typeof(multi) == "function") {
            callback = multi;
        }
        if (typeof (value) == "function") {
            callback = value;
        }
        else if (typeof (value) == "boolean") {
            multi = value;
        }
        if (typeof(multi) == "boolean" && multi) {
            target = $('<textarea class="l-dialog-textarea"></textarea>');
        }
        if (typeof (value) == "string" || typeof (value) == "int") {
            target.val(value);
        }
        var btnclick = function (item, Dialog, index) {
            Dialog.close();
            if (callback) {
                callback(item.type == 'yes', target.val());
            }
        }
        p = {
            title:title,
            target:target,
            width:320,
            buttons:[
                { text:'确定', onclick:btnclick, type:'yes' },
                { text:'取消', onclick:btnclick, type:'cancel'}
            ]
        };
        $.ligerDialog.open(p);
    };

    /*******************************************************************************************************************/
    /*********************************************对话框新扩展函数********************************************/
    /*******************************************************************************************************************/

    /*dialog默认属性配置*/
    $.ligerDialog.defaultProps = {
        opacity:0.5, //默认遮罩透明度
        backColor:'#ffffd7', //确认删除淡出效果容器背景色
        delay:1000, //消失默认时间
        borderWidth:1, //边框宽度
        borderStyle:'solid', //边框样式
        borderColor:'#ccc', //边框颜色
        tips:'操作成功！', //默认提示值
        content:'确定要删除吗？', //默认提示内容
        btnSure:'确定', //确定按钮默认值
        btnCancel:'取消', //取消按钮默认值
        formUrl:null, //表单地址
        submitUrl:null, //表单响应地址
        redirectUrl:null, //处理后转向地址
        formId:'form1', //表单Id
        isNeedFormValid:true //是否需要表单验证，默认为true
    };

    /**
     * 确认删除框
     * @param content   提示内容
     * @param title     标题
     * @param elObj     要删除记录的dom对象,必要参数
     * @param showAlert 是否用弹出框提示返回内容 showAlert==true:弹出框提示,false:页面提示；
     * @param showIconType 指定提示图标类型，默认为question，
     * @param disBackColor 提示消失的背景色
     * @param tips 可以指定删除完后的显示内容文字
     * @param contentUrl 提示内容可以是一个url地址展示
     */
    $.ligerDialog.confirmDelete = function (p) {
        //需要用临时变量将p暂存下来
        var cp = $.extend({}, $.ligerDefaults.Dialog, $.ligerDefaults.DialogString, p || {});
        var elObj = $(cp.elObj);
        var btnclick = function (item, Dialog) {
            Dialog.close();//关闭提示框
            if (elObj && item.type == 'ok') {
                var returnValue;
                $.ajax({
                    type:'post',
                    //如果元素dom配置了url属性，则提交地址直接去找元素dom的url属性配置，否则去找传递的submitUrl,如果都没提供，则找系统默认配置
                    url:elObj.attr('url') ? elObj.attr('url') : (cp.submitUrl ? cp.submitUrl : $.ligerDialog.defaultProps.submitUrl), //获取提交url
                    data:elObj.attr('data') ? elObj.attr('data') : '', //获取提交数据
                    success:function (ret) {
                        var tip_style = 'padding:5px;background:' + (cp.disBackColor ? cp.disBackColor : $.ligerDialog.defaultProps.backColor) + ';border:' + (cp.borderWidth ? cp.borderWidth : $.ligerDialog.defaultProps.borderWidth) + 'px ' + (cp.borderStyle ? cp.borderStyle : $.ligerDialog.defaultProps.borderStyle) + ' ' + (cp.borderColor ? cp.borderColor : $.ligerDialog.defaultProps.borderColor);
                        returnValue = $.trim(ret);
                        try {
                            returnValue = eval('(' + returnValue + ')'); //json模式；
                            if (returnValue.status == 1) {
                                if (cp.showAlert)
                                    $.ligerDialog.alert(cp.tips ? cp.tips : $.ligerDialog.defaultProps.tips, '提示', 'success', function () {
                                        /*elObj.html("<div style='" + tip_style + "'>" + (cp.tips ? cp.tips : $.ligerDialog.defaultProps.tips) + "</div>");
                                         //elObj.fadeOut(cp.delayMillions?cp.delayMillions:$.ligerDialog.defaultProps.delay);
                                         elObj.hide();*/
                                        if (cp.completeFunction)cp.completeFunction();
                                    });

                                else {
                                    elObj.html("<div style='" + tip_style + "'>" + (cp.tips ? cp.tips : $.ligerDialog.defaultProps.tips) + "</div>");
                                    elObj.fadeOut(cp.delayMillions ? cp.delayMillions : $.ligerDialog.defaultProps.delay);
                                }
                            } else {
                                $.ligerDialog.alert(returnValue.msg, '提示', 'warn');
                            }
                        } catch (e) {  //非json模式
                            //elObj.html(returnValue);
                        }
                    },
                    error:function (ret, status) {
                        if (status == 'error')
                            $.ligerDialog.alert('出错啦！', '出错提示', 'warn');
                    }
                });
            }
        };
        var content = cp.content ? cp.content : $.ligerDialog.defaultProps.content;
        if (cp.contentUrl) {//指定了提示内容url
            content = "<iframe frameborder='0' src='" + cp.contentUrl + "' width='100%' height='100%'></iframe>";
        }
        p = {
            type:(cp.showIconType && typeof(cp.showIconType) == "string") ? cp.showIconType : "question",
            content:content,
            width:cp.width ? cp.width : 280,
            height:cp.height ? cp.height : null,
            buttons:[
                { text:'是', onclick:btnclick, type:'ok' },
                { text:'否', onclick:btnclick, type:'no'}
            ]
        };
        if (typeof (cp.title) == "string" && cp.title != "") p.title = cp.title;
        $.ligerDialog.open(p);
    };
    /**
     * ajax提交表单封装；formAddr,formId,formAction
     * @param p{title:标题,formUrl:表单地址,formId:表单Id,submitUrl:表单提交action,isFormReset:表单是否重置,redirectUrl:成功重定向地址}
     */
    $.ligerDialog.ajaxFormSubmit = function (p) {
        var p = p;
        if (p.opacity != "undefined") {
            $.ligerDefaults.Dialog.opacity = p.opacity;
        } else {
            $.ligerDefaults.Dialog.opacity = $.ligerDefaults.DialogString.opacity;
        }

        $.ligerDialog.open({
            className:p.className ? p.className : $.ligerDefaults.Dialog.className,
            title:p.title ? p.title : '提示',
            url:p.formUrl ? p.formUrl : $.ligerDialog.defaultProps.formUrl,
            width:p.width ? p.width : $.ligerDefaults.Dialog.width,
            height:p.height ? p.height : $.ligerDefaults.Dialog.height,
            scroll:p.scroll ? p.scroll : false,
            buttons:[
                {
                    text:p.btnSure ? p.btnSure : $.ligerDialog.defaultProps.btnSure,
                    className:'l-button-yes',
                    onclick:function (item, dg) {
                        var submitButton = $(".l-dialog-btn:last", dg);
                        if (submitButton.hasClass("l-dialog-btn-disable")) {
                            return;
                        }
                        //提交之前执行的函数，回调2个参数。一个是当前参数对象p，一个是当前弹出的对话框对象
                        if (p.beforeSubmit && typeof(p.beforeSubmit) == "function") {
                            if (p.beforeSubmit(p, dg) == false) {
                                return false;
                            }
                        }
                        var formObj = $(dg.frame.document).find("#" + (p.formId ? p.formId : $.ligerDialog.defaultProps.formId));
                        var returnValue;
                        if (formObj) {
                            //判断是否需要表单验证
                            var isNeedFormValid = (p.isNeedFormValid != "undefined" && typeof(p.isNeedFormValid) == "boolean") ? p.isNeedFormValid : $.ligerDialog.defaultProps.isNeedFormValid;
                            //表单验证
                            var isValid = true;
                            if (isNeedFormValid)
                                isValid = dg.frame.$.validationEngine.doValidate("#" + p.formId);
                            if (isValid) {
                                //提交按钮变灰
                                submitButton.addClass("l-dialog-btn-disable");
                                $(".l-dialog-btn-inner", submitButton).html("提交中...");

                                formObj.ajaxSubmit({
                                    type:'post',
                                    url:p.submitUrl ? p.submitUrl : $.ligerDialog.defaultProps.submitUrl,
                                    resetForm:p.isFormReset ? p.isFormReset : false,
                                    data:p.data ? p.data : '',
                                    success:function (ret) {
                                        submitButton.removeClass("l-dialog-btn-disable");
                                        $(".l-dialog-btn-inner", submitButton).html(p.btnSure ? p.btnSure : $.ligerDialog.defaultProps.btnSure);
                                        try { //返回json数据
                                            returnValue = $.util.decode(ret);
                                            var msg = (returnValue.msg && returnValue.msg != null) ? returnValue.msg : (returnValue.status == 1 ? '保存成功！' : '保存失败！');
                                            if (!p.submitSuccessFunc) {
                                                if (returnValue.status == 1) {
                                                    if (p.redirectUrl) {
                                                        $.ligerDialog.alert(msg, '提示', 'success', function () {
                                                            if (p.tabObj) {//如果指定了tab对象
                                                                p.tabObj.location(p.tabObj.getSelectedTabItemID(), p.redirectUrl);
                                                            } else {
                                                                top.location = p.redirectUrl;
                                                            }
                                                        });
                                                    } else {
                                                        dg.close();
                                                        $.ligerDialog.alert(msg, '提示', 'success', function () {
                                                            if (p.tabObj) {
                                                                p.tabObj.reload(p.tabObj.getSelectedTabItemID());
                                                            }
                                                        });
                                                    }
                                                } else if (returnValue.status == 0) {
                                                    $.ligerDialog.error(msg);
                                                } else {
                                                    $.ligerDialog.warn(msg);
                                                }
                                            } else {
                                                if (typeof(p.submitSuccessFunc) == 'function')
                                                    p.submitSuccessFunc(returnValue, dg);
                                            }
                                        } catch (e) {
                                            alert('解析错误' + e.description);
                                        }
                                    }, error:function (ret, status) {
                                        $.ligerDialog.error('错误！可能原因：参数配置错误、响应出现异常。');
                                    }
                                });
                            }
                        } else $.ligerDialog.warn('表单不存在！');
                    }
                },
                {
                    text:p.btnCancel ? p.btnCancel : $.ligerDialog.defaultProps.btnCancel,
                    onclick:function (item, dg) {
                        dg.close();
                    }
                }
            ]
        });
    }

    /**
     * 非表单提交的ajax处理，主要用于简单交互异步处理,比如只更新一个记录的一个状态等等..
     * （待完善）
     * @param p
     */
    $.ligerDialog.ajaxRequest = function (p) {
        var p = p;
        if (!p.showDialog) {//不显示确认对话框直接处理
            $.ajax({
                type:'post',
                url:p.submitUrl ? p.submitUrl : $.ligerDialog.defaultProps.submitUrl,
                data:p.data ? p.data : null,
                success:function (ret) {
                    if (!p.successFunc) {

                    } else {
                        if (typeof(p.successFunc) == 'function') {

                        }
                    }
                }
            });
        } else {
            $.ligerDialog.open({
                title:p.title ? p.title : '确定要执行？'
            });
        }

    }

    /**
     * 提交评论
     * @param p{contentId:文本框(textarea)Id,url:提交地址,parentElement:父容器对象}
     */
    $.ligerDialog.postComment = function (p) {
        var cms_list = "cms_list";//定义列表list标记
        var p = p;
        if (!p.contentId || !p.url)return;
        var content = $("#" + p.contentId).val();
        if (!content && '' == content) {
            $('#' + p.contentId).focus();
            return;
        }
        var returnValue;
        $.ajax({
            type:'post',
            url:p.url ? p.url : '',
            data:p.data ? p.data : '',
            success:function (ret) {
                returnValue = $.trim(ret);
                try {
                    returnValue = eval('(' + returnValue + ')');
                    if (returnValue.status == 1) {
                        $.ligerDialog.alert(returnValue.msg, '提示', 'success', function () {
                            $("#" + p.contentId).val('');//置空
                            var first_li = $("#" + p.parentElement + " ." + cms_list + " li").first();
                            $("#" + p.parentElement + " ." + cms_list + " li").first().before(returnValue.htmlStr);
                            $("#" + p.parentElement + " ." + cms_list + " li").first().hide();
                            $("#" + p.parentElement + " ." + cms_list + " li").first().fadeIn(1000);
                        });
                    }
                } catch (e) {
                    //
                }
            }, error:function (ret, status) {
                alert(status);
            }
        });

    }
    $.ligerDialog.submit = function (formId, submitUrl, dialog, p) {
        var returnValue;
        //提交之前执行的函数，回调2个参数。一个是当前参数对象p，一个是当前弹出的对话框对象
        if (p && p.beforeSubmit && typeof(p.beforeSubmit) == "function") {
            if (p.beforeSubmit() == false) {
                return false;
            }
        }
        $(dialog.frame.document).find("#" + formId).ajaxSubmit({
            type:'post',
            url:submitUrl,              //获取提交url
            success:function(ret) {
                returnValue = $.trim(ret);
                try {
                    returnValue = eval('(' + returnValue + ')'); //json模式；
                    var msg = (returnValue.msg && returnValue.msg != null) ? returnValue.msg : (returnValue.status == 1 ? '保存成功！' : '保存失败！');
                    if (returnValue.status == 1) {
                        top.$.ligerDialog.alert(msg, '提示', 'success', function() {
                            //refresh11();
                        });
                    } else {
                        top.$.ligerDialog.alert(msg, '提示', 'error');
                    }
                } catch(e) {  //非json模式
                    //elObj.html(returnValue);
                }
            },
            error:function(ret, status) {
                if (status == 'error')
                    $.ligerDialog.alert('出错啦！', '出错提示', 'warn');
            }
        });
    }
    window.dialog = $.ligerDialog;//简化前台调用

})(jQuery);