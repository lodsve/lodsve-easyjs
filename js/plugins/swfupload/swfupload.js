/**
 * 封装SWFupload,上传组件
 * User: sunhao
 * Date: 12-07-16
 * Time: 下午11:23
 * @author sunhao(sunhao.java@gmail.com)
 */
(function($){
    //定义$.swfupload
    $.swfupload = $.swfupload || {};

    //上传时所需的参数默认值
    $.swfupload.defaults = {
        title: '上传文件',                                                                   //弹框显示的标题
        uploadUrl: easyloader.URI + '/upload/upload.do',                                 //上传路径，不能为空
        close: true,                                                                         //右上角是否有关闭图标，默认是true
        modal: true,                                                                         //背景是否被灰化
        draggable: true,                                                                    //窗口是否能被移动
        fileTypeDescription: '请选择附件',                                                 //文件选择对话框的描述
        fileTypes: '*.*',                                                                   //文件类型限制，多个用半角分号隔开，如*.doc;*.jpg
        fileSizeLimit: 100 * 1024 * 1024,                                                   //单个文件大小上限，默认100M
        totalUploadSize: 1024 * 1024 * 1024,                                                //总共文件上传大小上限,默认1G
        completeFunction: 'attachUploadComplete',                                        //上传结束后执行的函数
        params: {},                                                                          //额外参数
        width: 630,                                                                          //弹框宽
        height: 450,                                                                         //弹框高
        closeAll: true,                                                                      //是否关闭全部弹窗，默认是
        canDeleteAfterUpload: true,                                                          //上传之后是否可以删除
        canDownloadAfterUpload: true                                                          //上传之后是否可以下载
    }

    $.swfupload.uploadDialog = $.swfupload.uploadDialog || null;

    $.fn.swfupload = function(element, p){
        this.each(function(){
            p = $.extend({}, $.swfupload.defaults, p || {});
            top.$.swfupload.resources = {
                'element': element,
                'resourceId': p.params.resourceId,
                'resourceType': p.params.resourceType,
                'uploadId': p.params.uploadId,
                'closeAll': p.closeAll,
                canDeleteAfterUpload: p.canDeleteAfterUpload,
                canDownloadAfterUpload: p.canDownloadAfterUpload
            }
            var f = {
                bodyHtml: function(){
                    var _bodyHtml = "";
                    var maxUploadSizeString = "<div class=\"uploadTips\">提示信息:可上传的单个文件最大尺寸为：1G</div>";
                    _bodyHtml += "<div name=\"upcontent\" id=\"flashContent\" style=\"display:block;overflow:hidden;height:350px;\">"
                                + f.flashHtml() + "</div>" + maxUploadSizeString;
                    _bodyHtml += "<div name=\"upcontent\" id=\"templateContent\" style=\"display:none;height:400px;overflow-y: scroll;\"></div>";
                    return _bodyHtml;
                }, flashHtml: function(){
                    var _flashHtml = new Array();
                    _flashHtml.push("<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\"");
                    _flashHtml.push("codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0\"");
                    _flashHtml.push("	width=\"100%\" height=\"100%\" id=\"file\" align=\"middle\">");
                    _flashHtml.push("	<param name=\"allowScriptAccess\" value=\"sameDomain\" />");
                    _flashHtml.push("	<param name=\"movie\" value=\"" + easyloader.base + "/js/swfupload/FlashFileUpload.swf?ver=123484\" />");
                    _flashHtml.push("   <param name=\"quality\" value=\"high\" />");
                    _flashHtml.push("	<param name=\"wmode\" value=\"transparent\">");
                    var flashVars = "&fileTypeDescription=" + encodeURIComponent(p.fileTypeDescription) +
                            "&fileTypes=" + encodeURIComponent(p.fileTypes) +
                            "&fileSizeLimit=" + encodeURIComponent(p.fileSizeLimit) +
                            "&totalUploadSize=" + encodeURIComponent(p.totalUploadSize) +
                            "&completeFunction=" + encodeURIComponent(p.completeFunction);
                    flashVars = f.getSubmitUrl() + flashVars;
                    _flashHtml.push("    <param name=\"FlashVars\" value='" + flashVars + "'>");
                    _flashHtml.push("    <embed src=\"" + easyloader.base + "/swfupload/FlashFileUpload.swf?ver=123484\" " +
                            "FlashVars='" + flashVars + "'");
                    _flashHtml.push(" quality=\"high\" wmode=\"transparent\" width=\"100%\" height=\"100%\" name=\"file\"");
                    _flashHtml.push(" align=\"middle\" allowscriptaccess=\"sameDomain\" type=\"application/x-shockwave-flash\"");
                    _flashHtml.push(" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" />");
                    _flashHtml.push("</object>");
                    return _flashHtml.join("");
                }, getSubmitUrl: function(){
                    var page = "uploadPage=" + p.uploadUrl;
                    var _p = p.params;
                    page += "%3FuserId=" + (_p.userId ? _p.userId : -1);
                    page += "%26headImage=" + (_p.headImage ? _p.headImage : 'false');
                    page += "%26resourceId=" + (_p.resourceId ? _p.resourceId : -1);
                    page += "%26resourceType=" + (_p.resourceType ? _p.resourceType : -1);
                    page += "%26uploadId=" + (_p.uploadId ? _p.uploadId : -1);
                    return page;
                }, show: function(){
                    $.swfupload.uploadDialog = 
                    top.$.ligerDialog.open({
                        title: p.title,
                        content: f.bodyHtml(),
                        width: p.width,
                        height: p.height,
                        allowClose: p.allowClose,
                        isDrag: p.draggable,
                        modal: p.modal,
                        buttons: [
                            {text: '关闭', onclick: function(item, dialog){
                                dialog.close();
                            }}
                        ]
                    });
                }
            }

            // 创建一个IMG元素，并放在input之前
            var img = $("<img src=\"" + easyloader.URI + "/js/easyjs/skins/icons/plus-gray.png\" class=\"plus-icon\"/>");
            $(this).before(img);
            $(this).addClass("btn-input");

            // 鼠标悬浮在按钮上，出现悬浮的样式
            $(this).mouseover(function(){
                $(this).addClass("btn-hover");
            });

            // 鼠标移出按钮，消失悬浮的样式
            $(this).mouseout(function(){
                $(this).removeClass("btn-hover");
            });

            $(this).click(function(){
                f.show();
            });
        })
    }

})(jQuery)

/**
 * 当上传结束的时候执行的方法
 * 
 * @param x         swfupload上传结束flash回传的参数
 */
function attachUploadComplete(x){
    var res = top.$.swfupload.resources;
    var element = res.element;

    if('string' == typeof element){
        element = $('#' + element);
    }
    showAttachments(element, res, res.canDeleteAfterUpload, res.canDownloadAfterUpload);
    // 提示信息
    if(x) {
        x = eval("(" + x + ")");
    }else{
        x = {};
    }

    var files = x.totalFiles,size = x.totalSize;
    var style = 'margin: 10px 10px 0 0;font-weight: bold;padding: 0 10px;';
    var style2 = 'background: none repeat scroll 0 0 #2782D6;height: 20px;margin: 10px 10px 0;';
    var tipMsg = "<div style='" + style2 + "'></div>" +
            "<p style='" + style + "'>已经上传100%，成功上传 " + files + " 个文件,共" + size + "</p>";

    $.ligerDialog.open({
        title : '上传成功',
        content : tipMsg,
        width : 460,
        height : 150,
        buttons: [
            {text: '继续上传', onclick: function(item, dialog){
                dialog.close();
            }},
            {text: '结束上传', onclick: function(item, dialog){
                dialog.close();
                $.swfupload.uploadDialog.close();
            }}
        ]
    });
}

/**
 * 展现总共上传了哪些附件
 *
 * @param element
 * @param res           参数
 * @param canDelete     是否只是显示，即不进行删除操作，true可以删除；false不可以删除
 * @param download
 */
function showAttachments(element, res, canDelete, download){
    var resourceId = res.resourceId, resourceType = res.resourceType, uploadId = res.uploadId;
    var action = easyloader.URI + "/upload/showUploads.do?resourceId=" + resourceId +
            "&resourceType=" + resourceType + "&uploadId=" + uploadId;

    if(!resourceId)
        return;

    $.ajax({
        type: 'GET',
        url: action,
        data: '',
        dataType: 'json',
        success: function(o){
            var uploadFiles = o.files;
            try {
                if (o.status == 1) {
                    //不管是否有附件，都显示外面的框
                    //if(uploadFiles && uploadFiles.length > 0){
                        var innerHTML = createShowHTML(uploadFiles, canDelete, download);
                        element.html(innerHTML);
                        //往div中写入html后，为每个删除按钮绑定上confirm的函数
                        for(var i = 0; i < uploadFiles.length; i++){
                            $("#delConfirm" + uploadFiles[i].pkId).confirm({
                                confirmMessage: '元素',
                                isFormatMessage: true,
                                removeElement: $('#file' + uploadFiles[i].pkId)
                            });
                        }
                        //判断是否是ie浏览器
                        if(jQuery.browser.msie){
                            $("span.delete").css({"right":"25px"});
                        }
                    //}
                }
            } catch (e) {//非json模式
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            
        }
    });
}

/**
 * 创建展示的html
 *
 * @param uploadFiles       上传文件的json数据
 * @param canDelete         是否只是显示，即不进行删除操作，true可以删除；false不可以删除
 * @param download          是否可以下载
 */
function createShowHTML(uploadFiles, canDelete, download){
    var innerHtml = [];
    innerHtml.push('<div class=\"post-attachments-div\">');
    innerHtml.push('    <div class=\"post-attachments-title\">附件：</div>');
    innerHtml.push('    <div class=\"post-attachments-files\">');

    var r = {
        attachments: uploadFiles,
        canDelete: canDelete,
        download: download
    };
    var template = $.util.from('displayAttachments');
    var html = template.process(r);
    innerHtml.push(html);

    innerHtml.push("</div></div>");
    return innerHtml.join("");
}

/**
 * 删除文件的方法
 * 
 * @param pkId      附件对象的pkId
 */
function deleteFile(pkId){
    $.ligerDialog.open({
        title: '提示',
        content: '你确定要删除选中的文件吗？',
        buttons: [
            {text: '确定', onclick: function(item, dialog){
                var action = easyloader.URI + "/upload/delete.do?fileId=" + pkId;
                $.ajax({
                    type: 'GET',
                    url: action,
                    data: '',
                    dataType: 'json',
                    success: function(o){
                        dialog.close();
                        try {
                            if(o.status == 1){
                                $("#file" + pkId).hide();
                                showTip('suc', pkId);
                            } else {
                                showTip('err', pkId);
                            }
                        } catch(e){

                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        
                    }
                });
            }},
            {text: '取消', onclick: function(item, dialog){
                dialog.close();
            }}
        ]
    });
}

/**
 * 显示提示信息
 * 
 * @param type      suc:成功信息;err:失败信息
 * @param pkId      附件pkId
 */
function showTip(type, pkId){
    var sucTip = window.document.createElement('span');
    sucTip.id = 'tip' + pkId;
    sucTip.innerHTML = type == 'suc' ? '删除成功' : '删除失败';
    sucTip.className = type == 'suc' ? 'sucTip' : 'errTip';
    $("#file" + pkId).before(sucTip);
    setTimeout(function() {
        $('#tip' + pkId).hide();
    }, 500);
}

(function($){
    //定义$.showAttachments
    $.showAttachments = $.showAttachments || {};

    //显示上传附件时所需的参数默认值
    $.showAttachments.defaults = {
        resourceId: '',                         //资源ID
        resourceType: '',                       //资源类型
        uploadId: '',                           //上传者ID
        canDelete: false,                        //是否可以删除
        canDownload: true                       //是否可以下载
    }

    $.fn.showAttachments = function(p){
        this.each(function(){
            var element = $(this);
            p = $.extend({}, $.showAttachments.defaults, p || {});

            var g = {
                show: function(p){
                    showAttachments(element, p, p.canDelete, p.canDownload);
                }
            }

            g.show(p);
        });
    }
})(jQuery);