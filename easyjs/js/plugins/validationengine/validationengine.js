/*
 * Inline Form Validation Engine 1.6.4, jQuery plugin
 *
 * Copyright(c) 2009, Cedric Dugas
 * http://www.position-relative.net
 *
 * Form validation engine allowing custom regex rules to be added.
 * Thanks to Francois Duquette and Teddy Limousin
 * and everyone helping me find bugs on the forum
 * Licenced under the MIT Licence
 */

(function ($) {
    $.fn.validationEngine = function (settings) {

        if ($.validationEngineLanguage) {                // IS THERE A LANGUAGE LOCALISATION ?
            allRules = $.validationEngineLanguage.allRules;
        } else {
            $.validationEngine.debug("Validation engine rules are not loaded check your external file");
        }
        settings = jQuery.extend({
                    allrules:allRules,
                    validationEventTriggers:"focusout",
                    inlineValidation:true,
                    returnIsValid:false,
                    liveEvent:true,
                    unbindEngine:true,
                    ajaxSubmit:false,
                    scroll:true,
                    promptPosition:"topRight", // OPENNING BOX POSITION, IMPLEMENTED: topLeft, topRight, bottomLeft, centerRight, bottomRight
                    success:false,
                    tabArray:[],
                    beforeSuccess:function () {
                    },
                    failure:function () {

                    }
                }, settings);
        $.validationEngine.settings = settings;
        $.validationEngine.ajaxValidArray = new Array();	// ARRAY FOR AJAX: VALIDATION MEMORY

        if (settings.inlineValidation == true) {         // Validating Inline ?
            if (!settings.returnIsValid) {                    // NEEDED FOR THE SETTING returnIsValid
                allowReturnIsvalid = false;
                if (settings.liveEvent) {                        // LIVE event, vast performance improvement over BIND
                    $(this).find("[class*=validate][type!=checkbox]").live(settings.validationEventTriggers, function (caller) {
                        _inlinEvent(this);
                    })
                    $(this).find("[class*=validate][type=checkbox]").live("click", function (caller) {
                        _inlinEvent(this);
                    })
                } else {
                    $(this).find("[class*=validate]").not("[type=checkbox]").bind(settings.validationEventTriggers, function (caller) {
                        _inlinEvent(this);
                    })
                    $(this).find("[class*=validate][type=checkbox]").bind("click", function (caller) {
                        _inlinEvent(this);
                    })
                }
                firstvalid = false;
            }
            function _inlinEvent(caller) {
                $.validationEngine.settings = settings;
                if ($.validationEngine.intercept == false || !$.validationEngine.intercept) {        // STOP INLINE VALIDATION THIS TIME ONLY
                    $.validationEngine.onSubmitValid = false;
                    $.validationEngine.loadValidation(caller);
                } else {
                    $.validationEngine.intercept = false;
                }
            }
        }
        if (settings.returnIsValid) {        // Do validation and return true or false, it bypass everything;
            if ($.validationEngine.submitValidation(this, settings)) {
                return false;
            } else {
                return true;
            }
        }

        $(this).bind("submit", function (caller) {   // ON FORM SUBMIT, CONTROL AJAX FUNCTION IF SPECIFIED ON DOCUMENT READY
            $.validationEngine.onSubmitValid = true;
            $.validationEngine.settings = settings;
            if ($.validationEngine.submitValidation(this, settings) == false) {
                if ($.validationEngine.submitForm(this, settings) == true) {
                    return false;
                }
            } else {
                settings.failure && settings.failure();
                return false;
            }
        })

        $(".formError").live("click", function () {     // REMOVE BOX ON CLICK
            $(this).fadeOut(150, function () {
                $(this).remove();
            })
        })
    };

    $.validationEngine = {
        defaultSetting:function (caller) {        // NOT GENERALLY USED, NEEDED FOR THE API, DO NOT TOUCH
            if ($.validationEngineLanguage) {
                allRules = $.validationEngineLanguage.allRules;
            } else {
                $.validationEngine.debug("Validation engine rules are not loaded check your external file");
            }
            settings = {
                allrules:allRules,
                validationEventTriggers:"blur",
                inlineValidation:true,
                returnIsValid:false,
                scroll:true,
                unbindEngine:true,
                ajaxSubmit:false,
                promptPosition:"topRight", // OPENNING BOX POSITION, IMPLEMENTED: topLeft, topRight, bottomLeft, centerRight, bottomRight
                success:false,
                failure:function () {
                }
            };
            $.validationEngine.settings = settings;
        },
        loadValidation:function (caller) {        // GET VALIDATIONS TO BE EXECUTED
            if (!$.validationEngine.settings) {
                $.validationEngine.defaultSetting()
            }
            rulesParsing = $(caller).attr('class');
            rulesRegExp = /\[(.*)\]/;
            getRules = rulesRegExp.exec(rulesParsing);
            str = getRules[1];
            pattern = /\[|,|\]|\|/;
            result = str.split(pattern);
            var validateCalll = $.validationEngine.validateCall(caller, result);
            return validateCalll;
        },
        validateCall:function (caller, rules) {    // EXECUTE VALIDATION REQUIRED BY THE USER FOR THIS FIELD
            var promptText = ""

            if (!$(caller).attr("id")) {
                $.validationEngine.debug("This field have no ID attribut( name & class displayed): " + $(caller).attr("name") + " " + $(caller).attr("class"))
            }

            caller = caller;
            ajaxValidate = false;
            var callerName = $(caller).attr("name");
            $.validationEngine.isError = false;
            $.validationEngine.showTriangle = true;
            callerType = $(caller).attr("type");

            for (i = 0; i < rules.length; i++) {
                switch (rules[i]) {
                    case "optional":
                        if (!$(caller).val()) {
                            $.validationEngine.closePrompt(caller);
                            return $.validationEngine.isError;
                        }
                        break;
                    case "required":
                        _required(caller, rules);
                        break;
                    case "custom":
                        _customRegex(caller, rules, i);
                        break;
                    case "doFilter":
                        _doFilter(caller, rules, i);
                        break;
                    case "exemptString":
                        _exemptString(caller, rules, i);
                        break;
                    case "ajax":
                        if (!$.validationEngine.onSubmitValid) {
                            _ajax(caller, rules, i);
                        }
                        ;
                        break;
                    case "length":
                        _length(caller, rules, i);
                        break;
                    case "maxCheckbox":
                        _maxCheckbox(caller, rules, i);
                        groupname = $(caller).attr("name");
                        caller = $("input[name='" + groupname + "']");
                        break;
                    case "minCheckbox":
                        _minCheckbox(caller, rules, i);
                        groupname = $(caller).attr("name");
                        caller = $("input[name='" + groupname + "']");
                        break;
                    case "equals":
                        _equals(caller, rules, i);
                        break;
                    case "accept":
                        _accept(caller, rules, i);
                        break;
                    case "funcCall":
                        _funcCall(caller, rules, i);
                        break;
                    case "limit":
                        _limit(caller, rules, i);
                        break;
                    default :
                        break;
                }
            }
            check();
            function check() {
                radioHack();
                if ($.validationEngine.isError == true) {
                    linkTofield = $.validationEngine.linkTofield(caller);

                    /*******************************************************/
                    /*多tab时做弹出提示*/
                    var tab = $(caller).parents(".l-tab-content-item");
                    if (tab && tab.is(":hidden")) {
                        if ($.validationEngine.settings.tabArray.length == 0) {
                            $.validationEngine.settings.tabArray.push(tab.attr("title"))
                        } else {
                            var flag = true;
                            for (var i in $.validationEngine.settings.tabArray) {
                                if ($.validationEngine.settings.tabArray[i] == tab.attr("title")) {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) {
                                $.validationEngine.settings.tabArray.push(tab.attr("title"));
                            }
                        }
                    }
                    /*******************************************************/

                    ($("div." + linkTofield).size() == 0) ? $.validationEngine.buildPrompt(caller, promptText, "error") : $.validationEngine.updatePromptText(caller, promptText);
                } else {
                    $.validationEngine.closePrompt(caller);
                }
            }


            /* UNFORTUNATE RADIO AND CHECKBOX GROUP HACKS */
            /* As my validation is looping input with id's we need a hack for my validation to understand to group these inputs */
            function radioHack() {
                if ($("input[name='" + callerName + "']").size() > 1 && (callerType == "radio" || callerType == "checkbox")) {        // Hack for radio/checkbox group button, the validation go the first radio/checkbox of the group
                    caller = $("input[name='" + callerName + "'][type!=hidden]:first");
                    $.validationEngine.showTriangle = false;
                }
            }

            /* VALIDATION FUNCTIONS */
            function _required(caller, rules) {   // VALIDATE BLANK FIELD
                callerType = $(caller).attr("type");
                if (callerType == "text" || callerType == "password" || callerType == "textarea" || callerType == "file") {
                    //edit by sunhao(haosun@wisedu.com)
                    //去除输入文本的所有空格，防止判空时误判
                    var value = ($(caller).val()).replace(/\s+/g, "");
                    if (!value) {
                        $.validationEngine.isError = true;
                        promptText += $.validationEngine.settings.allrules[rules[i]].alertText + "<br />";
                    }
                }
                if (callerType == "radio" || callerType == "checkbox") {
                    callerName = $(caller).attr("name");

                    if ($("input[name='" + callerName + "']:checked").size() == 0) {
                        $.validationEngine.isError = true;
                        if ($("input[name='" + callerName + "']").size() == 1) {
                            promptText += $.validationEngine.settings.allrules[rules[i]].alertTextCheckboxe + "<br />";
                        } else {
                            promptText += $.validationEngine.settings.allrules[rules[i]].alertTextCheckboxMultiple + "<br />";
                        }
                    }
                }
                if (callerType == "select-one") { // added by paul@kinetek.net for select boxes, Thank you
                    if (!$(caller).val()) {
                        $.validationEngine.isError = true;
                        promptText += $.validationEngine.settings.allrules[rules[i]].alertText + "<br />";
                    }
                }
                if (callerType == "select-multiple") { // added by paul@kinetek.net for select boxes, Thank you
                    if (!$(caller).find("option:selected").val()) {
                        $.validationEngine.isError = true;
                        promptText += $.validationEngine.settings.allrules[rules[i]].alertText + "<br />";
                    }
                }
            }

            function _customRegex(caller, rules, position) {         // VALIDATE REGEX RULES
                customRule = rules[position + 1];
                pattern = eval($.validationEngine.settings.allrules[customRule].regex);

                if (!pattern.test($(caller).attr('value'))) {
                    $.validationEngine.isError = true;
                    promptText += $.validationEngine.settings.allrules[customRule].alertText + "<br />";
                }
            }

            function _doFilter(caller, rules, position) {
                var filter = $(caller).attr('filter');
                var str = $(caller).attr('value');

                var regexp = new RegExp("^.+\.(?=EXT)(EXT)$".replace(/EXT/g, filter.split(/\s*,\s*/).join("|")), "gi").test(str);

                if (!regexp) {
                    $.validationEngine.isError = true;
                    promptText += "* 文件类型只支持" + filter + "<br />";
                }
            }

            function _exemptString(caller, rules, position) {         // VALIDATE REGEX RULES
                customString = rules[position + 1];
                if (customString == $(caller).attr('value')) {
                    $.validationEngine.isError = true;
                    promptText += $.validationEngine.settings.allrules['required'].alertText + "<br />";
                }
            }

            function _funcCall(caller, rules, position) {          // VALIDATE CUSTOM FUNCTIONS OUTSIDE OF THE ENGINE SCOPE
                customRule = rules[position + 1];
                funce = $.validationEngine.settings.allrules[customRule].nname;

                var fn = window[funce];
                if (typeof(fn) === 'function') {
                    var fn_result = fn();
                    $.validationEngine.isError = fn_result;
                    promptText += $.validationEngine.settings.allrules[customRule].alertText + "<br />";
                }
            }

            /**
             * 表单客户端ajax验证
             * 验证格式为class="validate[ajax['${contextPath}/doc/checkDirtyWord.do','right','loading','wrong']]"
             * @param caller
             * @param rules
             * @param position
             */
            function _ajax(caller, rules, position) {                 // VALIDATE AJAX RULES
                customAjaxRule = rules[position];
                var extraData = '';
                if (rules.length > 2) {
                    //往checkUrl后拼接参数
                    extraData = rules[position + 2].indexOf('=') > -1 ? '&' + rules[position + 2] : '';
                }

                //取得页面的参数
                postfile = eval(rules[position + 1]);
                alertOk = eval(rules[position + 2]);
                alertNo = eval(rules[position + 3]);

                //如果从页面上没有拿到参数，则使用默认的参数
                var ajaxCheckSetting = $.validationEngine.settings.allrules[customAjaxRule];
                postfile = postfile == undefined ? ajaxCheckSetting.file : postfile;
                alertOk = alertOk == undefined ? ajaxCheckSetting.alertTextOk : alertOk;
                alertNo = alertNo == undefined ? ajaxCheckSetting.alertText : alertNo;

                fieldValue = $(caller).val();
                ajaxCaller = caller;
                fieldId = $(caller).attr("id");
                ajaxValidate = true;
                ajaxisError = $.validationEngine.isError;

                if ($.validationEngine.settings.allrules[customAjaxRule].extraData) {
                    extraData += '&' + $.validationEngine.settings.allrules[customAjaxRule].extraData;
                }
                /* AJAX VALIDATION HAS ITS OWN UPDATE AND BUILD UNLIKE OTHER RULES */
                if (!ajaxisError) {
                    $.ajax({
                                type:"POST",
                                url:easyloader.URI + postfile,
                                async:true,
                                data:"validateValue=" + fieldValue + "&validateId=" + fieldId + "&validateError=" + customAjaxRule + extraData,
                                beforeSend:function () {        // BUILD A LOADING PROMPT IF LOAD TEXT EXIST
                                    if ($.validationEngine.settings.allrules[customAjaxRule].alertTextLoad) {

                                        if (!$("div." + fieldId + "formError")[0]) {
                                            return $.validationEngine.buildPrompt(ajaxCaller,
                                                    $.validationEngine.settings.allrules[customAjaxRule].alertTextLoad, "load");
                                        } else {
                                            $.validationEngine.updatePromptText(ajaxCaller,
                                                    $.validationEngine.settings.allrules[customAjaxRule].alertTextLoad, "load");
                                        }
                                    }
                                },
                                error:function (data, transport) {
                                    $.validationEngine.debug("error in the ajax: " + data.status + " " + transport)
                                },
                                success:function (data) {                    // GET SUCCESS DATA RETURN JSON
                                    data = eval("(" + data + ")");				// GET JSON DATA FROM PHP AND PARSE IT
                                    ajaxisError = data.jsonValidateReturn[2];
                                    customAjaxRule = data.jsonValidateReturn[1];
                                    ajaxCaller = $("#" + data.jsonValidateReturn[0])[0];
                                    fieldId = ajaxCaller;
                                    ajaxErrorLength = $.validationEngine.ajaxValidArray.length;
                                    existInarray = false;

                                    if (ajaxisError == "false") {            // DATA FALSE UPDATE PROMPT WITH ERROR;

                                        _checkInArray(false)				// Check if ajax validation alreay used on this field

                                        if (!existInarray) {                     // Add ajax error to stop submit
                                            $.validationEngine.ajaxValidArray[ajaxErrorLength] = new Array(2);
                                            $.validationEngine.ajaxValidArray[ajaxErrorLength][0] = fieldId;
                                            $.validationEngine.ajaxValidArray[ajaxErrorLength][1] = false;
                                            existInarray = false;
                                        }

                                        $.validationEngine.ajaxValid = false;
                                        promptText += alertNo + "<br />";
                                        $.validationEngine.updatePromptText(ajaxCaller, promptText, "", true);
                                    } else {
                                        _checkInArray(true);
                                        $.validationEngine.ajaxValid = true;
                                        if (!customAjaxRule) {
                                            $.validationEngine.debug("wrong ajax response, are you on a server or in xampp? if not delete de ajax[ajaxUser] validating rule from your form ")
                                        }
                                        if ($.validationEngine.settings.allrules[customAjaxRule].alertTextOk) {    // NO OK TEXT MEAN CLOSE PROMPT
                                            $.validationEngine.updatePromptText(ajaxCaller, alertOk, "pass", true);
                                        } else {
                                            ajaxValidate = false;
                                            $.validationEngine.closePrompt(ajaxCaller);
                                        }
                                    }
                                    function _checkInArray(validate) {
                                        for (topx = 0; x < ajaxErrorLength; x++) {
                                            if ($.validationEngine.ajaxValidArray[x][0] == fieldId) {
                                                $.validationEngine.ajaxValidArray[x][1] = validate;
                                                existInarray = true;

                                            }
                                        }
                                    }
                                }
                            });
                }
            }

            function _equals(caller, rules, position) {         // VALIDATE FIELD MATCH
                equalsField = rules[position + 1];

                if ($(caller).attr('value') != $("#" + equalsField).attr('value')) {
                    $.validationEngine.isError = true;
                    promptText += $.validationEngine.settings.allrules["equals"].alertText + "<br />";
                }
            }

            function _length(caller, rules, position) {          // VALIDATE LENGTH

                startLength = eval(rules[position + 1]);
                endLength = eval(rules[position + 2]);
                feildLength = $(caller).attr('value').length;

                if (feildLength < startLength || feildLength > endLength) {
                    $.validationEngine.isError = true;
                    promptText += $.validationEngine.settings.allrules["length"].alertText + startLength + $.validationEngine.settings.allrules["length"].alertText2 + endLength + $.validationEngine.settings.allrules["length"].alertText3 + "<br />"
                }
            }

            function _limit(caller, rules, position) {          // VALIDATE LIMIT
                min = eval(rules[position + 1]);
                max = eval(rules[position + 2]);
                feildValue = $(caller).attr('value');
                if (feildValue < min || feildValue > max) {
                    $.validationEngine.isError = true;
                    promptText += $.validationEngine.settings.allrules["limit"].alertText + min + $.validationEngine.settings.allrules["limit"].alertText2 + max + $.validationEngine.settings.allrules["limit"].alertText3 + "<br />"
                }
            }

            function _maxCheckbox(caller, rules, position) {        // VALIDATE CHECKBOX NUMBER

                nbCheck = eval(rules[position + 1]);
                groupname = $(caller).attr("name");
                groupSize = $("input[name='" + groupname + "']:checked").size();
                if (groupSize > nbCheck) {
                    $.validationEngine.showTriangle = false;
                    $.validationEngine.isError = true;
                    //promptText += $.validationEngine.settings.allrules["maxCheckbox"].alertText + "<br />";
                    promptText += $.validationEngine.settings.allrules["maxCheckbox"].alertText + " " + nbCheck + " " + $.validationEngine.settings.allrules["maxCheckbox"].alertText2 + "<br />";
                }
            }

            function _minCheckbox(caller, rules, position) {        // VALIDATE CHECKBOX NUMBER

                nbCheck = eval(rules[position + 1]);
                groupname = $(caller).attr("name");
                groupSize = $("input[name='" + groupname + "']:checked").size();
                if (groupSize < nbCheck) {

                    $.validationEngine.isError = true;
                    $.validationEngine.showTriangle = false;
                    promptText += $.validationEngine.settings.allrules["minCheckbox"].alertText + " " + nbCheck + " " + $.validationEngine.settings.allrules["minCheckbox"].alertText2 + "<br />";
                }
            }

            function _accept(caller, rules, position) {
                fileName = $(caller).attr('value');
                fileExt = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName.toLowerCase()) : '';
                acceptRule = rules[position + 1];

                if (fileExt == '' || acceptRule.indexOf(fileExt) < 0) {
                    $.validationEngine.isError = true;
                    promptText += $.validationEngine.settings.allrules["accept"].alertText + "<br />" + "* 如：" + acceptRule.split(":").join(",") + "<br />";
                }
            }

            return($.validationEngine.isError) ? $.validationEngine.isError : false;
        },
        submitForm:function (caller) {
            if ($.validationEngine.settings.ajaxSubmit) {
                if ($.validationEngine.settings.ajaxSubmitExtraData) {
                    extraData = $.validationEngine.settings.ajaxSubmitExtraData;
                } else {
                    extraData = "";
                }
                $.ajax({
                            type:"POST",
                            url:$.validationEngine.settings.ajaxSubmitFile,
                            async:true,
                            data:$(caller).serialize() + "&" + extraData,
                            error:function (data, transport) {
                                $.validationEngine.debug("error in the ajax: " + data.status + " " + transport)
                            },
                            success:function (data) {
                                if (data == "true") {            // EVERYTING IS FINE, SHOW SUCCESS MESSAGE
                                    $(caller).css("opacity", 1)
                                    $(caller).animate({opacity:0, height:0}, function () {
                                        $(caller).css("display", "none");
                                        $(caller).before("<div class='ajaxSubmit'>" + $.validationEngine.settings.ajaxSubmitMessage + "</div>");
                                        $.validationEngine.closePrompt(".formError", true);
                                        $(".ajaxSubmit").show("slow");
                                        if ($.validationEngine.settings.success) {    // AJAX SUCCESS, STOP THE LOCATION UPDATE
                                            $.validationEngine.settings.success && $.validationEngine.settings.success();
                                            return false;
                                        }
                                    })
                                } else {                        // HOUSTON WE GOT A PROBLEM (SOMETING IS NOT VALIDATING)
                                    data = eval("(" + data + ")");
                                    if (!data.jsonValidateReturn) {
                                        $.validationEngine.debug("you are not going into the success fonction and jsonValidateReturn return nothing");
                                    }
                                    errorNumber = data.jsonValidateReturn.length
                                    for (index = 0; index < errorNumber; index++) {
                                        fieldId = data.jsonValidateReturn[index][0];
                                        promptError = data.jsonValidateReturn[index][1];
                                        type = data.jsonValidateReturn[index][2];
                                        $.validationEngine.buildPrompt(fieldId, promptError, type);
                                    }
                                }
                            }
                        });
                return true;
            }

            // LOOK FOR BEFORE SUCCESS METHOD
            if (!$.validationEngine.settings.beforeSuccess()) {
                if ($.validationEngine.settings.success) {    // AJAX SUCCESS, STOP THE LOCATION UPDATE
                    if ($.validationEngine.settings.unbindEngine) {
                        $(caller).unbind("submit")
                    }
                    $.validationEngine.settings.success && $.validationEngine.settings.success();
                    return true;
                }
            } else {
                return true;
            }
            return false;
        },
        buildPrompt:function (caller, promptText, type, ajaxed) {            // ERROR PROMPT CREATION AND DISPLAY WHEN AN ERROR OCCUR
            if (!$.validationEngine.settings) {
                $.validationEngine.defaultSetting()
            }
            deleteItself = "." + $(caller).attr("id") + "formError"

            if ($(deleteItself)[0]) {
                $(deleteItself).stop();
                $(deleteItself).remove();
            }
            var divFormError = document.createElement('div');
            var formErrorContent = document.createElement('div');
            linkTofield = $.validationEngine.linkTofield(caller)
            $(divFormError).addClass("formError")

            if (type == "pass") {
                $(divFormError).addClass("greenPopup")
            }
            if (type == "load") {
                $(divFormError).addClass("blackPopup")
            }
            if (ajaxed) {
                $(divFormError).addClass("ajaxed")
            }

            $(divFormError).addClass(linkTofield);
            $(formErrorContent).addClass("formErrorContent");

            $("body").append(divFormError);
            $(divFormError).append(formErrorContent);

            if ($.validationEngine.showTriangle != false) {        // NO TRIANGLE ON MAX CHECKBOX AND RADIO
                var arrow = document.createElement('div');
                $(arrow).addClass("formErrorArrow");
                $(divFormError).append(arrow);
                if ($.validationEngine.settings.promptPosition == "bottomLeft" || $.validationEngine.settings.promptPosition == "bottomRight") {
                    $(arrow).addClass("formErrorArrowBottom")
                    $(arrow).html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
                }
                if ($.validationEngine.settings.promptPosition == "topLeft" || $.validationEngine.settings.promptPosition == "topRight") {
                    $(divFormError).append(arrow);
                    $(arrow).html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
                }
            }
            $(formErrorContent).html(promptText)

            callerTopPosition = $(caller).offset().top;
            callerleftPosition = $(caller).offset().left;
            callerWidth = $(caller).width();
            inputHeight = $(divFormError).height();

            /* POSITIONNING */
            if ($.validationEngine.settings.promptPosition == "topRight") {
                callerleftPosition += callerWidth - 30;
                callerTopPosition += -inputHeight - 10;
            }
            if ($.validationEngine.settings.promptPosition == "topLeft") {
                callerTopPosition += -inputHeight - 10;
            }

            if ($.validationEngine.settings.promptPosition == "centerRight") {
                callerleftPosition += callerWidth + 13;
            }

            if ($.validationEngine.settings.promptPosition == "bottomLeft") {
                callerHeight = $(caller).height();
//                callerleftPosition = callerleftPosition;
                callerTopPosition = callerTopPosition + callerHeight + 15;
            }
            if ($.validationEngine.settings.promptPosition == "bottomRight") {
                callerHeight = $(caller).height();
                callerleftPosition += callerWidth - 30;
                callerTopPosition += callerHeight + 15;
            }
            $(divFormError).css({
                        top:callerTopPosition,
                        left:callerleftPosition,
                        opacity:0
                    });
            return $(divFormError).animate({"opacity":0.87}, function () {
                return true;
            });
        },
        updatePromptText:function (caller, promptText, type, ajaxed) {    // UPDATE TEXT ERROR IF AN ERROR IS ALREADY DISPLAYED

            linkTofield = $.validationEngine.linkTofield(caller);
            var updateThisPrompt = "." + linkTofield;

            if (type == "pass") {
                $(updateThisPrompt).addClass("greenPopup")
            } else {
                $(updateThisPrompt).removeClass("greenPopup")
            }
            if (type == "load") {
                $(updateThisPrompt).addClass("blackPopup")
            } else {
                $(updateThisPrompt).removeClass("blackPopup")
            }
            if (ajaxed) {
                $(updateThisPrompt).addClass("ajaxed")
            } else {
                $(updateThisPrompt).removeClass("ajaxed")
            }

            $(updateThisPrompt).find(".formErrorContent").html(promptText);
            callerTopPosition = $(caller).offset().top;
            inputHeight = $(updateThisPrompt).height();

            if ($.validationEngine.settings.promptPosition == "bottomLeft" || $.validationEngine.settings.promptPosition == "bottomRight") {
                callerHeight = $(caller).height();
                callerTopPosition = callerTopPosition + callerHeight + 15;
            }
            if ($.validationEngine.settings.promptPosition == "centerRight") {
                callerleftPosition += callerWidth + 13;
            }
            if ($.validationEngine.settings.promptPosition == "topLeft" || $.validationEngine.settings.promptPosition == "topRight") {
                callerTopPosition = callerTopPosition - inputHeight - 10;
            }
            $(updateThisPrompt).animate({ top:callerTopPosition });
        },
        linkTofield:function (caller) {
            linkTofield = $(caller).attr("id") + "formError";
            linkTofield = linkTofield.replace(/\[/g, "");
            linkTofield = linkTofield.replace(/\]/g, "");
            return linkTofield;
        },
        closePrompt:function (caller, outside) {                        // CLOSE PROMPT WHEN ERROR CORRECTED
            if (!$.validationEngine.settings) {
                $.validationEngine.defaultSetting()
            }
            if (outside) {
                $(caller).fadeTo("fast", 0, function () {
                    $(caller).remove();
                });
                return false;
            }
            if (typeof(ajaxValidate) == 'undefined') {
                ajaxValidate = false
            }
            if (!ajaxValidate) {
                linkTofield = $.validationEngine.linkTofield(caller);
                closingPrompt = "." + linkTofield;
                $(closingPrompt).fadeTo("fast", 0, function () {
                    $(closingPrompt).remove();
                });
            }
        },
        debug:function (error) {
            if (!$("#debugMode")[0]) {
                $("body").append("<div id='debugMode'><div class='debugError'><strong>This is a debug mode, you got a problem with your form, it will try to help you, refresh when you think you nailed down the problem</strong></div></div>");
            }
            $(".debugError").append("<div class='debugerror'>" + error + "</div>");
        },
        submitValidation:function (caller) {                    // FORM SUBMIT VALIDATION LOOPING INLINE VALIDATION
            var stopForm = false;
            $.validationEngine.ajaxValid = true;
//            $(caller).find(".formError").remove();
            var toValidateSize = $(caller).find("[class*=validate]").size();

            $.validationEngine.settings.tabArray = [];
            $(caller).find("[class*=validate]").each(function () {
                linkTofield = $.validationEngine.linkTofield(this);

                if (!$("." + linkTofield).hasClass("ajaxed")) {    // DO NOT UPDATE ALREADY AJAXED FIELDS (only happen if no normal errors, don't worry)
                    var validationPass = $.validationEngine.loadValidation(this);
                    return(validationPass) ? stopForm = true : "";
                }
            });
            if ($.validationEngine.settings.tabArray.length > 0) {
                //alert($.validationEngine.settings.tabArray);
                top.$.ligerDialog.alert("“" + $.validationEngine.settings.tabArray + "”项中有部分内容未填写，请编辑后再次提交！", "提示", "warn");
            }
            ajaxErrorLength = $.validationEngine.ajaxValidArray.length;		// LOOK IF SOME AJAX IS NOT VALIDATE
            for (x = 0; x < ajaxErrorLength; x++) {
                if ($.validationEngine.ajaxValidArray[x][1] == false) {
                    $.validationEngine.ajaxValid = false;
                }
            }
            if (stopForm || !$.validationEngine.ajaxValid) {        // GET IF THERE IS AN ERROR OR NOT FROM THIS VALIDATION FUNCTIONS
                if ($.validationEngine.settings.scroll) {
                    var _destination = $(".formError:not('.greenPopup'):first").offset();
                    if (_destination) {
                        destination = _destination.top;
                        $(".formError:not('.greenPopup')").each(function () {
                            testDestination = $(this).offset().top;
                            if (destination > testDestination) {
                                destination = $(this).offset().top;
                            }
                        });
                        $("html:not(:animated),body:not(:animated)").animate({ scrollTop:destination}, 1100);
                    } else {
                        promptText = alertNo + "<br />";
                        $.validationEngine.updatePromptText(ajaxCaller, promptText, "", true);
                        $.validationEngine.buildPrompt(ajaxCaller, promptText, "error");
                    }
                }
                return true;
            } else {
                return false;
            }
        }, doValidate:function (formObj) {
            $.validationEngine.onSubmitValid = true;
            return !$.validationEngine.submitValidation(formObj, {});
        }
    }
})(jQuery);


(function ($) {
    $.fn.validationEngineLanguage = function () {
    };
    $.validationEngineLanguage = {
        newLang:function () {
            $.validationEngineLanguage.allRules = {
                "required":{
                    "regex":"none",
                    "alertText":"* 非空选项.",
                    "alertTextCheckboxMultiple":"* 请选择一个单选框.",
                    "alertTextCheckboxe":"* 请选择一个复选框."},
                "length":{
                    "regex":"none",
                    "alertText":"* 长度必须在 ",
                    "alertText2":" 至 ",
                    "alertText3":" 之间."},
                "limit":{
                    "regex":"none",
                    "alertText":"* 大小必须在 ",
                    "alertText2":" 至 ",
                    "alertText3":" 之间."},
                "maxCheckbox":{
                    "regex":"none",
                    "alertText":"* 最多选择 ",
                    "alertText2":" 项."},
                "minCheckbox":{
                    "regex":"none",
                    "alertText":"* 至少选择 ",
                    "alertText2":" 项."},
                "equals":{
                    "regex":"none",
                    "alertText":"* 两次输入不一致,请重新输入."},
                "telephone":{
                    "regex":"/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/",
                    "alertText":"* 请输入有效的电话号码,如:010-29292929."},
                "mobilephone":{
                    "regex":"/(^0?[1][358][0-9]{9}$)/",
                    "alertText":"* 请输入有效的手机号码."},
                "phone":{
                    "regex":"/^((\\(\\d{2,3}\\))|(\\d{3}\\-))?(\\(0\\d{2,3}\\)|0\\d{2,3}-)?[1-9]\\d{6,7}(\\-\\d{1,4})?$/",
                    "alertText":"* 请输入有效的联系号码."},
                "email":{
                    "regex":"/^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/",
                    "alertText":"* 请输入有效的邮件地址."},
                "date":{
                    "regex":"/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/",
                    "alertText":"* 请输入有效的日期,如:2008-08-08."},
                "ip":{
                    "regex":"/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/",
                    "alertText":"* 请输入有效的IP."},
                "accept":{
                    "regex":"none",
                    "alertText":"* 请输入有效的文件格式."},
                "chinese":{
                    "regex":"/^[\u4e00-\u9fa5]+$/",
                    "alertText":"* 请输入中文."},
                "url":{
                    "regex":"/^((https|http|ftp|rtsp|mms)?:\\/\\/)?"
                            + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                            + "|" // 允许IP和DOMAIN（域名）
                            + "([0-9a-z_!~*'()-]+\\.)*" // 域名- www.
                            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\\." // 二级域名
                            + "[a-z]{2,6})" // first level domain- .com or .museum
                            + "(:[0-9]{1,5})?" // 端口- :80,最多5位
                            + "[\\/a-zA-Z0-9\\/]{0,}"
                            + "(\\/[0-9a-zA-Z\\.\\?\\&=]{0,})?$/",
                    "alertText":"* 请输入有效的网址."},
                "domain":{
                    "regex":"/^([\\w-]+\\.)+((com)|(net)|(org)|(gov\\.cn)|(info)|(cc)|(com\\.cn)|(net\\.cn)|(org\\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|(io)|(tw)|(com\\.tw)|(hk)|(com\\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\\.uk)|(org\\.uk)|(ltd\\.uk)|(plc\\.uk)|(in)|(eu)|(it)|(jp))$/",
                    "alertText":"* 请输入有效的域名."},
                "zipcode":{
                    "regex":"/^[1-9]\\d{5}$/",
                    "alertText":"* 请输入有效的邮政编码."},
                "idCard":{
                    //对身份证的验证分别加入了区域，出生年月（简单）的验证
                    "regex":"/^(([16][1-5]|2[1-4]|3[1-7]|4[1-6]|5[0-4]|[7-9]1)\\d{4}(19|20|21)\\d{2}(0[0-9]|1[0-2])(0[0-9]|[1-2][0-9]|3[0-1])\\d{3}[0-9xX])" + //验证18位身份证
                            "|(([16][1-5]|2[1-4]|3[1-7]|4[1-6]|5[0-4]|[7-9]1)\\d{6}(0[0-9]|1[0-2])(0[0-9]|[1-2][0-9]|3[0-1])\\d{3})$/",             //验证15位的身份证
                    "alertText":"* 请输入有效的身份证号码."},
                "qq":{
                    "regex":"/^[1-9]\\d{4,9}$/",
                    "alertText":"* 请输入有效的QQ号码."},
                "onlyInteger":{
                    "regex":"/^[0-9-]+$/",
                    "alertText":"* 请输入整数."},
                "onlyNumber":{
                    "regex":"/^\\-?[0-9\\,]*\\.?\\d*$/",
                    "alertText":"* 请输入数字."},
                "notZero":{
                    "regex":"/^[1-9]{1}/",
                    "alertText":"* 必须大于零."},
                "oneToNine":{
                    "regex":"/^[1-9]{1}$/",
                    "alertText":"* 请输入1-9的整数."},
                "onlyLetter":{
                    "regex":"/^[a-zA-Z]+$/",
                    "alertText":"* 请输入英文字母."},
                "noSpecialCaracters":{
                    "regex":"/^[0-9a-zA-Z]+$/",
                    "alertText":"* 请输入英文字母和数字."},
                "onlyFile":{
                    "regex":"/^[0-9a-zA-Z]+\\.*[a-zA-Z]{0,4}$/",
                    "alertText":"* 目录或者文件名不合法."
                },
                "noSpecialCaractersNew":{
                    "regex":"/^[0-9a-zA-Z\u4e00-\u9fa5]*$/",
                    "alertText":"* 只允许英文字母、数字和中文"
                },
                "ajax":{
                    "file":"/user.ajaxCheck.do",
                    "alertTextOk":"* 可以使用.",
                    "alertTextLoad":"* 正在检查中, 请稍侯...",
                    "alertText":"* 已被占用."}
            }
        }
    }
})(jQuery);

$(document).ready(function () {
    $.validationEngineLanguage.newLang()
});