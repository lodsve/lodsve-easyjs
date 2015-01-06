/**
 *  Version 2.0
 *  Example:
 *      Print Button: <div id="print_button">Print</div>
 *      Print Area  : <div class="PrintArea"> ... html ... </div>
 *      Javascript  : <script>
 *                       $("div#print_button").click(function(){
 *                           $("div.PrintArea").printArea( [OPTIONS] );
 *                       });
 *                     </script>
 *
 *  {OPTIONS}       | [type]        | (default), values    | Explanation
 *  ----------------| --------------| -------------------- | -----------
 *  @mode           | [string]      | ("iframe"), "popup"  | printable window is either iframe or browser popup
 *  @popTitle       | [string]      | ('')                 | popup window title element
 *  @popClose       | [boolean]     | (false), true        | popup window close after printing
 *  @executeDelHtml | [function]    | (null)               | remove elements what you want from the print area
 *
 *  jquery print area plugin.<br/>
 *  get from internet,modify by sunhao
 *
 *  User: sunhao
 *  Date: 13-4-29
 *  Time: 上午5:22
 *
 *  @modify sunhao(sunhao.java@gmail.com)
 */
(function($) {
    //一个计数器，用来标识同一个页面多少次调用
    var counter = 0;
    var modes = { iframe:"iframe", popup:"popup" };
    //默认参数
    var defaults = {
        mode: modes.popup,                   //采用什么方式预览打印样式
        popTitle: '打印预览',                //打印预览页的title
        popClose: true,                     //采用popup模式时是否在打印结束后关闭弹出框
        executeDelHtml: null                //执行删除页面元素的方法(参数是要打印的页面jquery对象)
    };

    var settings = {};//global settings

    $.fn.printArea = function (options) {
        $.extend(settings, defaults, options);

        counter++;
        var idPrefix = "printArea_";
        $("[id^=" + idPrefix + "]").remove();
        var ele = $(this);

        settings.id = idPrefix + counter;

        var writeDoc;
        var printWindow;

        switch (settings.mode) {
            case modes.iframe :
                //使用iframe模式打印
                var f = new Iframe();
                writeDoc = f.doc;
                printWindow = f.contentWindow || f;
                break;
            case modes.popup :
                //使用弹出页面的模式打印
                printWindow = new Popup(ele);
                writeDoc = printWindow.doc;
        }

        writeDoc.open();

        //需要打印的页面
        var printObj = $('<div class="' + ($(ele).attr("class") ? $(ele).attr("class") : '') + '">' + $(ele).html() + '</div>');

        //执行需要删除元素的方法
        if (settings.executeDelHtml) {
            settings.executeDelHtml(printObj);
        }

        //往iframe或者弹出框中写入拼接好的待打印html
        writeDoc.write("<html>" + getHead() + "<body style=\"padding: 20px\">" + printObj.html() + "</body></html>");
        //页面上的style标签中的内容
        getStyle().appendTo($('head', $(writeDoc)));

        writeDoc.close();

        //获取焦点
        printWindow.focus();
        //打印
        printWindow.print();

        if (settings.mode == modes.popup && settings.popClose) {
            //关闭
            printWindow.close();
        }
    }

    function getStyle(){
        return $('style', $(document)).clone();
    }

    function getHead() {
        //标题
        var head = "<head><title>" + settings.popTitle + "</title>";

        //获取页面上所有css样式表,并写入待打印页面的head中
        $(document).find("link")
            .filter(function () {
                return $(this).attr("rel").toLowerCase() == "stylesheet";
            })
//            .filter(function () {
//                var media = $(this).attr("media");
//
//                return (media.toLowerCase() == "" || media.toLowerCase() == "print")
//            })
            .each(function () {
                head += '<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >';
            });

        head += "</head>";

        return head;
    }

    /**
     * iframe模式
     * @return {*}
     * @constructor
     */
    function Iframe() {
        var frameId = settings.id;
        var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
        var iframe;

        try {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            $(iframe).attr({ style:iframeStyle, id:frameId, src:"" });
            iframe.doc = null;
            iframe.doc = iframe.contentDocument ? iframe.contentDocument : ( iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
        }
        catch (e) {
            throw e + ". iframes may not be supported in this browser.";
        }

        if (iframe.doc == null) throw "Cannot find document.";

        return iframe;
    }

    /**
     * 弹出框模式
     *
     * @param printElement
     * @return {window}
     * @constructor
     */
    function Popup(printElement) {
        var windowAttr = "location=no,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
        windowAttr += ",width=" + (printElement.width() + 50) + ",height=" + (printElement.height() + 50);
        windowAttr += ",resizable=yes,screenX=0,screenY=0,personalbar=no,scrollbars=yes";

        var newWin = window.open("", "_blank", windowAttr);

        newWin.doc = newWin.document;

        return newWin;
    }
})(jQuery);
