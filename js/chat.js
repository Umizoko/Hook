// recruit社の提供しているTALK APIを使用 
// 2018/06/22

$(document).ready(function(){
    // 導入の会話を生成
    // liをchat_listに追加
    var list = document.createElement("li");
    var tag_list = document.getElementById("chat_list").appendChild(list);
    // liに.botを追加
    tag_list.classList.add("bot");

    // アイコンフォントの追加
    var tag_icon = document.createElement("i");
    tag_icon.classList.add("fas", "fa-user-circle");
    var bot_profile = document.getElementsByClassName("bot");
    bot_profile[bot_profile.length-1].appendChild(tag_icon);

    // messageを追加
    var node_message = document.createTextNode("こんにちは。");
    bot_profile[bot_profile.length-1].appendChild(node_message);

    // 投稿時間の追加
    var tag_div = document.createElement("div");
    tag_div.classList.add("time");
    
    // 投稿時間処理
    var now = new Date();
    var ampm;
    if(now.getHours() < 12){
        ampm = "午前";
    }else{
        ampm = "午後";
    }
    var time = ampm + now.getHours() % 12 + "時" + now.getMinutes();
    var node_time = document.createTextNode(time);
    tag_div.appendChild(node_time);
    bot_profile[bot_profile.length-1].appendChild(tag_div);


    var sendUrl = "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk";
    var apiKey = "";
    var recieveChat = function(query){
            $.ajax({
            url: sendUrl,
            type: "POST",
            dataType: "json",
            data : {
                "apikey": apiKey,
                "query": query
            },
        })
        .done(function(data){
            // bot側のメッセージをhtmlに表示
            var bot_message;
            if(data.message === "ok"){
                bot_message = data.results[0].reply;
            }else {
                bot_message = "もう一度お願いします。"
            }

            // liをchat_listに追加
            var list = document.createElement("li");
            var tag_list = document.getElementById("chat_list").appendChild(list);
            // liに.botを追加
            tag_list.classList.add("bot");

            // アイコンフォントの追加
            var tag_icon = document.createElement("i");
            tag_icon.classList.add("fas", "fa-user-circle");
            var bot_profile = document.getElementsByClassName("bot");
            bot_profile[bot_profile.length-1].appendChild(tag_icon);

            // messageを追加
            var node_message = document.createTextNode(bot_message);
            bot_profile[bot_profile.length-1].appendChild(node_message);

            // 投稿時間の追加
            var tag_div = document.createElement("div");
            tag_div.classList.add("time");
            
            // 投稿時間処理
            var now = new Date();
            var ampm;
            if(now.getHours() < 12){
                ampm = "午前";
            }else{
                ampm = "午後";
            }
            var time = ampm + now.getHours() % 12 + "時" + now.getMinutes();
            var node_time = document.createTextNode(time);
            tag_div.appendChild(node_time);
            bot_profile[bot_profile.length-1].appendChild(tag_div);

            // 最後尾に移動
            location.href = "#endPoint";

            // テキスト入力フォームをアクティブ
            document.getElementById("form").word.focus();
        })
        .fail(function(){
            window.alert("error");
        });
    }

    // submit event -> chatAPIを送信
    document.getElementById("form").onsubmit = function(){

        // user側のメッセージをhtmlに表示
        var user_message = document.getElementById("form").word.value;
        // 入力なし
        if(user_message === ""){
            return false;
        }

        var list = document.createElement("li");
        var tag_list = document.getElementById("chat_list").appendChild(list);
        tag_list.classList.add("user");

        var user_profile = document.getElementsByClassName("user");

        // messageを追加
        var node_message = document.createTextNode(user_message);
        user_profile[user_profile.length-1].appendChild(node_message);

        // 投稿時間の追加
        var tag_div = document.createElement("div");
        tag_div.classList.add("time");
        
        // 投稿時間処理
        var now = new Date();
        var ampm;
        if(now.getHours() < 12){
            ampm = "午前";
        }else{
            ampm = "午後";
        }
        var time = ampm + now.getHours() % 12 + "時" + now.getMinutes();
        var node_time = document.createTextNode(time);
        tag_div.appendChild(node_time);
        user_profile[user_profile.length-1].appendChild(tag_div);

        // 最後尾に移動
        location.href = "#endPoint";

        // TalkAPI
        recieveChat(user_message);

        // input textのvalueを消去
        document.getElementById("form").word.value = "";

        // 再更新を停止
        return false;
    };
});