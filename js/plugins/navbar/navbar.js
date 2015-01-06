/**
 * 导航栏.
 * User: sunhao
 * Date: 13-7-25
 * Time: 下午10:40
 * To change this template use File | Settings | File Templates.
 */
if(typeof (LigerUIManagers) == "undefined") LigerUIManagers = {};
if (typeof (LigerUINavbars) == "undefined") LigerUINavbars = {};
(function($){
    $.fn.getNavbarManager = function(){
        return LigerUIManagers[this[0].id + "_Navbar"];
    };

    //定义整个navigate对象
    $.navigate = $.navigate || {};

    //定义默认属性值
    $.navigate.defaults = {
        title: '',
        target: '#',
        url: '',
        width: '100%',
        autoHide: false,
        items: []
    }

    //主参数中items的默认值
    $.navigate.items = {
        id: 'navbar',
        text: '导航',
        click: null,
        disable: false
    }

    //items中的children(子菜单)的默认值
    $.navigate.children = {
        text: '子菜单',
        click: null,
        line: false,
        disable: false
    }

    $.fn.navbar = function(p){
        this.each(function(){
            p = $.extend({}, $.navigate.defaults, p || {});

            var singleId = new Date().getTime();

            var g = {
                addItem: function(item){
                    item = $.extend({}, $.navigate.items, item || {});
                    //将item放入全局对象中
                    LigerUINavbars[singleId + '_' + item.id] = item;

                    var main = $('<li class="dropdown"></li>');
                    main.attr('navbarid', item.id ? item.id + '_' + singleId : $.navigate.items.id);
                    var link = $('<a id="" href="javaScript:void(0)"></a>');
                    link.addClass("dropdown-toggle");
                    item.text && g.setText(link, item.text);
                    if(item.children && item.children.length > 0){
                        var caret = $('<b class="caret"></b>');
                        link.append(caret);
                    }

                    main.append(link);

                    if(item.disable) main.addClass('l-navbar-disable');
                    g.ul.append(main);
                    g.addEvent(main, item, link);
                    g.addMenu(item.children, main);
                },
                addMenu: function(children, main){
                    if(children && children.length > 0){
                        var child = $('<ul class="dropdown-menu"></ul>');
                        $(children).each(function(i, item){
                            item = $.extend({}, $.navigate.children, item || {});
                            var li = $('<li></li>');
                            var link = $('<a id="" href="javaScript:void(0)"></a>');
                            link.attr('id', item.id ? item.id : '');
                            item.disable && link.addClass('l-navbar-disable');

                            !item.disable && item.click && link.click(function(){
                                if(typeof item.click == 'function')
                                    item.click(item);
                                else if(typeof item.click == 'string'){
                                    $.util.decode(item.click)(item);
                                } else {
                                    //do nothing
                                }
                            });
                            link.html(item.text ? item.text : $.navigate.children.text);

                            item.line && child.append($('<li class="divider"></li>'));

                            li.append(link);
                            child.append(li);
                        });

                        main.append(child);
                        if(p.autoHide)
                            child.hover(function(){

                            }, function(){
                                $(this).parent('li').removeClass('open');
                            });

                        return child;
                    }
                },
                addEvent: function(main, item, link){
                    if(!main.hasClass('l-navbar-disable')){
                        item.click && link.click(function(){
                            //移除其他open
                            $('.open', link.parent('li').parent()).removeClass('open');

                            if(!item.children){
                                item.click(item);
                            }else{
                                link.parent('li').addClass('open');
                            }
                        });

                        main.hover(function(){
                            main.addClass('l-navbar-hover');
                        }, function(){
                            main.removeClass('l-navbar-hover');
                        });

                        link.click(function(event) {
                            //事件冒泡
                            event.stopPropagation();
                        })
                    }
                },
                //导航栏的setDisable事件
                setDisable : function(itemId) {
                    var bar = $('[navbarid=' + itemId + '_' + singleId + ']');
                    bar.addClass("l-navbar-disable");
                    //解除绑定的click事件
                    $('a.dropdown-toggle', bar).unbind("click");
                    bar.unbind('hover');
                },
                //导航栏的setEnable事件
                setEnable : function(itemId) {
                    //从页面获取这个导航
                    var bar = $('[navbarid=' + itemId + '_' + singleId + ']');
                    //移除样式
                    bar.removeClass("l-navbar-disable");
                    //重新注册click的监听
                    var item = LigerUINavbars[singleId + '_' + itemId];

                    //重新注册事件监听
                    g.addEvent(bar, item, $('a.dropdown-toggle', bar));
                },
                //菜单工具栏的设置文本事件
                setText: function(item, text){
                    var ditem;
                    if(typeof item == 'string'){
                        ditem = LigerUINavbars[singleId + '_' + item];
                        ditem.text = text;

                        //从页面获取这个按钮
                        var bar = $("[navbarid=" + item + '_' + singleId + "]");
                        item = $('a.dropdown-toggle', bar);

                        //设置文本
                        item.html(text);

                        if(item.children && item.children.length > 0){
                            var caret = $('<b class="caret"></b>');
                            item.append(caret);
                        }
                        //删除原事件
                        item.unbind('click');
                        //解除绑定的click事件
                        $('a.dropdown-toggle', bar).unbind("click");
                        bar.unbind('hover');
                        //注册新事件
                        //重新注册事件监听
                        g.addEvent(bar, ditem, item);
                    } else {
                        $(item).html(text);
                    }
                },
                //禁用所有的按钮事件
                disableAll: function(){
                    $.each(LigerUINavbars, function(i, item){
                        if(eval('/^' + singleId + '_(' + item.id + ')$/').test(i))
                            g.setDisable(item.id);
                    });
                },
                //启用全部按钮事件
                enableAll: function(){
                    $.each(LigerUINavbars, function(i, item){
                        if(eval('/^' + singleId + '_(' + item.id + ')$/').test(i))
                            g.setEnable(item.id);
                    });
                },
                //移出某个按钮的事件
                remove: function(itemId){
                    //从页面获取这个按钮
                    var item = $("[navbarid=" + itemId + '_' + singleId + "]");
                    item.remove();
                }
            }

            g.navigate = $(this);
            if (!g.navigate.hasClass("l-navbar")) g.navigate.addClass("l-navbar");
            if (!g.navigate.hasClass("navbar-static")) g.navigate.addClass("navbar-static");

            var panel = [];
            panel.push('<div class="l-navbar-inner">');
            panel.push('    <div class="container" style="width: auto;">');
            panel.push('    </div>');
            panel.push('</div>');
            panel = $(panel.join(''));
            g.navigate.append(panel);

            g.container = $('.container', g.navigate);
            //设置项目名和链接
            if(p.title != ''){
                var link = $('<a class="brand" href="' + p.target + '">' + p.title + '</a>');
                g.container.append(link);
            }

            var menus = [];
            if(p.url != ''){
                //通过ajax的形式获取菜单
                $.ajax({
                    url: p.url,
                    type: 'get',
                    dataType: 'json',
                    async: false,
                    success: function(o){
                        if(o && o.menus)
                            menus = o.menus;
                        else
                            menus = [];
                    }
                });
            }

            menus = $.merge(p.items, menus);
            if (menus && menus.length > 0) {
                g.ul = $('<ul class="nav"></ul>');
                g.container.append(g.ul);
                $(menus).each(function(i, item){
                    g.addItem(item);
                });
            }
            if (this.id == undefined) this.id = "LigerUI_" + singleId;
            LigerUIManagers[this.id + "_Navbar"] = g;
        });

        $(document).click(function() {
            $('.open').removeClass('open');
        })

        if (this.length == 0) return null;
        if (this.length == 1) return LigerUIManagers[this[0].id + "_Navbar"];
        var managers = [];
        this.each(function() {
            managers.push(LigerUIManagers[this.id + "_Navbar"]);
        });

        return managers;
    }
})(jQuery)