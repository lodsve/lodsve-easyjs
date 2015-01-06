/**
 * 提示信息.
 *
 * User: sunhao
 * Date: 13-4-29
 * Time: 上午5:22
 *
 * @author sunhao(sunhao.java@gmail.com)
 */
(function($){
    //定义整个msgbox对象
    $.msgbox = $.msgbox || {};

    //定义默认属性值
    $.msgbox.defaults = {
        icon: 'ok',                 //图标(ok:成功信息,no:错误信息,warn:警告,clear:什么都没有)
        i18n: false,                //是否使用国际化:如果是,message指定为code,否则message为要显示的值
        message: '',                //同上
        modal: false,               //是否是模态的
        closeOnDblclick: true,      //双击模态背景时隐藏
        closeOnEsc: true,           //按Esc键时隐藏
        timeOut: 3000,              //多长时间之后消失
        beforeHide: null,           //消失前执行的方法
        afterHide: null             //消失前执行的方法
    }

    $.msgbox.show = function(p){
        p = $.extend({}, $.msgbox.defaults, p || {});

        var f = {
            show: function(){
                var msgbox;
                var isFirst = true;        //是否是第一次显示
                if($('.msgbox_layout_wrap').length > 0){
                    msgbox = $('.msgbox_layout_wrap')[0];
                    isFirst = false;
                } else {
                    msgbox = $(f.getHtml());
                }
                //设置top
                $('.msgbox_layout_wrap', msgbox).css('top', f.getTop() + 'px');
                //设置文本
                f.setText(f.getMessage(), msgbox);
                //设置图标
                f.setIcon(f.getStyle(), msgbox);
                //添加事件
                f.addEvent();

                //显示
                f.render(msgbox, isFirst);
            },
            getMessage: function(){
                if(p.i18n){
                    var message_ = $.util.getMessage(p.message);
                    if(!message_ || "" == message_)
                        message_ = p.message;

                    return message_;
                }
                return p.message;
            },
            getStyle: function(){
                var class_;
                if(p.icon != 'ok' && p.icon != 'no' && p.icon != 'warn' && p.icon != 'clear'){
                    class_ = "icon_clear";
                } else {
                    class_ = "icon_" + p.icon;
                }

                return class_;
            },
            getHtml: function(){
                var html = [];
                html.push('<div class="msgbox_layout_wrap" id="m_mgbox" style="">');
                html.push('     <span class="msgbox_layout" style="z-index: 10000;">');
                html.push('         <span class="" id="iconSpan"></span>');
                html.push('         <span id="txtPan"></span>');
                html.push('         <span class="icon_end"></span>');
                html.push('     </span>');
                html.push('</div>');

                return html.join("");
            },
            getTop: function(){
                //可视区域高度
                var viewHeight = $(window).height();
                return viewHeight - 27;
            },
            setText: function(text, msgbox){
                var icon = $('#txtPan', $(msgbox));
                icon.html(text);
            },
            setIcon: function(iconStyle, msgbox){
                var icon = $('#iconSpan', $(msgbox));
                var className = icon.attr('class');
                icon.removeClass(className);
                icon.addClass(iconStyle);
            },
            addEvent: function(){
                f.inerval = setInterval(function () {
                    f.closeBox();
                }, p.timeOut);
            },
            removeModal: function(){
                $('div.l-window-mask:last').remove();
            },
            closeBox: function(){
                if(p.beforeHide){
                    p.beforeHide();
                }
                $('#m_mgbox').hide();
                f.removeModal();
                if(p.afterHide){
                    p.afterHide();
                }

                f.cleanEvent();
            },
            cleanEvent: function(){
                if(f.inerval)
                    clearInterval(f.inerval);
                if(p.closeOnEsc)
                    //hotkeys将jquery的bind和unbind事件劫持了，所以bind选择hotkeys的，unbind也需要这样使用
                    //obj.bind('keydown', 'esc', function); //绑定
                    //obj.unbind('keydown, 'esc');          //解绑
                    jQuery(document).unbind('keydown', 'esc');
            },
            render: function(msgbox, isFirst){
                //构建模态背景
                if(p.modal){
                    f.modal = $('<div class="l-window-mask" style="display: block;opacity: 0.5;"></div>');
                    f.modal.height($(document).height());
                    f.modal.width($(window).width());
                    $('body').append(f.modal);

                    if(p.closeOnDblclick)
                        f.modal.bind('dblclick', f.closeBox);
                }

                if(p.closeOnEsc)
                    jQuery(document).bind('keydown', 'esc', function (evt){
                        f.closeBox();
                    });

                if(isFirst){
                    $('body').append(msgbox);
                } else {
                    $(msgbox).show();
                }
            }
        }

        f.show();
    }
})(jQuery)