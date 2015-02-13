/*
 * 使用前一定要引入jQurey及本脚本,如
 *  <script type="text/javascript" src="js/jquery_last.js"></script>
 *  <script type="text/javascript" src="js/YlMarquee.js">
 * 使用方法：
 * 
 * 1、为要设置滚动的对象设置容器，并命名class，如class="marquee"
 * 2、将要滚动的对象置入<ul></ul>中，并添加li标签，li标签中可以是图片、文字或表格……
 * 3、此版本需要设置每个li列表的宽度或高度一致
 *  <div class="ylMarquee">
 *     <ul>
 *          <li><img src="image/1.jpg" alt="1"></li>
 *          <li><img src="image/2.jpg" alt="2"></li>
 *          <li><img src="image/3.jpg" alt="3"></li>
 *      </ul>
 *  </div>
 * 4、设置marquee的height或width样式——向上滚动必须设置height的大小，向左滚动必须设置width的大小，否则页面将显示不正常。
 * 5、在页面中添加jQuery语句，调用此插件，并对相关参数进行设置,如：
 * <script type="text/javascript">
 * $(document).ready(function(){
 *  $(".stroll").marquee({
 *     visible:3,
 *     step:1,
 *     direction:"left"
 *   });
 *});
 * </script>
 * 6、插件相关参数：
 * visible:页面可见元素（图片）个数，默认为1，必须参数。
 * step:滚动步长，整数，默认为1，增大此数可加快滚动速度，设为0，则不进行滚动。
 * direction:滚动方向，有"left"（向左滚动）和"up"（向上滚动）两个参数，注意设置时一定要加英文的双引("")号或单引号('')。
 */

(function ($) {
    $.fn.marquee = function (o) {
        o = $.extend({
            speed: 30,
            step: 1,            //滚动步长
            direction: "up",    //滚动方向
            visible: 1          //可见元素数量
        }, o || {});

        //获取滚动内容内各元素相关信息
        var i = 0;
        var div = $(this);
        var ul = $("ul", div);
        var tli = $("li", ul);
        var liSize = tli.size();
        if (o.direction == "left")
            tli.css("float", "left");
        var liWidth = tli.innerWidth();
        var liHeight = tli.height();
        var ulHeight = liHeight * liSize;
        var ulWidth = liWidth * liSize;

        //如果对象元素个数大于指定的显示元素则进行滚动，否则不滚动。
        if (liSize > o.visible) {
            ul.append(tli.slice(0, o.visible).clone());  //复制前o.visible个li，并添加到ul的最后
            li = $("li", ul);
            liSize = li.size();

            //给滚动内容添加相关CSS样式
            div.css({"position": "relative", overflow: "hidden"});
            ul.css({"position": "relative", margin: "0", padding: "0", "list-style": "none"});
            li.css({margin: "0", padding: "0", "position": "relative"});

            switch (o.direction) {
                case "left":
                    div.css("width", (liWidth * o.visible) + "px");
                    ul.css("width", (liWidth * liSize) + "px");
                    li.css("float", "left");
                    break;
                case "up":
                    div.css({"height": (liHeight * o.visible) + "px"});
                    ul.css("height", (liHeight * liSize) + "px");
                    break;
            }


            var mar = setInterval(marquee, o.speed);
            ul.hover(
                function () {
                    clearInterval(mar);
                },
                function () {
                    mar = setInterval(marquee, o.speed);
                }
            );
        };

        function marquee() {
            if (o.direction == "left") {
                if (div.scrollLeft() >= ulWidth) {
                    div.scrollLeft(0);
                }
                else {
                    var leftNum = div.scrollLeft();
                    leftNum += parseInt(o.step);
                    div.scrollLeft(leftNum)
                }
            }

            if (o.direction == "up") {
                if (div.scrollTop() >= ulHeight) {
                    div.scrollTop(0);
                }
                else {
                    var topNum = div.scrollTop();
                    topNum += parseInt(o.step);
                    div.scrollTop(topNum);
                }
            }
        };
    };
})(jQuery);