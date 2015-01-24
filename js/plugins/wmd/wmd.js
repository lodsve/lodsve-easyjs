/**
 * .
 * User: sunhao
 * Email: sunhao.java@gmail.com
 * Time: 2015-1-22 21:28
 */
(function ($) {
    //定义$.wmd
    $.wmd = $.wmd || {};

    $.wmd.defaultWmdLocal = {
        bold: "粗体 <strong> Ctrl+B",
        boldexample: "strong text",

        italic: "斜体 <em> Ctrl+I",
        italicexample: "emphasized text",

        link: "超级链接 <a> Ctrl+L",
        linkdescription: "enter link description here",
        linkdialog: "<p><b>Insert Hyperlink</b></p><p>http://sunhao-java.vicp.cc/ \"optional title\"</p>",

        quote: "引用文字 <blockquote> Ctrl+Q",
        quoteexample: "Blockquote",

        code: "代码 <pre><code> Ctrl+K",
        codeexample: "enter code here",

        image: "图片 <img> Ctrl+G",
        imagedescription: "enter image description here",
        imagedialog: "<p><b>Insert Image</b></p><p>http://example.com/images/diagram.jpg \"optional title\"<br><br>Need <a href='http://www.google.com/search?q=free+image+hosting' target='_blank'>free image hosting?</a></p>",

        olist: "编号 <ol> Ctrl+O",
        ulist: "项目符号 <ul> Ctrl+U",
        litem: "列表",

        heading: "标题 <h1>/<h2> Ctrl+H",
        headingexample: "标题",

        hr: "水平线 <hr> Ctrl+R",

        undo: "后退 - Ctrl+Z",
        redo: "前进 - Ctrl+Y",
        redomac: "Redo - Ctrl+Shift+Z",

        help: "帮助"
    }

    //所需的参数默认值
    $.wmd.defaults = {
        helpButton: {
            handler: function () {
                window.open("http://www.oschina.net/question/100267_75314");
            },
            title: '帮助'
        },
        width: 500,
        height: 450,
        preview: true,
        wmdCls: "wmd-input",
        previewCls: "wmd-preview",
        strings: $.wmd.defaultWmdLocal
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

                    options.helpButton = p.helpButton;
                    options.strings = p.strings;

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