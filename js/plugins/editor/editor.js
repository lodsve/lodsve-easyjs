/**
 * kindeditor组件
 * 
 * User: sunhao
 * Date: 12-09-20
 * Time: 下午21:49
 * @author Danny Sun(sunhao.java@gmail.com)
 */
(function($){
	//definition this component
	$.editor = $.editor || {};
	
	$.editor.defaults = {
		resize: 'none',						//是否可改变大小(none不可以,xy可以在xy方向改变,y可改变纵向的大小,其他都是不可改变)
		upload: false,						//是否可以上传本地图片
		width: '800px',						//编辑器宽度
		height: '400px',					//编辑器高度
		minWidth: '500px',					//编辑器最小宽度(当不可改变大小时,无用)
		minHeight: '200px',					//编辑器最小高度(当不可改变大小时,无用)
		designMode: true,					//是否禁用工具栏(可视化编辑代码)
		toolbar: 'default',					//工具栏(default, simple, font)
		noDisableItems: [],					//designMode 为false时，要保留的工具栏图标
		formatHTML: true,					//是否美化HTML代码
		theme: 'default',					//主题(指定simple时需要引入simple.css)
		language: 'zh_CN',					//语言(zh_cn)
		basePath: easyloader.base,			//domain
		paste: 2,							//设置粘贴类型，0:禁止粘贴, 1:纯文本粘贴, 2:HTML粘贴
		dialogType:	'page',					//设置弹出框(dialog)的对齐类型，可设置”“、”page”，指定page时按当前页面居中，指定空时按编辑器居中。
		mode: true,							//弹出层(dialog)显示阴影
		afterCreate: null,					//设置编辑器创建后执行的回调函数
		afterChange: null,					//编辑器内容发生变化后执行的回调函数
		otherEvent: {},						//一些其他的事件(afterTab,afterFocus,afterBlur,afterUpload,afterSelectFile)
		uploadUrl: '/upload/upload.do',		//上传文件的地址
		flashUpload: false,					//显示Flash上传按钮
		mediaUpload: false,					//显示视音频上传按钮
		fileUpload: false,					//显示文件上传按钮
		fileManager: false,					//显示浏览远程服务器按钮
		uploadParams: {}
	}
	
	$.fn.kindeditor = function(p){
		this.each(function(){
			p = $.extend({}, $.editor.defaults, p || {});
			//element
			var element = $(this);
			
			var id = element.attr('id');
			
			if(id ==''){
				alert('缺少容器ID!');
				return;
			}
			
			var f = {
				init: function(){
					var config = {};
					
					var resizeType = 0;
					if(p.resize == 'xy'){
						resizeType = 2;
					} else if(p.resize == 'y'){
						resizeType = 1;
					}
					
					var afterCreate = null;
					if(p.afterCreate && typeof(p.afterCreate) == 'string'){
						afterCreate = $.util.decode(p.afterCreate);
					}
					
					var afterChange = null;
					if(p.afterChange && typeof(p.afterChange) == 'string'){
						afterChange = $.util.decode(p.afterChange);
					}
					
					var uploadUrl = p.basePath + p.uploadUrl;
					
					var toolbar = $.editor.toolbar[p.toolbar];
					if(!toolbar || toolbar.length == 0){
						toolbar = $.editor.toolbar['default'];
					}
					
						//值											描述								默认值
					config.resizeType = resizeType;				//是否可以改变大小					0
					config.allowPreviewEmoticons = true;		//表情组件是否是有预览的				true
					config.allowImageUpload = p.upload;			//是否可以上传本地图片				false
					config.width = p.width;						//宽度								800
					config.height = p.height;					//高度								400
					config.designMode = p.designMode;			//可视化模式true或代码模式false		true
					if(p.noDisableItems && p.noDisableItems.length > 0){
						config.noDisableItems = p.noDisableItems;//要保留的工具栏图标					[]
					}
					config.wellFormatMode = p.formatHTML;		//是否美化HTML代码					true
					config.themeType = p.theme;					//主题								default
					config.langType = p.language;				//语言								zh_cn
					config.basePath = p.basePath + 'kindeditor/';
																//指定编辑器的根目录路径				YAHOO.util.getContextPath()
					config.newlineTag = 'br';					//设置回车换行标签，可设置”p”、”br”	br
					config.pasteType = p.paste;					//设置粘贴类型						2
					config.dialogAlignType = p.dialogType;		//设置弹出框(dialog)的对齐类型		page
					config.shadowMode = p.mode;					//弹出层(dialog)显示阴影				true
					config.afterCreate = afterCreate;			//设置编辑器创建后执行的回调函数		null
					config.afterChange = afterChange;			//编辑器内容发生变化后执行的回调函数	null
					config.uploadJson = uploadUrl;				//指定上传文件的服务器端程序			basePath + '/upload/upload.do'
					config.allowFileManager = p.fileManager;	//显示浏览远程服务器按钮				false
					//config.fileManagerJson = 
					config.allowFlashUpload = p.flashUpload;	//显示Flash上传按钮					false
					config.allowMediaUpload = p.mediaUpload;	//显示视音频上传按钮					false
					config.allowFileUpload = p.fileUpload;		//显示文件上传按钮					false
					config.fullscreenShortcut = false;			//启用ESC全屏快捷键					false
					config.extraFileUploadParams = p.uploadParams;									//{}
																//上传图片、Flash、视音频、文件时，支持添加别的参数一并传到服务器。
					config.items = toolbar;						//工具栏								//默认是default的,全部展示
					
					return config;
				},
				create: function(){
					var config = f.init();
					
					return KindEditor.create('textarea[id="' + id + '"]', config);
				}
			};
			
			return f.create();
		});
	}

})(jQuery)