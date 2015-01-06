/**
 * 选择组件.
 *
 * User: Danny Sun
 * Date: 12-11-11
 * Time: 下午9:59
 * @author Danny(sunhao.java@gmail.com)
 */
(function($){
    //定义选择组件
    $.select = $.select || {};

    $.select.defaults = {
        title: '选择组件',                            //标题
        initJson: [],                              //初始化的json
        itemName: 'name',                          //待选项的显示值
        itemValue: 'pkId',                         //待选项的值
        maxSelectNum: null,                        //最大可选择项
        error: null,                               //向后台请求错误时执行的函数
        items: []                                  //左侧待选项的类型
    }

    $.select.defaultItems = {
        title: '',
        leftUrl: '',
        rightUrl: '',
        idFieldName: 'pkId',
        textFieldName: 'name'
    }

    $.select.open = function(p, element){
        var msg = [];
        msg.push('<div id="selectPlugin" class="l-dialog-hack">');
        msg.push('</div>');
        msg.push('<script type="text/javascript">');
        msg.push('  $("#selectPlugin").selectDialog(' + $.util.stringify(p) + ');');
        msg.push('</script>');

        var dialog =
        top.$.ligerDialog.open({
            title: p.title,
            content: msg.join(''),
            width: 630,
            height: 488,
            isNeedNoPaddingClass:true,
            buttons: [
                {
                    text: '确定',
                    onclick: function(item, dialog){
                        var result = $.select.submit(p, element);
                        if(result){
                            dialog.close();
                        }
                    }
                },
                {
                    text: '取消',
                    onclick: function(item, dialog){
                        dialog.close();
                    }
                }
            ]
        });
    }

    $.select.submit = function(p, element){
        var selectItems = $('li.single', $("div.show_select"));
        var length = selectItems.length;
        if(p.maxSelectNum && length > p.maxSelectNum){
            top.$.ligerDialog.error('您最多可以选中' + p.maxSelectNum + '项!');
            return false;
        }
        var returnName = [];            //返回显示的值
        var returnValue = [];           //返回隐藏域的值
        $(selectItems).each(function(i, item){
            var id = $(item).attr("id").substr("t-selected-item-".length);
            var text = $("span", $(item)).text();
            returnName.push(text);
            returnValue.push(id);
        });

        $(element).val(returnName.join(","));
        $(element).next().val(returnValue.join(","));

        return true;
    }

    $.fn.selectDialog = function(p){
        this.each(function(){
            p = $.extend({}, $.select.defaults, p || {});

            var g = {
                //初始化已选择项的div
                initSelectArea: function(){
                    var html = [];
                    html.push('<div class="user_stats_div">已经选择<b id="t-selectCount">0</b>个选项</div>');
                    html.push('     <div class="show_select">');
                    html.push('         <ul class="t-selected-ul">');
                    html.push('         </ul>');
                    html.push('     </div>');
                    html.push('</div>');
                    //放入页面
                    $("#selectArea").html(html.join(''));
                    g.initSelectedItems();
                },
                //初始化已选中的项
                initSelectedItems: function(){
                    $(p.initJson).each(function(i, item){
                        g.addTopItem(item[p.itemName], item[p.itemValue]);
                    });
                },
                //添加已选中的项
                addTopItem: function(name, value){
                    var append = '<li id="t-selected-item-' + value + '" class="single"><span>' + name +
                            '</span><a class="t-delete-item"></a></li>'
                    $('.t-selected-ul').append(append);
                    g.updateSelectedCount();
                    //为删除按钮(X)绑定删除事件
                    $('.t-delete-item', g.tabs).bind('click', function(){
                        var li = $(this).parent();
                        var id = li.attr('id').substr("t-selected-item-".length);
                        var item = $("#" + id, g.tabs).parent();
                        g.removeItem(item);
                    });
                },
                //刷新已选中的数目
                updateSelectedCount: function(){
                    var count = $('li.single', g.tabs).size();
                    $('#t-selectCount').html(count);
                    if(count == g.totalCount){
                        $("#selectAll").attr("checked", "checked");
                    } else {
                        $("#selectAll").removeAttr("checked");
                    }
                },
                //添加左侧tab的选项
                addItem: function(i, item){
                    var ditem = $('<div tabid="select-' + i + '"></div>');
                    var content = [];
                    content.push('<div class="tree_div">');
                    content.push('  <ul id="select-' + i + '"  style="height:285px">');
                    content.push('  </ul>');
                    content.push('</div>');
                    content.push('<div class="chose_div">');
                    content.push('  <div class="toolbar_query">');
                    content.push('      <li>');
                    content.push('          <div class="btn_query">');
                    content.push('              <input id="keyword" name="keyword" type="text"/>');
                    content.push('              <a href="javascript:void(0);" class="r-query-button" title="查询"/>');
                    content.push('          </div>');
                    content.push('      </li>');
                    content.push('      <li>');
                    content.push('          <label for="selectAll">');
                    content.push('              <input name="selectAll" id="selectAll" type="checkbox" value=""/>&nbsp;全选&nbsp;');
                    content.push('          </label>');
                    content.push('      </li>');
                    content.push('  </div>');
                    content.push('  <div class="list">');
                    content.push('  </div>');
                    content.push('  <div class="page_blue">');
                    content.push('  </div>');
                    content.push('</div>');
                    
                    ditem.html(content.join(''));
                    $("#content", g.tabs).append(ditem);
                    ditem.attr("title", item.title);
                    ditem.attr("leftUrl", item.leftUrl);
                    ditem.attr("rightUrl", item.rightUrl);
                },
                //load右侧的待选择内容
                loadRightData: function(url, param){
                    g.clearHtml();
                    g.loading.show();
                    var type = param ? 'POST' : 'GET';
                    param = param || [];
                    //ajax请求获取数据
                    $.ajax({
                        type: type,
                        url: url,
                        dataType: 'json',
                        data: param,
                        success: function(o){
                            if(!o)
                                return;
                            g.loading.hide();
                            g.setRightHtml(url, o);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown){
                            g.loading.hide();
                            if(p.error)
                                p.error(XMLHttpRequest, textStatus, errorThrown);
                            else
                                alert('error');
                        }
                    });
                },
                //清空内容
                clearHtml:function () {
                    $(".list", g.tabs).empty();
                    $(".page_blue", g.tabs).empty();
                    $("#selectAll", g.tabs).removeAttr("checked");
                },
                //设置全选的checkbox选中
                setSelectAll: function(totalSize){
                    if(totalSize == g.getSelectItemsSize()){
                        $('#selectAll').attr("checked", "checked");
                    } else {
                        $('#selectAll').removeAttr("checked");
                    }
                },
                //获取已选中的项数
                getSelectItemsSize: function(){
                    var selectItems = $('li.single', $("div.show_select"));
                    return selectItems.size();
                },
                //设置右侧的内容
                setRightHtml: function(url, data){
                    var ps = data.paginationSupport;
                    g.totalCount = ps.totalRow;
                    g.setSelectAll(g.totalCount);
                    var selectData = null;
                    if(ps != null)
                        selectData = ps.items;

                    var rightContentHtml = ['<ul>'];
                    if (ps && selectData.length > 0) {
                        for (var i = 0; i < selectData.length; i++) {
                            var name = selectData[i][p.itemName];
                            var value = selectData[i][p.itemValue];
                            var _checked = "";
                            var _selected = "";
                            $("li.single", g.tabs).each(function (i) {
                                var id = $(this).attr("id").substr("t-selected-item-".length);
                                if (id == value) {
                                    _checked = "checked";
                                    _selected = " selected";
                                }
                            });
                            rightContentHtml.push('<li class="r-selected-li' + _selected + '" title="' + name + '">');
                            rightContentHtml.push('     <input class="r-selected-item" ' + _checked + ' type="checkbox" value="' +
                                                            value + '"  id="' + value + '" text="' + name + '"/>')
                            rightContentHtml.push(name);
                            rightContentHtml.push('</li>');
                        }
                        rightContentHtml.push('</ul>');
                        $(".list", g.tabs).html(rightContentHtml.join(''));

                        g.setPage(url, ps);
                    }
                },
                //设置分页
                setPage: function(url, ps){
                    var pageHtml = [];
                    if(ps != null && ps.pageSize >= 1){
                        if(ps.currentIndex != 1){
                            //不是第一页,显示"首页"和"上一页"
                            pageHtml.push('<a class="page" href="javascript:void(0);" page="1"> 首页 </a>');
                            pageHtml.push('<a class="page" href="javascript:void(0);" page="' + ps.previousIndex + '"> &lt; </a>');
                        }
                        for(var i = ps.startIndexOnShow; i <= ps.endIndexOnShow; i++){
                            if(i == ps.currentIndex){
                                //当前页
                                pageHtml.push('<span class="current">' + i + '</span>');
                            } else {
                                //不是当前页
                                pageHtml.push('<a class="page" href="javascript:void(0);" page="' + i + '"> ' + i + ' </a>');
                            }
                        }
                        if(ps.currentIndex < ps.endIndex){
                            //不是最后一页,显示"尾页"和"下一页"
                            pageHtml.push('<a class="page" href="javascript:void(0);" page="' + ps.nextIndex + '"> &gt; </a>');
                            pageHtml.push('<a class="page" href="javascript:void(0);" page="' + ps.endIndex + '"> 尾页 </a>');
                        }
                        $(".page_blue", g.tabs).html(pageHtml.join(''));
                        g.initEvents(url);
                    }
                },
                //选中某一项
                selectItem: function(item){
                    var checkbox = $('.r-selected-item', item);
                    if(!item.hasClass("selected")){
                        checkbox.attr("checked", "checked");
                        item.addClass("selected");
                        g.addTopItem(checkbox.attr("text"), checkbox.attr("id"));
                    }
                },
                //取消选中某一项
                removeItem: function(item){
                    var checkbox = $('.r-selected-item', item);
                    if(item.hasClass("selected")){
                        checkbox.removeAttr("checked");
                        item.removeClass("selected");
                        $("#t-selected-item-" + checkbox.attr("id"), g.tabs).remove();
                        g.updateSelectedCount();
                    }
                },
                //初始化所有的事件
                initEvents: function(url){
                    //初始化分页事件
                    $(".page", g.tabs).unbind('click').bind('click', function(){
                        //解绑分页页码原来所有的click事件,然后重新绑定click事件
                        var query = $('.r-query-button', g.tabs);
                        var page = $(this).attr('page');
                        var pkId = query.attr('pkId') == null ? "-1" : query.attr('pkId');
                        var keyword = query.attr("keyword") == null ? "" : query.attr("keyword");
                        var param = "pkId=" + pkId + "&keyword=" + keyword + "&page=" + page;
                        g.loadRightData(url, param);
                    });
                    //搜索事件
                    $(".r-query-button", g.tabs).bind('click', function(){
                        var pkId = $(this).attr('pkId') == null ? "-1" : $(this).attr('pkId');
                        var keyword = $(this).prev().val();
                        var param = "pkId=" + pkId + "&keyword=" + keyword;
                        g.loadRightData(url, param);
                    });
                    //选中事件
                    $('.r-selected-li', g.tabs).bind('click', function(){
                        var selected = $(this).hasClass("selected");
                        if(selected){
                            //原来已选中,取消选中
                            g.removeItem($(this));
                        } else {
                            //原来未选中,选中
                            g.selectItem($(this));
                        }
                    });
                    //全选事件
                    $('#selectAll').bind('click', function(){
                        var checked = $(this).attr("checked");
                        if(checked){
                            //选中
                            $('.r-selected-li', $(this).parents(".chose_div")).each(function(i, item){
                                g.selectItem($(item));
                            });
                        } else {
                            //未选中
                            $('.r-selected-li', $(this).parents(".chose_div")).each(function(i, item){
                                g.removeItem($(item));
                            });
                        }
                    });
                }
            }

            g.tabs = $(this);
            //总的项数
            g.totalCount = 0;
            
            //组件整体框架
            var frameHtml = [];
            frameHtml.push('<div id="selectArea" style="width:600px;height:100px;">');
            frameHtml.push('</div>');
            frameHtml.push('<div class="tab_module">');
            frameHtml.push('    <div id="content">');
            frameHtml.push('    </div>');
            frameHtml.push('</div>');

            var frame = $(frameHtml.join(''));
            g.tabs.append(frame);
            g.initSelectArea();

            if(p.items){
                $(p.items).each(function(i, item){
                    item = $.extend({}, $.select.defaultItems, item || {});
                    g.addItem(i, item);
                });
            }
            g.loading = $("<div class='l-tree-loading'></div>");
            $("#content", g.tabs).ligerTab({
                onAfterSelectTabItem:function(tabId){
                    var li = $("li[tabid=" + tabId + "]");
                    var leftUrl = li.attr("leftUrl");
                    var rightUrl = li.attr("rightUrl");
                    var idFieldName = "pkId";
                    var textFieldName = "name";
                    g.loadRightData(rightUrl, "");
                    //初始化左侧树
                    $('#' + tabId).ligerTree({
                        idFieldName: idFieldName,
                        textFieldName: textFieldName,
                        checkbox: false,
                        url: leftUrl,
                        onSelect:function(node){
                            $(".r-query-button", g.tabs).attr("pkId", node.data.pkId);
                            var param = "pkId=" + node.data.pkId;
                            g.loadRightData(rightUrl, param);
                        }
                    });
                    //取消选中，并将pkId置为空
                    $("li", $('#' + tabId)).each(function() {
                        //manager.cancelSelect(this);
                    });
                    $(".r-query-button", g.tabs).attr("pkId", "-1");
                }
            });

            if (this.id == undefined)
                this.id = "selectPlugins" + new Date().getTime();
        });
    }

    $.fn.select = function(p){
        this.each(function(){
            p = $.extend({}, $.select.defaults, p || {});

            var f = {
                initEvent: function(){
                    f.img.bind('click', function(){
                        var names = f.input.val().split(",");
                        var values = f.input.next().val().split(",");
                        var list = new Array();
                        for(var i in values){
                            var initObj = new Object();
                            initObj[p.itemName] = names[i];
                            initObj[p.itemValue] = values[i];
                            if(values[i] != "")
                                list[i] = initObj;
                        }
                        p.initJson = list;
                        //开始选择组件
                        $.select.open(p, f.input);
                    });
                }
            }

            f.input = $(this);
            f.inputId = f.input.attr('id');
            f.inputName = f.input.attr('name') ? f.input.attr('name') : f.inputId;
            f.input.attr('name', f.inputName + '_val');
            f.input.attr('id', f.inputId + '_val');
            //input和textarea才能是选择组件的容器
            if(this.tagName.toLowerCase() == 'input' || this.tagName.toLowerCase() == 'textarea'){
                //设置只读
                this.readOnly = true;

                f.selectDiv = f.input.wrap('<div class="select_div"></div>').parent();
                if (this.tagName.toLowerCase() == "input") {
                    f.userDiv = f.selectDiv.wrap('<div class="user_div_input float_left"></div>').parent();
                } else {
                    f.input.attr("rows", "3");
                    f.userDiv = f.selectDiv.wrap('<div class="user_div_textarea float_left"></div>').parent();
                }

                f.img = f.userDiv.append('<div class="select_img"><a class="l-click-open" href="#"></a></div>').find(".select_img");
                f.input.after('<input type="hidden" name="' + f.inputId + '" value=""/>');

                var backValue = "";
                var backHiddenValue = "";
                if (p.initJson) {
                    $(p.initJson).each(function (i, item) {
                        if (item != null) {
                            backValue += item[p.rightItemName];
                            backHiddenValue += item[p.rightItemValue];
                            if (i < $(p.initJson).size() - 1) {
                                backValue += ",";
                                backHiddenValue += ",";
                            }
                        }
                    });
                    $(this).val(backValue);
                    $(this).next().val(backHiddenValue);
                    f.initEvent();
                }
            } else {
                alert('只有input和textarea才能是选择组件的容器!');
            }
        });
    }
})(jQuery)