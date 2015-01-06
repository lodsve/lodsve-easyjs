/**
 * JS工具类
 * User: sunhao
 * Date: 12-07-16
 * Time: 下午10:30
 * @author sunhao(sunhao.java@gmail.com)
 */
(function($){
	$.file = $.file || {};
	/**
	 * 文件后缀名的MAP，以后要是增加文件类型，直接管理此处即可
	 */
	$.file.extTypeIconMap = {
		'avi':'avi.gif',
	    'bmp':'bmp.gif',
	    'dll':'dll.gif',
	    'doc':'doc.gif',
	    'docx':'doc.gif',
	    'exe':'exe.gif',
	    'gif':'png.gif',
	    'htm':'htm.gif',
	    'html':'htm.gif',
	    'jpg':'jpg.gif',
	    'jpeg':'jpg.gif',
	    'mdb':'mdb.gif',
	    'mp3':'mp3.gif',
	    'pdf':'pdf.gif',
	    'png':'png.gif',
	    'ppt':'ppt.gif',
	    'pptx':'ppt.gif',
	    'rar':'rar.gif',
	    'rm':'rm.gif',
	    'rmvb':'rm.gif',
	    'swf':'swf.gif',
	    'txt':'txt.gif',
	    'wma':'wma.gif',
	    'wmv':'wmv.gif',
	    'xls':'xls.gif',
	    'zip':'zip.gif',
	    'unknow':'unknow.gif'
	}
	/*****************************************************************************************************************************************/
	$.emoticon = $.emoticon || {};
	/**
	 * 表情文件名和表情名称的MAP
	 */
	$.emoticon.titles0 = ['微笑','撇嘴','色','发呆','得意','流泪','害羞','闭嘴','睡','大哭','尴尬','发怒','调皮','呲牙','惊讶','难过','酷','冷汗','抓狂','吐','偷笑','可爱','白眼','傲慢','饥饿','困','惊恐','流汗','憨笑','大兵','奋斗','咒骂','疑问','嘘','晕','折磨','衰','骷髅','敲打','再见','擦汗','抠鼻','鼓掌','糗大了','坏笑','左哼哼','右哼哼','哈欠','鄙视','委屈','快哭了','阴险','亲亲','吓','可怜','菜刀','西瓜','啤酒','篮球','乒乓','咖啡','饭','猪头','玫瑰','凋谢','示爱','爱心','心碎','蛋糕','闪电','炸弹','刀','足球','瓢虫','便便','月亮','太阳','礼物','拥抱','强','弱','握手','胜利','抱拳','勾引','拳头','差劲','爱你','NO','OK','爱情','飞吻','跳跳','发抖','怄火','转圈','磕头','回头','跳绳','挥手','激动','街舞','献吻','左太极','右太极'];
	$.emoticon.titles1 = ['可爱','开心','害羞','挤眼','色','飞吻','亲亲','发呆','思考','呲牙','调皮','赖皮','无感','奸笑','汗','惆怅','伤心','崩溃','流汗','冷汗','衰','晕','流泪','大哭','笑抽','混乱','恐怖','生气','发怒','瞌睡','感冒','魔鬼','外星人','黄心','篮心','紫心','粉心','绿心','爱心','心碎','喜欢','爱神箭','星星','金星','青筋','叹号','问号','睡觉','喷气','水滴','音符','音乐','火焰','便便','强','鄙视','OK','出拳','拳头','胜利','手掌','停','双手','向上','向下','向右','向左','不是我','拜佛','第一','鼓掌','肌肉','走路','跑步','情侣','美女','跳舞','抱头','交叉','摆手','考试','接吻','爱情','洗头','剪发','美甲','男孩','女孩','妈妈','爸爸','奶奶','爷爷','学生','小贩','农民','工人','警察','天使','公主','士兵','骷髅','脚印','吻','嘴唇','耳朵','眼睛','鼻子','太阳','下雨','多云','雪人','月亮','闪电','晕','浪花','猫咪','狗狗','灰鼠','花鼠','兔子','狼狗','青蛙','老虎','考拉','灰熊','猪头','牛','野猪','小猴','小马','骏马','骆驼','绵羊','大象','蛇','灰鸟','黄鸟','小鸡','啄木鸟','毛毛虫','章鱼','猴子','热带鱼','鱼儿','鲸','海豚','康乃馨','桃花','郁金香','四叶草','玫瑰','向日葵','鲜花','枫叶','绿叶','黄叶','椰树','仙人掌','兰花','贝壳','盆景','爱的礼物','婚礼','箱子','套装','鲤鱼旗','烟花','焰火','风铃','夜色','南瓜灯','小鬼','圣诞老人','圣诞树','礼物','铃铛','礼花','气球','光盘','CD','摄像机','电脑','电视','手机','传真','电话','唱片','磁带','声音','大喇叭','小喇叭','收音机','广播','眼镜','放大镜','开锁','锁头','钥匙','剪刀','榔头','灯泡','来电','来信','收件箱','信箱','浴缸','马桶','座椅','金钱','金冠','香烟','炸弹','手枪','药丸','针管','橄榄球','篮球','足球','棒球','网球','高尔夫','台球','游泳','冲浪','滑雪','黑桃','红心','梅花','方块','奖杯','打怪','箭靶','麻将','电影','写字','书','绘画','唱歌','听歌','喇叭','萨克斯','吉他','道具','男鞋','女鞋','高跟鞋','靴子','上衣','衬衫','连衣裙','和服','内衣','蝴蝶结','礼貌','皇冠','草帽','雨伞','男包','女包','口红','戒指','钻石','咖啡','绿茶','啤酒','对饮','鸡尾酒','米酒','刀叉','汉堡','意面','盖浇饭','盒饭','寿司','饭团','点心','米饭','面条','汤','面包','鸡蛋','关东煮','丸子','冰淇淋','刨冰','生日蛋糕','蛋糕','苹果','橙子','西瓜','草莓','茄子','番茄','房子','学校','大厦','楼房','医院','银行','便利店','爱心酒店','酒店','爱心教堂','教堂','警局','黄昏','傍晚','油罐','亭子','城堡','帐篷','烟囱','东京塔','富士山','朝阳','夕阳','流星','自由女神','彩虹','摩天轮','喷泉','过山车','游轮','快艇','帆船','飞机','火箭','单车','汽车','小车','出租车','公交车','警车','消防车','救护车','卡车','电车','火车','动车','高铁','钞票','加油站','红绿灯','警告','路障','盾牌','取款机','密码锁','路牌','理发店','温泉','黑白格旗','日本旗','日本','韩国','中国','美国','法国','西班牙','意大利','英国','德国','一','二','三','四','五','六','七','八','九','零','井号','向上','向下','向左','向右','右上','左上','右下','左下','左箭头','右箭头','快退','快进','OK','新','顶','向上','酷','摄影','这里','信号','满','空','获取','转让','手指','营业中','是','无','本月','报名','平假名','厕所','男厕','女厕','婴儿','禁烟','停车','轮椅','列车','厕所','保密','祝福','十八禁','ID','星号','标记','心','对战','手机','关机','股价','汇率','白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼','图标','星座','A型','B型','AB型','O型','绿','红','紫','十二点','一点','二点','三点'];
	
	$.emoticon.icons = [];
	
	for(var i=100, j = i + $.emoticon.titles0.length; i < j; i++){
		$.emoticon.icons.push({
			id: i,
			title: $.emoticon.titles0[i-100],
			index: $.emoticon.icons.length
		});
	}
	for(var i=7000, j = i + $.emoticon.titles1.length; i < j; i++){
		$.emoticon.icons.push({
			id: i,
			title: $.emoticon.titles1[i-7000],
			index: $.emoticon.icons.length
		});
	}
	/*****************************************************************************************************************************************/
	/**
	 * kindeditor编辑器的工具栏定义(三个:default, simple, font)
	 */
	$.editor = $.editor || {};
	$.editor.toolbar = {
		'default': [
    		'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'cut', 'copy', 'paste',
    		'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
    		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
    		'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
    		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
    		'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',
    		'flash', 'media', 'table', 'hr', 'emoticons', 'map', 'code', 'pagebreak', 'anchor', 'link', 'unlink', '|', 'about'
    	],
    	'simple': [
    	    'source', 'fullscreen', 'preview', '|', 'undo', 'redo', '|', 'cut', 'copy', 'paste', 'quickformat', 'selectall', '|',
    	    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
    		'italic', 'underline', 'strikethrough', 'removeformat', '|', 'emoticons', 'image',
    		'flash', 'media', 'table', 'hr', 'map', 'code', 'pagebreak', 'link', 'unlink'
    	],
    	'font': [
    		'source', 'fullscreen', 'preview', '|', 'undo', 'redo', '|', 'cut', 'copy', 'paste', 'quickformat', 'selectall', '|',
    		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
    		'italic', 'underline', 'strikethrough', 'hr', '|', 'emoticons'
    	]
    };
	/*****************************************************************************************************************************************/
	
	$.extend({
        //jquery的自定义命名空间为util
		util: {
			/**
             * 获取i18n的资源内容
             *
             * @param {Object} code		properties文件中的key
             * @param {Object} args		需要替换形似{0},{1},...的真实值
             * @return {TypeName}
             */
            getMessage: function(code, args){
                if(!$.messages){
                    return code;
                }

                var value = $.messages[code];

                if(args && value && value.indexOf('{') != -1){
                    for(var i = 0; i < args.length; i++){
                        var replace = new String('{' + i + '}');
                        value = value.replace(replace, args[i]);
                    }
                }

                return value;
            },
            /**
             * 获取系统配置
             *
             * @param {Object} code		配置文件中的key
             * @return {TypeName}
             */
            getConfig: function(code){
                if(!$.configs){
                    return code;
                }

                var value;
                try{
                    value = $.configs[code];
                } catch(e){
                    value = code;
                }

                return value;
            },
			/**
			 * 根据文件名获取此格式文件的图标
			 * 
			 * @param {Object} filename		文件名
			 * @return {TypeName} 
			 */
			postfixImg: function(filename){
				var extmap = $.file.extTypeIconMap;
			    if(!extmap){
			        return "unknow.gif";
			    }
			
			    var split = '.',ext,index = filename.lastIndexOf(split),mapKey = 'unknow';
			    if(filename.indexOf(split) != -1) {
			        mapKey = filename.substring(index + 1, filename.length);
			    }
			    ext = extmap[mapKey.toLocaleLowerCase()];
			    return !ext ? "unknow.gif" : ext;
			},
			/**
			 * 获取一个链接中参数指定key的值
			 * 
			 * @param {Object} href			链接
			 * @param {Object} key			key
			 * @return {TypeName} 
			 */
			getParam: function(href, key){
				if(!href)
					return '';
				
				var arrays = href.split('?');
				if(arrays.length != 2)
					return '';
				
				var params = arrays[1];
				var param = params.split('&');
				for(var p in param){
					var k = param[parseInt(p)].split('=');
					if(k[0] == key)
						return k[1];
				}
			},
			/**
			 * 判断一个对象是否在一个数组中
			 * 
			 * @param {Object} value		对象
			 * @param {Object} array		数组
			 * @return {TypeName} 
			 */
			contain: function(value, array){
				if(typeof(value) == 'undefined' || value == '')
					return true;
				
				if(typeof(array) == 'undefined' || array == null)
					return false;
				
				for(var a in array){
					if(value == array[a])
						return true;
				}
				
				return false;
			},
			/**
			 * 根据表情的名字获取表情所在页码和表情的中文名
			 * [所在页码, 中文名]
			 * 
			 * @param {Object} emoticonName		表情的名字
			 * @return {TypeName} 
			 */
			getEmoticonTitle: function(emoticonName){
				var emoticons = $.emoticon.icons;
				if(!emoticonName)
					return '';
				
				if(emoticonName.indexOf('e') == -1)
					return '';
				
				var emoticonId = emoticonName.substring(1);
				var title = '';
				var index = 1;
				
				if(parseInt(emoticonId) > 7449)
					return null;
				
				for(var i in emoticons){
					var icon = emoticons[i];
					
					if(icon.id == emoticonId){
						title = icon.title;
						index = icon.index;
						break;
					}
				}
				
				return [parseInt(index / 105) + 1, title];
			},
			/**
			 * 将指定字符串中的表情标签转变成对应的表情
			 * 
			 * @param content		指定字符串
			 * @returns {String}
			 */
			toEmonicon: function(content){
				if(!content)
					return "";
				//取出表情的正则表达式
				var reg = /\[e[0-9]{3,4}\]/g;
				
				var emoticons = content.match(reg);
				
				if(!emoticons)
					return content;
				
				for(var i = 0; i < emoticons.length; i++){
					var icon = emoticons[i];
					
					var reg = /e[0-9]{3,4}/g;
					var name = icon.match(reg)[0];
					var icon = $.util.getEmoticonTitle(name);
					
					if(!icon)
						continue;
					
					var img = '<img src="' + easyloader.base + 'plugins/images/emoticon/images/' +
			                icon[0] + '/' + name + '.gif" title="' + icon[1] + '">';
					
					content = content.replace('[' + name + ']', img);
				}
				
				return content;
			},
			/**
			 * eval一个json字符串
			 * 
			 * @param json			json
			 * @returns {String}
			 */
			decode: function(json){
				try{
					if(json)
						return eval('(' + json + ')');
					else
						return null;
				} catch(e){
					return null;
				}
			},
			/**
			 * 获取系统contextPath【有错误 不要使用】
			 * @returns {String}
			 */
			getContextPath: function(){
				var location = window.location;
			    return "/" + location.pathname.split("/")[1];
			},
            stringify: function(json){
                var result = '';
                if ($.browser.msie) {
                    if ($.browser.version == "7.0" || $.browser.version == "6.0"
                        || $.browser.version == "8.0"
                        || $.browser.version == "9.0") {
                        result = jQuery.parseJSON(json);
                    } else {
                        result = JSON.stringify(json);
                    }
                } else {
                    result = JSON.stringify(json);
                }

                return result;
            },
            isIE: function(version){
                if(version) version = "";

                var ie = (navigator.appName == "Microsoft Internet Explorer"
                    && parseInt(navigator.appVersion) == 4
                    && navigator.appVersion.indexOf("MSIE ") != -1);

                return ie;
            },
            /**
             * 选中文本框中的文字(文字范围)
             *
             * @param edit
             * @param start
             * @param end
             */
            selectText: function(edit, start, end){
                var edit_ = $(edit)[0];
                if (edit_.setSelectionRange) {
                    edit_.focus();
                    edit_.setSelectionRange(start, end);
                } else if (edit_.createTextRange) {
                    var textRange = edit_.createTextRange();
                    textRange.collapse(true);
                    textRange.moveEnd("character", start);
                    textRange.moveStart("character", end);
                    textRange.select();
                } else {
                    if(window.console)
                        console.log('对象不支持选择文字!')
                }
            }
		}
	});
})(jQuery)