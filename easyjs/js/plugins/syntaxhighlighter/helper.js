SyntaxHighlighter.config.clipboardSwf = '/js/plugins/syntaxhighlighter/scripts/clipboard.swf';
//SyntaxHighlighter.config.tagName = 'div';
//SyntaxHighlighter.defaults.toolbar = true;
SyntaxHighlighter.config.toolbarItemWidth = 16;
SyntaxHighlighter.config.toolbarItemHeight = 16;
SyntaxHighlighter.config.strings = {
    expandSource: '展开代码',
    viewSource: '查看代码',
    copyToClipboard: '复制代码',
    copyToClipboardConfirmation: '代码复制成功',
    print: '打印',
    help: '?',
    alert: '语法高亮\n\n',
    noBrush: '不能找到刷子: ',
    brushNotHtmlScript: 'Brush wasn\'t configured for html-script option: ',

    // this is populated by the build script
    aboutDialog: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>About SyntaxHighlighter</title></head><body style="font-family:Geneva,Arial,Helvetica,sans-serif;background-color:#fff;color:#000;font-size:1em;text-align:center;"><div style="text-align:center;margin-top:3em;"><div style="font-size:xx-large;">SyntaxHighlighter</div><div style="font-size:.75em;margin-bottom:4em;"><div>version 2.0.320 (May 03 2009)</div><div><a href="http://alexgorbatchev.com" target="_blank" style="color:#0099FF;text-decoration:none;">http://alexgorbatchev.com</a></div></div><div>JavaScript code syntax highlighter.</div><div>Copyright 2004-2009 Alex Gorbatchev.</div></div></body></html>'
}
SyntaxHighlighter.all();