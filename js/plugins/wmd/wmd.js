/**
 * .
 * User: sunhao
 * Email: sunhao.java@gmail.com
 * Time: 2015-1-22 21:28
 */
(function ($) {
    //定义$.wmd
    $.wmd = $.wmd || {};

    //所需的参数默认值
    $.wmd.defaults = {
        helpButton: {
            handler: function () {
                window.open("http://www.oschina.net/question/100267_75314");
            },
            title:'Markdown快速入门'
        },
        width: 500,
        height: 450,
        preview: true,
        wmdCls: "wmd-input",
        previewCls: "wmd-preview"
    }

    $.fn.wmd = function (p) {
        this.each(function () {
            p = $.extend({}, $.wmd.defaults, p || {});

            var _this = $(this);
            var id = _this.attr("id");
            var preview = $('<div id="wmd-preview-' + id + '"></div>');
            var g = {
                init: function () {
                    var converter = new Markdown.Converter();

                    var options = {};

                    if (p.helpButton) {
                        options.helpButton = p.helpButton;
                    }

                    var editor = new Markdown.Editor(converter, "-" + id, options);

                    editor.run();
                },
                preview: function(){
                    var button = [];
                    button.push('<li id="preview-tab-button" class="wmd-button" title="查看预览" style="right: 100px;">');
                    button.push('   <span class="wmd-blog-prev">预览切换</span>');
                    button.push('</li>');

                    var previewBtn = $(button.join(""));
                    $('#wmd-help-button-content').before(previewBtn);
                    this.addPreviewEvent(previewBtn);
                },
                addPreviewEvent: function (target){
                    target.click(function(){
                        _this.toggle();
                        preview.toggle();
                    })
                }
            }

            var width = p.width;
            if(width < 500) {
                width = 500;
            }
            var panel = $('<div class="wmd-panel" style="height: ' + p.height + 'px;width: ' + width + 'px"></div>');
            _this.wrap(panel);
            _this.addClass(p.wmdCls);
            _this.attr("id", "wmd-input-" + id);
            _this.before('<div id="wmd-button-bar-' + id + '"></div>');

            _this.after(preview);
            if(p.preview) {
                _this.css("width", "48%").css("float", "left").css("margin-right", "1%");
                preview.css("width", "48%").css("float", "left");
                preview.addClass(p.previewCls);
            } else {
                preview.hide();
                _this.css("width", "100%");
                preview.css("width", "100%");
                preview.addClass(p.previewCls);
            }

            g.init();
            if(!p.preview)
                g.preview();
        })
    }
})(jQuery)