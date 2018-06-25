// docomo自然対話:雑談会話APIを利用
// 2018・06・23 reference:https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=natural_dialogue&p_name=api_4
// codeの参考:https://teratail.com/questions/132322 

var ampm = function(hour){
    var result;
    if(parseInt(hour,10) < 12){
        result = "午前";
    }else{
        result = "午後";
    }
    return result;
}

var addChatList = function(id, message){
    // liをchat_listに追加
    var list = document.createElement("li");
    var tag_list = document.getElementById("chat_list").appendChild(list);
    tag_list.classList.add(id);

    var profile = document.getElementsByClassName(id);

    // webフォント・nameの追加
    var tag_icon = document.createElement("i");
    tag_icon.classList.add("fas", "fa-user-circle");
    profile[profile.length-1].appendChild(tag_icon);

    var name;
    if(id === "bot"){
        name = "AI";
    }else if(id === "user"){
        name = "GUEST";
    }
    var node_profileName = document.createTextNode(" "+ name);
    tag_icon.appendChild(node_profileName);

    // messageを追加
    var tag_p = document.createElement("p");
    tag_p = profile[profile.length-1].appendChild(tag_p);
    var node_message = document.createTextNode(message);
    tag_p.appendChild(node_message);

    // 投稿時間の追加   
    var tag_div = document.createElement("div");
    tag_div.classList.add("time");
    
    var now = new Date();
    var time = ampm(now.getHours()) + now.getHours() % 12 + "時" + now.getMinutes() + "分";
    var node_time = document.createTextNode(time);
    tag_div.appendChild(node_time);
    profile[profile.length-1].appendChild(tag_div);
}

$(document).ready(function(){

    var apiKey = "35496932636c7a4f5a7a67576d67316d67545856554c4655556c485375436647494d334167416663535437";
    var host = "https://api.apigw.smt.docomo.ne.jp/naturalChatting/v1/registration?APIKEY=" + apiKey;
    var requestbody = {   
        botId: "Chatting",
        appKind: "web chat service"
    };
    var appId;

    // user登録
    $.ajax({
        url: host,
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(requestbody)
    })
    .done(function(data){
        appId = data.appId;
    })
    .fail(function(){
        window.alert("error: registration")
    });

    addChatList("bot", "こんにちは");

    var serverSendTime;
    var recieveChat = function(message){
        // recieveTimeの設定
        var recvTime;
        if(!serverSendTime){
            recvTime = "0000-00-00 00:00:00";
        }else{
            recvTime = serverSendTime;
        }

        // sendTimeの設定
        var now = moment().format().split("T");
        var ymd = now[0];
        var hms = now[1].split("+")[0];
        sendTime = ymd + " " + hms;

        host = "https://api.apigw.smt.docomo.ne.jp/naturalChatting/v1/dialogue?APIKEY=" + apiKey;
        var setting = {
            nickname: "GUEST",
            nicknameY: "ゲスト",
            sex: "男",
            // bloodtype: "A",
            // birthdateY: "1889",
            // birthdateM: "12",
            // birthdateD: "12",
            // age: "25",
            // constellations:"天秤座",
            place: "東京",
            mode: "dialog",
            t: "kansai"
        }

        var option = {
            "option": setting
        };

        requestbody = {   
            language: "ja-JP",
            botId: "Chatting",
            appId: appId,
            voiceText: message,
            clientData: option,
            appRecvTime: recvTime,
            appSendTime: sendTime
        };
        $.ajax({
            url: host,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestbody)
        })
        .done(function(data){
            serverSendTime = data.serverSendTime;

            var bot_message = data.systemText.expression;

            addChatList("bot", bot_message);

            location.href = "#endPoint";

            document.getElementById("form").word.focus();
        })
        .fail(function(data){
            window.alert("error: dialogue");
            console.log(data);
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

        addChatList("user", user_message);

        location.href = "#endPoint";

        recieveChat(user_message);

        document.getElementById("form").word.value = "";

        // 再更新を停止
        return false;
    };
});