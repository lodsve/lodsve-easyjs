/**
 * ie的一些bug处理
 *
 * User: sunhao
 * Date: 13-6-30
 * Time: 上午12:21
 * @author sunhao(sunhao.java@gmail.com)
 */
(function($){
    //定义组件
    $.ieBug = $.ieBug || {};

    /**
     * ie上实现placeholder
     *
     * @param p
     */
    $.ieBug.placeholder = function(){
        //获取页面包含placeholder属性的元素
        var placeholderEl = $('[placeholder]');

        if(!('placeholder' in document.createElement('input'))){
            //表示这个浏览器的dom不能创建含有placeholder属性的input
            placeholderEl.focus(function(){
                var input = $(this);
                if(input.val() == input.attr('placeholder')){
                    input.val('');
                }
            }).blur(function(){
                var input = $(this);
                if(input.val() == ''){
                    input.val(input.attr('placeholder'));
                }
            }).blur();

            //closest() 方法获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上。
            placeholderEl.closest('form').submit(function(){
                $('[placeholder]').each(function () {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }
    }
})(jQuery)