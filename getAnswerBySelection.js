// ==UserScript==
// @name         超星尔雅快速查题助手
// @namespace    http://xyz-studio.xyz
// @version      1.0.0
// @description  选中题目按快捷键或三击题目后即可查题
// @author       xyz-studio
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @connect      api.xyz-studio.xyz
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// ==/UserScript==

document.body.addEventListener('dblclick', function (e) {
    setTimeout(getAnswer, 1000);
});
document.body.addEventListener('keyup', function (e) {
    if (e.keyCode === 67 && e.altKey === true) {
        getAnswer();
    };
});

function getAnswer() {
    var question = getSelection().toString();
    var tipBox = getTipBox();
    if (question.length < 5) {
        tipBox.innerHTML = '<p style="text-align: center;font-size: 20px;">题目至少需要五个字哦！</p>';
        return;
    };
    tipBox.innerHTML = '<p style="text-align: center;font-size: 20px;">正在查询，请耐心等待...</p>';
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://api.xyz-studio.xyz/cx/',
        data: 'q=' + encodeURIComponent(question),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000,
        onload: function (xhr) {
            if (xhr.status === 200) {
                var result = JSON.parse(xhr.responseText);
                if (result.code === 1) {
                    tipBox.innerHTML = `<p style="text-align: center;font-size: 16px;padding-bottom: 10px;">${result.question}</p>`;
                    tipBox.innerHTML += `<p style="text-align: center;font-size: 24px;color: #67C23A">${result.answer}</p>`;
                    GM_setClipboard(result.answer);
                } else {
                    tipBox.innerHTML = '<p style="text-align: center;font-size: 20px;">好像没有找到这一题的答案呢！稍后试试吧！</p>';
                }
            } else {
                tipBox.innerHTML = '<p style="text-align: center;font-size: 20px;">网络好像出故障了！或者服务器出故障了！稍后再试吧！</p>';
            }
        },
        ontimeout: function () {
            tipBox.innerHTML = '<p style="text-align: center;font-size: 20px;">连接超时，请重试</p>';
        }
    });
}

function getTipBox() {
    var tipBox = window.top.document.getElementById('tipbox');
    if (tipBox) return tipBox;
    tipBox = document.createElement('div');
    tipBox.setAttribute('id', 'tipbox');
    tipBox.setAttribute('style', 'width:350px;min-height:100px;position:fixed;left:50%;top:10px;transform:translateX(-50%);background-color:#f4f4f5;color:#303133;padding:10px;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);');
    tipBox.addEventListener('click', function (e) {
        this.parentElement.removeChild(this); 
    });
    window.top.document.body.appendChild(tipBox);
    return tipBox;
}