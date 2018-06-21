$(document).ready(function(){
    var sendUrl = "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk";
    var apiKey = "";
    var recieveChat = function(query){
        var text = "";
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
            // console.log(data);
            // bot側のメッセージをhtmlに表示
            var bot_message = data.results[0].reply;
            var list = document.createElement("li");
            var tag_list = document.getElementById("chat_list").appendChild(list);
            tag_list.classList.add("bot");
            tag_list.textContent = bot_message;  

            // 最後尾に移動
            location.href = "#endPoint";
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
        tag_list.textContent = user_message;

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