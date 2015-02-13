/**
 * jQuery ligerUI 1.1.0.1
 *
 * update SunHao [ sunhaoe.java@gmail.com]
 * note:
 * 1.修改样式
 * 2.加上级联下拉
 * 3.添加几个方法：
 *  a.设置文本：setText(item, text)
 *  b.禁用全部按钮：disableAll()
 *  c.启用全部按钮：enableAll()
 *  d.移出按钮：remove(itemId)
 */
if (typeof (LigerUIManagers) == "undefined") LigerUIManagers = {};
if (typeof (LigerUIButtonGroup) == "undefined") LigerUIButtonGroup = {};
(function($) {
    $.fn.ligerGetButtonGroupManager = function() {
        return LigerUIManagers[this[0].id + "_ButtonGroup"];
    };

    $.fn.buttonGroup = function(p) {
        this.each(function() {
            if (this.usedButtonGroup) return;

            var singleId = new Date().getTime();

            var g = {
                addItem :function(item) {
                    //将item放入全局对象中
                    LigerUIButtonGroup[singleId + '_' + item.id] = item;

                    var html = [];
                    html.push('<div class="l-button-item l-panel-btn">');
                    html.push(' <div class="l-panel-btn-l">');
                    html.push('     <span></span>');
                    html.push(' </div>');
                    html.push(' <div class="l-panel-btn-r"></div>');
                    html.push('</div>');
                    var ditem = $(html.join(''));

                    g.button.append(ditem);
                    item.id && ditem.attr("buttonid", item.id + '_' + singleId);

                    if (item.icon) {
                        var iconObj = $(".l-panel-btn-l span", ditem);
                        iconObj.before("<div class='l-icon l-icon-" + item.icon + "'></div>");
                        ditem.addClass("l-button-item-hasicon");
                    }
                    if (item.line) {
                        ditem.before("<div class='l-toolbar-split'></div>");
                    }
                    item.text && this.setText($("span:first", ditem), item.text);

                    item.disable && ditem.addClass("l-button-item-disable") && ditem.addClass("l-panel-btn-disable");

                    //子菜单
                    var menu = g.addMenu(item.children, ditem);
                    //将子菜单放入全局对象中
                    if(menu)
                        LigerUIButtonGroup[singleId + '_' + item.id + '_menu'] = menu;

                    g.addEvent(ditem, item, menu);
                },
                //增加菜单事件
                addMenu: function(items, ditem){
                    //设置箭头以及箭头的left值
                    if(items && items.length > 0){
                        var textPanel = $(".l-panel-btn-l", ditem);
                        var arrow = $('<div class="l-panel-btn-arrow"></div>');
                        textPanel.after(arrow);
                        //增加事件
                        var menu = $.ligerMenu({
                            width: 120,
                            items: items,
                            afterHide: function(){
                                $(ditem).removeClass("l-panel-btn-over");
                            }
                        });

                        $(menu.menu).mouseleave(function(){
                            menu.hide();
                            $(ditem).removeClass("l-panel-btn-over");
                        });

                        return menu;
                    }
                },
                //绑定事件
                addEvent: function(ditem, item, menu){
                    if (!ditem.hasClass("l-button-item-disable")) {
                        item.click && ditem.click(function() {
                            //注册事件
                            item.click(item);
                        });

                        ditem.hover(function () {
                            $(this).addClass("l-panel-btn-over");
                            if(menu)
                                menu.show({top:ditem.offset().top + ditem.height(), left:ditem.offset().left});
                        }, function () {
                            if(!menu){
                                $(this).removeClass("l-panel-btn-over");
                            } else {
                                //menu.hide();
                            }
                        });
                    }
                },
                //菜单工具栏的setDisable事件
                setDisable : function(itemId) {
                    //从页面获取这个按钮
                    var item = $("[buttonid=" + itemId + '_' + singleId + "]");
                    //加上样式
                    item.addClass("l-button-item-disable");
                    item.addClass("l-panel-btn-disable");
                    //解除绑定的click事件
                    item.unbind("click");
                    //解除绑定的hover事件
                    item.unbind("hover");
                },
                //菜单工具栏的setEnable事件
                setEnable : function(itemId) {
                    //从页面获取这个按钮
                    var ditem = $("[buttonid=" + itemId + '_' + singleId + "]");
                    //移除样式
                    ditem.removeClass("l-button-item-disable").removeClass("l-panel-btn-disable");
                    //重新注册click的监听
                    var item = LigerUIButtonGroup[singleId + '_' + itemId];
                    ditem.click(function(){
                        item.click(item);
                    });

                    //重新注册事件监听
                    var menu = LigerUIButtonGroup[singleId + '_' + itemId + '_menu'];
                    g.addEvent(ditem, item, menu);
                },
                //菜单工具栏的设置文本事件
                setText: function(item, text){
                    var ditem;
                    if(typeof item == 'string'){
                        ditem = LigerUIButtonGroup[singleId + '_' + item];
                        ditem.text = text;

                        //从页面获取这个按钮
                        item = $('span:first', $("[buttonid=" + item + '_' + singleId + "]"));
                        //按钮的属性

                        //设置文本
                        item.html(text);
                        //删除原事件
                        item.unbind('click');
                        //注册新事件
                        item.bind('click', function(){
                            ditem.click(ditem);
                        });
                    } else {
                        $(item).html(text);
                    }
                },
                //禁用所有的按钮事件
                disableAll: function(){
                    $.each(LigerUIButtonGroup, function(i, item){
                        if(eval('/^' + singleId + '_(' + item.id + ')$/').test(i))
                            g.setDisable(item.id);
                    });
                },
                //启用全部按钮事件
                enableAll: function(){
                    $.each(LigerUIButtonGroup, function(i, item){
                        if(eval('/^' + singleId + '_(' + item.id + ')$/').test(i))
                            g.setEnable(item.id);
                    });
                },
                //移出某个按钮的事件
                remove: function(itemId){
                    //从页面获取这个按钮
                    var item = $("[buttonid=" + itemId + '_' + singleId + "]");
                    item.remove();
                }
            };
            g.button = $(this);
            if (!g.button.hasClass("l-button")) g.button.addClass("l-button");
            if (p.items) {
                $(p.items).each(function(i, item) {
                    g.addItem(item);
                });
            }
            if (this.id == undefined) this.id = "LigerUI_" + singleId;
            LigerUIManagers[this.id + "_ButtonGroup"] = g;
            this.usedButtonGroup = true;
        });
        if (this.length == 0) return null;
        if (this.length == 1) return LigerUIManagers[this[0].id + "_ButtonGroup"];
        var managers = [];
        this.each(function() {
            managers.push(LigerUIManagers[this.id + "_ButtonGroup"]);
        });
        return managers;
    };

})(jQuery);