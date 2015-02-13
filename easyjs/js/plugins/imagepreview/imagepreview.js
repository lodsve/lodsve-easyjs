/*由于大图绑定在href属性中，故一般而言，需使用a标签的href指向大图。仅支持png,gif,jpg,bmp四种格式的图片。用法是：目标.preview();
 *例如：<a href="xx.jpg">图片</a>
 *$("a").preview();就可以了
 */
(function($){
	$.fn.preview = function(){
		var xOffset = 10;
		var yOffset = 20;
		var w = $(window).width();
		$(this).each(function(){

            var g = {
                init: function(){
                    var html = [];
                    html.push("<div>");
                    html.push(" <div class='first'>");
                    html.push("     <img src='" + g.ele.attr('href') + "'/>");
                    html.push("     <p>" + g.ele.attr('title') + "</p>");
                    html.push(" </div>");
                    html.push("</div>");

                    g.preview = $(html.join(""));
                    $("body").append(g.preview);
                },
                addCss: function(e){
                    g.preview.css({
                        position:"absolute",
                        padding:"4px",
                        border:"1px solid #f3f3f3",
                        backgroundColor:"#eeeeee",
                        top: g.getTop(e) + "px",
                        zIndex:1000
                    });

                    $("div.first", g.preview).css({
                        padding:"5px",
                        backgroundColor:"white",
                        border:"1px solid #cccccc"
                    });

                    $("div.first > p", g.preview).css({
                        textAlign:"center",
                        fontSize:"12px",
                        padding:"8px 0 3px",
                        margin:"0"
                    });

                    if(e.pageX < w/2){
                        g.preview.css({
                            left: e.pageX + xOffset + "px",
                            right: "auto"
                        }).fadeIn("fast");
                    }else{
                        g.preview.css("right",(w - e.pageX + yOffset) + "px").css("left", "auto").fadeIn("fast");
                    }
                },
                getTop: function(e){
                    var mouseY = e.pageY;
                    //浏览器可见部分的高度
                    var height = $(window).height();
                    var previewHeight = g.preview.height();

                    if(height - mouseY - previewHeight > 0){
                        return mouseY + yOffset;
                    } else {
                        return mouseY - yOffset - previewHeight;
                    }
                }
            }

            g.ele = $(this);

            g.ele.hover(function(e){
                g.init();
                g.addCss(e);

                g.ele.mousemove(function(e){
                    g.preview.css("top",g.getTop(e) + "px");
                    if(e.pageX < w/2){
                        g.preview.css("left",(e.pageX + yOffset) + "px").css("right","auto");
                    }else{
                        g.preview.css("right",(w - e.pageX + yOffset) + "px").css("left","auto");
                    }
                });
            }, function(){
                g.preview.remove();
            })
		});
	};
})(jQuery);