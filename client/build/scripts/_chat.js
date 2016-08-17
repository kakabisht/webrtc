/********************************************************************************8
        Chat
**************************************************************************************/
function createChatButton(chatobj){
    var button= document.createElement("span");
    button.className= chatobj.button.class_on;
    button.innerHTML= chatobj.button.html_on;
    button.onclick = function() {
        if(button.className==chatobj.button.class_off){
            document.getElementById(chatobj.chatContainer).hidden=true;
            button.className=chatobj.button.class_on;
            button.innerHTML= chatobj.button.html_on;
        }else if(button.className==chatobj.button.class_on){
            document.getElementById(chatobj.chatContainer).hidden=false;
            button.className=chatobj.button.class_off;
            button.innerHTML= chatobj.button.html_off;
        }
    };

    var li =document.createElement("li");
    li.appendChild(button);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function createChatBox(chatobj){

    var mainInputBox=document.createElement("div");

    var chatInput= document.createElement("input");
    chatInput.setAttribute("type", "text");
    chatInput.className= "form-control chatInputClass";
    chatInput.id="chatInput";
    chatInput.onkeypress=function(e){
        if (e.keyCode == 13) {
            sendChatMessage(chatInput.value);
            chatInput.value = "";
        }
    };

    var chatButton= document.createElement("span");
    chatButton.className= "btn btn-primary";
    chatButton.innerHTML= "Enter";
    chatButton.onclick=function(){
        var chatInput=document.getElementById("chatInput");
        sendChatMessage(chatInput.value);
        chatInput.value = "";
    }
    
    var whoTyping= document.createElement("div");
    whoTyping.className= "whoTypingClass";
    whoTyping.id="whoTyping";

    mainInputBox.appendChild(chatInput);
    mainInputBox.appendChild(chatButton);
    mainInputBox.appendChild(whoTyping);
    document.getElementById(chatobj.chatContainer).appendChild(mainInputBox);

    var chatBoard=document.createElement("div");
    chatBoard.className="chatMessagesClass";
    chatBoard.contenteditable=true;
    chatBoard.id="chatBoard";
    document.getElementById(chatobj.chatContainer).appendChild(chatBoard);

}

function updateWhotyping(data){
    document.getElementById("whoTyping").innerHTML=data;
}

function addMessageLineformat(messageDivclass, message , parent){
    var n = document.createElement("div");
    n.className = messageDivclass; 
    n.innerHTML = message;
    document.getElementById(parent).insertBefore(n, document.getElementById(parent).firstChild);
}

function addMessageBlockFormat(messageheaderDivclass , messageheader ,messageDivclass, message , parent){
    
    var t = document.createElement("div");
    t.className = messageheaderDivclass, 
    t.innerHTML = '<div class="chatusername">' + messageheader + "</div>";

    var n = document.createElement("div");
    n.className = messageDivclass,
    n.innerHTML= message,

    t.appendChild(n),  
    $("#"+parent).append(n);
    /* $("#all-messages").scrollTop($("#all-messages")[0].scrollHeight) */
}

function addNewMessage(e) {
    if ("" != e.message && " " != e.message) {
        addMessageLineformat("user-activity user-activity-right remoteMessageClass" , e.message , "chatBoard");
    }
}

function addNewMessagelocal(e) {
    if ("" != e.message && " " != e.message) {
        addMessageLineformat("user-activity user-activity-right localMessageClass" , e.message , "chatBoard");
    }
}

function sendChatMessage(msg){
    addNewMessagelocal({
        header: rtcMultiConnection.extra.username,
        message: msg,
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "chat-message.png"),
        color: rtcMultiConnection.extra.color
    });
    rtcMultiConnection.send({type:"chat", message:msg });
}

/*$("#chatInput").keypress(function(e) {
    if (e.keyCode == 13) {
        sendChatMessage();
    }
})*/

/*$('#send').click( function() {
    sendChatMessage();
    return false; 
});*/

//$('#chatbox').height($( "#leftVideo" ).height());
$('#chatbox').css('max-height', $( "#leftVideo" ).height()+ 80);
$('#chatBoard').css('max-height', $( "#leftVideo" ).height());
$("#chatBoard").css("overflow-y" , "scroll");