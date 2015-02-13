/*
 * easyloader - jQuery EasyUI
 *
 * Licensed under the GPL:
 * http://www.gnu.org/licenses/gpl.txt
 *
 * Copyright 2010 stworthy [ stworthy@gmail.com ]
 *
 */
(function ($) {
    //将所有的插件，和插件资源和依赖文件放进modules对象中。
    var modules = {};
    //将国际化文件放入一个locales对象中
    var locales = {
        'af': 'easyui-lang-af.js',
        'bg': 'easyui-lang-bg.js',
        'ca': 'easyui-lang-ca.js',
        'cs': 'easyui-lang-cs.js',
        'da': 'easyui-lang-da.js',
        'de': 'easyui-lang-de.js',
        'en': 'easyui-lang-en.js',
        'fr': 'easyui-lang-fr.js',
        'nl': 'easyui-lang-nl.js',
        'zh_CN': 'easyui-lang-zh_CN.js',
        'zh_TW': 'easyui-lang-zh_TW.js'
    };

    //定义一个局部变量，做循环遍历时候，存放状态
    var queues = {};

    //加载js方法
    function loadJs(url, callback) {
        //标志变量，js是否加载并执行
        var done = false;
        var script = document.createElement('script');//创建script dom
        script.type = 'text/javascript';
        script.language = 'javascript';
        script.src = url;
        script.onload = script.onreadystatechange = function () { //onload是firefox 浏览器事件，onreadystatechange,是ie的，为了兼容，两个都写上，这样写会导致内存泄露
            //script.readyState只是ie下有这个属性，如果这个值为undefined，说明是在firefox,就直接可以执行下面的代码了。反之为ie，需要对script.readyState
            //状态具体值进行判别，loaded和complete状态表示，脚本加载了并执行了。
            if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
                done = true;

                script.onload = script.onreadystatechange = null;//释放内存，还会泄露。
                if (callback) {//加载后执行回调
                    callback.call(script);
                }
            }
        }
        //具体加载动作，上面的onload是注册事件，
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    //运行js ,看代码逻辑可知，运行js,只是在js执行后，将这个script删除而已，主要用来加载国际化文件
    function runJs(url, callback) {
        loadJs(url, function () {
            document.getElementsByTagName("head")[0].removeChild(this);
            if (callback) {
                callback();
            }
        });
    }

    //加载css没什么好说的
    function loadCss(url, callback) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.media = 'screen';
        link.href = url;
        document.getElementsByTagName('head')[0].appendChild(link);
        if (callback) {
            callback.call(link);
        }
    }

    //加载单一一个plugin,仔细研究module ,可以发现，pingin之间通过dependence,构造成了一颗依赖树，
    //这个方法，就是加载具体树中的一个节点
    function loadSingle(name, callback) {
        //把整个plugin的状态设置为loading
        queues[name] = 'loading';

        var module = modules[name];
        //把js状态设置为loading
        var jsStatus = 'loading';
        //如果允许css,并且plugin有css,则加载css,否则设置加载过了，其实是不加载
        var cssStatus = 'loaded';

        if (module != undefined) {
            cssStatus = (easyloader.css && module['css']) ? 'loading' : 'loaded';
        }
        var url = '';

        //加载css,plugin 的css，如果是全称，就用全称，否则把简写换成全称，所以简写的css文件要放入到themes/type./文件下
        if (module != undefined) {
            if (easyloader.css && module['css']) {
                if (/^http/i.test(module['css'])) {
                    url = module['css'];
                } else {
                    url = easyloader.base + easyloader.pluginsStr + easyloader.splitStr
                    + name + easyloader.splitStr + easyloader.theme + easyloader.splitStr + module['css'];

                }
                loadCss(url, function () {
                    cssStatus = 'loaded';
                    //js， css加载完，才调用回调
                    if (jsStatus == 'loaded' && cssStatus == 'loaded') {
                        finish();
                    }
                });
            }
        }

        //加载js,全称用全称，简写补全。
        //if (/\.js$/i.test(name) && /^\/js/i.test(name)) {
        if (/\.js$/i.test(name) && !(/^http/i.test(name))) {
            //已.js结尾，/js打头
            url = easyloader.base + name;
        } else if (/^http/i.test(module['js'])) {
            // 如果module里面直接加载的是远程js，则直接加载
            url = module['js'];
        } else {
            url = easyloader.base + easyloader.pluginsStr + easyloader.splitStr + name + easyloader.splitStr + module['js'];
        }
        loadJs(url, function () {
            jsStatus = 'loaded';
            if (jsStatus == 'loaded' && cssStatus == 'loaded') {
                finish();
            }
        });
        //加载完调用的方法，改plugin状态
        function finish() {
            queues[name] = 'loaded';
            //调用正在加载的方法，其实已经加载完了，
            easyloader.onProgress(name);
            if (callback) {
                callback();
            }
        }
    }

    //加载主模块入口，
    function loadModule(name, callback) {
        //定义数组，最后是形成的是依赖插件列表，最独立的插件放在首位，name是末尾
        var mm = [];
        var doLoad = false;
        //name有两种，一种是string ,一种是string array,这样一次可以加载多个plugin,都是调用add方法进行添加
        if (typeof name == 'string') {
            add(name);
        } else {
            for (var i = 0; i < name.length; i++) {
                add(name[i]);
            }
        }

        function add(name) {
            //如果是.js直接放入的队列
            if (/\.js$/i.test(name)) {
                mm.push(name);
            } else {
                //如果modules中没有这个plugin那退出,如果是加载直接记在js文件不进行判断
                if (!modules[name]) return;
                //如果有，查看它是否依赖其他plugin
                var d = modules[name]['dependencies'];
                //如果依赖，就加载依赖的plugin.同时在加载依赖的plugin的依赖。注意循环中调用了add,是递归
                if (d) {
                    for (var i = 0; i < d.length; i++) {
                        add(d[i]);
                    }
                }

                mm.push(name);
            }
        }

        function finish() {
            if (callback) {
                callback();
            }
            //调用onLoad，传递name 为参数
            easyloader.onLoad(name);
        }

        //形成依赖树，不行还没有做实质性工作呢，那就是加载。打起精神来，最核心的代码就是以下的了
        //超时用
        var time = 0;
        //定义一个加载方法，定义后直接调用
        function loadMm() {
            //如果mm有长度，长度！=0,加载plugin,为0，即加载完毕，开始加载国际化文件。
            if (mm.length) {
                var m = mm[0];	// the first module
                if (!queues[m]) {//状态序列中没有这个plugin的信息，说明没有加载这个plug,调用laodSingle进行加载
                    doLoad = true;
                    //加载插件
                    loadSingle(m, function () {
                        mm.shift();//加载完成后，将这个元素从数组去除，在继续加载，直到数组
                        loadMm();
                    });
                } else if (queues[m] == 'loaded') {//如果这个plugin已经加载，就不用加载，以为mm中可能有重复项
                    mm.shift();
                    loadMm();
                } else {
                    if (time < easyloader.timeout) {//超时时候，10秒钟调用一次loadMn().注意arguments.callee代表函数本身
                        time += 10;
                        setTimeout(arguments.callee, 10);
                    }
                }
            } else {
                if (easyloader.locale && doLoad == true && locales[easyloader.locale]) {
                    var url = easyloader.base + 'locale/' + locales[easyloader.locale];
                    runJs(url, function () {
                        finish();
                    });
                } else {
                    finish();
                }
            }
        }

        loadMm();
    }

    function makeModule(name, callback) {
        if (!easyloader.pluginsJsDone) {
            var jsonUrl = easyloader.base + "plugins.js";
            //通过 HTTP GET请求从服务器载入一个JavaScript文件,异步执行
            $.get(jsonUrl, function (data) {
                /**
                 * 将module装配完成，在执行回调函数
                 */
                for (var i = 0; i < data.length; ++i) {
                    var tpModuleName = data[i].moduleName;
                    var tpModuleJs = data[i].moduleJs;
                    var tpModuleCss = data[i].moduleCss
                    var tpModuleDependencies = data[i].moduleDependencies;

                    //如果直接传递一个插件名，就去module数组中加载。改方法是重点，也是easyui自带的plugin加载方式
                    if (tpModuleName == undefined || tpModuleJs == undefined) return;

                    /**
                     * 如果依赖其他module,则最从最低底加载
                     */
                    if(easyloader.compress) {
                        tpModuleJs = tpModuleJs.substring(0, tpModuleJs.indexOf(".js")) + ".min.js";
                    }
                    easyloader.modules[tpModuleName] = {js: tpModuleJs}
                    //css附加
                    if (tpModuleCss != undefined) {
                        //直接对象赋值
                        easyloader.modules[tpModuleName].css = tpModuleCss;
                    }

                    //依赖组件定义,不能js和模块名混合写
                    if (tpModuleDependencies != undefined) {
                        easyloader.modules[tpModuleName].dependencies = [];
                        if (typeof tpModuleDependencies == 'string') {
                            easyloader.modules[tpModuleName].dependencies.push(tpModuleDependencies);
                        } else {
                            for (var j = 0; j < tpModuleDependencies.length; ++j) {
                                easyloader.modules[tpModuleName].dependencies.push(tpModuleDependencies[j])
                            }
                        }
                    }
                }

                easyloader.pluginsJsDone = true;

                loadModule(name, callback);
            }, "json");
        } else {
            loadModule(name, callback);
        }
    }

    //定义一个加载器，注意，是全局变量，没有var,
    easyloader = {
        modules: modules,
        locales: locales,
        base: '.', //该属性是为了加载js,记录文件夹路径的
        theme: 'default', //默认主题
        css: true,
        pluginsStr: 'plugins',
        splitStr: '/',
        URI: '',
        compress: false,    //是否使用压缩后的js
        pluginsJsDone: false,
        locale: null,
        timeout: 2000, //加载超时事件
        load: function (name, callback) {
            //如果加载是*.css文件，判断是不是以http开头，如果是，直接调用
            if (/\.css$/i.test(name)) {
                if (/^http/i.test(name)) {
                    loadCss(name, callback);
                } else {
                    //不是http的，加上base.文件夹路径
                    loadCss(easyloader.base + name, callback);
                }
            }
            //加载js文件
            else if (/\.js$/i.test(name) && (typeof name == 'string')) {
                if (/^http/i.test(name) || /^\//i.test(name)) {
                    loadJs(name, callback);
                } else {
                    loadJs(easyloader.base + name, callback);
                }
            } else {
                //构造module关系树,name有两种，一种是string ,一种是string array,这样一次可以加载多个plugin,都是调用add方法进行添加
                makeModule(name, callback);
            }
        },
        onProgress: function (name) {
        },
        onLoad: function (name) {
        }
    };
    //以上一直在定义函数，和变量，此处为真正执行处
    //获取页面的所有的script,主要是为了获取我们现在解释的easyloader.js文件路径，来设置base属性
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (!src) continue;
        var m = src.match(/easyloader\.js(\W|$)/i);//判断文件是否含有easyloadr.js
        if (m) {
            //如果有，base为easyloadr.js 的相同前缀
            easyloader.base = src.substring(0, m.index);
        }
    }

    if (window.jQuery) {
        jQuery(function () {
            //每个页面默认引入base.js
            //判断页面是否已引入base.js
            if (!jQuery.util) {
                loadJs(easyloader.base + 'base' + (easyloader.compress ? ".min.js" : ".js"));
            }
        });
    }

    //定义一个简化调用接口
    window.using = easyloader.load;

})(jQuery);
