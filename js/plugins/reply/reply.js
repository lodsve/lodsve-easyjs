/**
 * 回复组件.
 *
 * User: sunhao
 * Date: 12-9-3
 * Time: 下午9:20
 * @author sunhao(sunhao.java@gmail.com)
 */
(function($){
    //定义回复组件
    $.simpleReply = $.simpleReply || {};
    $.display = $.display || {};
    $.displayPanel = $.displayPanel || {};

    //回复组件的默认参数
    $.simpleReply.defaults = {
        submitUrl: '/reply/reply.do',             //提交浏览的地址
        title: '',                                  //回复标题
        content: '',                                //回复内容
        resourceId: null,                          //资源ID
        resourceType: null,                        //资源类型
        success: null,                              //回复成功执行的函数
        error: null                                 //回复失败执行的函数
    }

    //组件展示回复的默认参数
    $.display.defaultsDisply = {
        submitUrl: '/reply.do',                   //获取留言的地址
        resourceId: null,                          //资源ID
        resourceType: null,                       //资源类型
        width: '100%',                             //组件宽度,默认100%,填写字符串'100%' or '100px',如果填写数字,则认为单位是px
        isDelete: false,                           //是否是创建者使用展示回复,默认false
        delUrl: '/reply/delete.do',                 //删除留言的地址
        success: null,                              //删除成功函数
        error: null                                 //删除失败函数
    }

    //回复组件的默认参数
    $.displayPanel.defaultReply = {
        submitUrl: '/reply/reply.do',             //提交浏览的地址
        title: false,                               //是否显示回复标题
        width: '100%',                              //组件宽度
        resourceId: null,                           //资源ID
        resourceType: null,                         //资源类型
        success: null,                              //回复成功执行的函数
        error: null                                 //回复失败执行的函数
    }

    $.extend({
        utils: {
            reply: function(p){
                p = $.extend({}, $.simpleReply.defaults, p || {});

                var f = {
                    validate: function(){
                        if(!p.content || $.trim(p.content) == ''){
                            //回复内容为空
                            alert('回复内容不能为空!');
                            return false;
                        }
                        if(!p.resourceId || !p.resourceType){
                            //资源ID为空,资源类型为空
                            alert('参数不正确!');
                            return false;
                        }
                        return true;
                    },
                    replyRequest: function(){
                        var action = easyloader.URI + p.submitUrl;
                        var data = 'resourceId=' + p.resourceId + '&resourceType=' + p.resourceType + '&title=' + p.title +
                                        '&content=' + p.content;
                        $.ajax({
                            url: action,
                            type: 'post',
                            dataType: 'json',
                            data: data,
                            success: function(o){
                                if(o.status == '1'){
                                    if(p.success)
                                        return p.success(o.replyId);
                                    else
                                        alert('发表回复成功');
                                } else {
                                    if(p.error)
                                        return p.error(o.replyId);
                                    else
                                         alert('发表回复失败');
                                }
                            },
                            error: function(o){
                                alert('系统error!');
                            }
                        });
                    }
                }

                if(f.validate()){
                    f.replyRequest();
                }
            }
        }
    });

    $.fn.displayReply = function(p){
        this.each(function(){
            p = $.extend({}, $.display.defaultsDisply, p || {});
            var element = $(this);
            var tagName = this.tagName.toLowerCase();

            var f = {
                validate: function(){
                    if(!p.resourceId || !p.resourceType){
                        alert('参数配置错误!');
                        return false;
                    }
                    if(tagName != 'div'){
                        alert('展示回复的容器必须为DIV');
                        return false;
                    }

                    return true;
                },
                display: function(){
                    var width = p.width;
                    if(typeof(width) == 'number')
                        width = p.width + 'px'

                    var action = easyloader.URI + p.submitUrl;
                    var data = 'resourceId=' + p.resourceId + '&resourceType=' + p.resourceType;
                    
                    $.ajax({
                        url: action,
                        type: 'post',
                        dataType: 'json',
                        data: data,
                        success: function(o){
                            var reply = o.reply.items;
                            if(reply && reply.length > 0){
                                var r = {
                                    reply: reply,
                                    isDelete : p.isDelete,
                                    width: width
                                };

                                var template = $.util.from('displayReply');
                                var html = template.process(r);

                                if(element){
                                    element.html(html);
                                    f.addEvent();
                                }
                            }
                        },
                        error: function(o){
                            alert('网络错误,请稍后重试!');
                        }
                    });
                },
                addEvent: function(){
                    var deleteLinks = $(document).find('a.deleteLink');
                    deleteLinks.each(function(){
                        $(this).bind('click', function(){
                            f.deleteReply(this);
                        });
                    });
                },
                deleteReply: function(link){
                    var requestURL = easyloader.URI + p.delUrl + '?replyId=' + $(link).attr('replyId');
                    var flag = window.confirm($.util.getMessage('reply.delete.confirm'));
                    if(!flag)
                        return;

                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: requestURL,
                        success: function(o){
                            if(o.status == '1'){
                                //成功
                                if(p.success)
                                    return p.success();
                                else{
                                    var reply = $('#replyLi' + $(link).attr('replyId'));
                                    reply.fadeOut('slow');
                                }
                            } else {
                                //失败
                                if(p.error)
                                    return p.error();
                                else{
                                    alert('删除失败!');
                                }
                            }
                        },
                        error: function(){
                            alert('错误！可能原因：参数配置错误、响应出现异常。');
                        }
                    });
                }
            }

            if(f.validate()){
                f.display();
            }
        });
    }

    $.fn.reply = function(p){
        this.each(function(){
            p = $.extend({}, $.displayPanel.defaultReply, p || {});
            var element = $(this);
            var tagName = this.tagName.toLowerCase();
            
            var f = {
                validate: function(){
                    if(!p.resourceId || !p.resourceType){
                        alert('参数配置错误!');
                        return false;
                    }
                    if(tagName != 'div'){
                        alert('回复组件的容器必须为DIV');
                        return false;
                    }

                    return true;
                },
                show: function(){
                    var width = p.width;
                    if(typeof(width) == 'number')
                        width = p.width + 'px'

                    var r = {
                        title: p.title,
                        width: width
                    };

                    var template = $.util.from('toReply');
                    var html = template.process(r);

                    if(element)
                        element.html(html);
                },
                addEvent: function(){
                    var replyBtn = $('#replyBtn');
                    var action = easyloader.URI + p.submitUrl + '?resourceId=' + p.resourceId + '&resourceType=' +
                            p.resourceType;
                    replyBtn.bind('click', function(){
                        var formObject = $('#reply-form');
                        if(formObject){
                            var flag = Validator.Validate(formObject[0], 3);
                            if(flag){
                                formObject.ajaxSubmit({
                                    type: 'post',
                                    url: action,
                                    resetForm: true,
                                    dataType: 'json',
                                    success: function(o){
                                        if(o.status == '1'){
                                            if(p.success)
                                                return p.success(o.replyId);
                                            else
                                                alert('发表回复成功');
                                        } else {
                                            if(p.error)
                                                return p.error(o.replyId);
                                            else
                                                 alert('发表回复失败');
                                        }
                                    },
                                    error: function(o){
                                        alert('错误！可能原因：参数配置错误、响应出现异常。');
                                    }
                                });
                            }
                        }
                    })
                }
            }

            if(f.validate()){
                f.show();
                f.addEvent();
            }
        });
    }
})(jQuery)