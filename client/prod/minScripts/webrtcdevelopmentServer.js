module.exports=function(e,n){function s(e,n){console.log(" ---------------> onNewNamespace ",e),o.of("/"+e).on("connection",function(s){var a;o.isConnected&&(o.isConnected=!1,s.emit("connect",!0)),s.on("message",function(o){if(o.sender==n)if(a||(a=o.data.sender),console.log(o.data),s.broadcast.emit("message",o.data),t[e])t[e].log.push((new Date).toLocaleString()+":-user "+o.sender+" send message "+JSON.stringify(o.data));else if(o.data.left){var r=t[o.data.sessionid].users.indexOf(o.data.userid);-1!=r&&t[o.data.sessionid].users.splice(r,1),t[o.data.sessionid].log.push((new Date).toLocaleString()+":-user "+o.data.userid+" left "),0==t[o.data.sessionid].users.length?t[o.data.sessionid].status="inactive":t[o.data.sessionid].status=t[o.data.sessionid].users.length+" active members"}else console.log("channels[channel] doesnt exist ")}),s.on("disconnect",function(n){console.log("disconnect inside new namespace -----",n),a?(console.log("username ",a),s.broadcast.emit("user-left",a),t[e].log.push((new Date).toLocaleString()+":-user "+a+" left "),a=null):console.log("username not defined ")})})}console.log("< ------------------------realtimecomm-------------------> ");var o=require("socket.io").listen(e,{log:!1,origins:"*:*"});o.set("transports",["websocket"]);var t={},a={};return o.sockets.on("connection",function(e){var n="";o.isConnected||(o.isConnected=!0),e.on("namespace",function(e){a[e.sender]={userid:e.sender,join_timestamp:(new Date).toLocaleString(),status:"online"},s(e.channel,e.sender)}),e.on("new-channel",function(e){t[e.channel]||(n=e.channel),console.log("------------new channel------------- ",e.channel," by ",e.sender),t[e.channel]={channel:e.channel,timestamp:(new Date).toLocaleString(),users:[e.sender],status:"waiting",endtimestamp:0,log:[(new Date).toLocaleString()+":-channel created . User "+e.sender+" waiting "]}}),e.on("join-channel",function(e){console.log("------------join channel------------- ",e.channel," by ",e.sender),t[e.channel].users.push(e.sender),t[e.channel].status=t[e.channel].users.length+" active members",t[e.channel].log.push((new Date).toLocaleString()+":-User "+e.sender+" joined the channel ")}),e.on("leave-channel",function(e){console.log("leave-channel",e)}),e.on("presence",function(n){var s=!!t[n.channel];console.log("------------presence for channel------------ ",n," is ",s),e.emit("presence",s)}),e.on("disconnect",function(e){console.log("disconnect",e)}),e.on("admin_enquire",function(n){switch(n.ask){case"channels":n.find?e.emit("response_to_admin_enquire",module.getChannel(n.find,n.format)):e.emit("response_to_admin_enquire",module.getAllChannels(n.format));break;case"users":e.emit("response_to_admin_enquire",module.getAllActiveUsers(n.format));break;case"channel_clients":e.emit("response_to_admin_enquire",module.getChannelClients(n.channel));break;default:e.emit("response_to_admin_enquire","no case matched ")}})}),module.getAllChannels=function(e){var n={response:"channels",channels:t,format:e};return n},module.getChannel=function(e,n){var s={response:"users",users:t[e],format:n};return s},module.getAllActiveUsers=function(e){var n=[];for(i in Object.keys(t)){var s=Object.keys(t)[i];for(j in t[s].users)n.push(t[s].users[j])}var o={response:"users",users:n,format:e};return o},module.getUser=function(e,n){var s={response:"users",users:a[e]?a[e]:"notfound",format:n};return s},module.getChannelClients=function(e){var n={response:"users",clients:o.of("/"+e).clients(),format:data.format};return n},console.log(" Socket.io env => "+n.enviornment+" running at\n "+n.httpsPort),module};
module.exports=function(e,s,n,r){function o(e,s,n){console.log("params----------",e.params),s.json({type:!0,data:e.params.version})}function t(s,n,r){var o=e.getAllChannels("json");n.json({type:!0,data:o})}function a(s,n,r){if(!s.params.channelid)return void n.json({type:!0,data:"channelid is required"});var o=e.getChannel(s.params.channelid,"json");n.json({type:!0,data:o})}function i(s,n,r){var o=e.getAllActiveUsers("json");n.json({type:!0,data:o})}function l(s,n,r){if(!s.params.userid)return void n.json({type:!0,data:"userid is required"});var o=e.getUser(s.params.userid,"json");n.json({type:!0,data:o})}function d(s,n,r){var o=e.getChannelClients("json");n.json({type:!0,data:o})}function c(e,s){if("options"===e.method.toLowerCase()){var n=["Accept","Accept-Version","Content-Type","Api-Version","Origin","X-Requested-With"];return-1===s.methods.indexOf("OPTIONS")&&s.methods.push("OPTIONS"),s.header("Access-Control-Allow-Credentials",!0),s.header("Access-Control-Allow-Headers",n.join(", ")),s.header("Access-Control-Allow-Methods",s.methods.join(", ")),s.header("Access-Control-Allow-Origin",e.headers.origin),s.send(204)}return s.send(new u.MethodNotAllowedError)}console.log("<------------------------ REST API-------------------> ");var u=require("restify"),p=u.createServer(s);return p.use(function(e,s,n){return s.header("Access-Control-Allow-Origin","*"),s.header("Access-Control-Allow-Headers","X-Requested-With"),n()}),p.use(u.acceptParser(p.acceptable)),p.use(u.dateParser()),p.use(u.queryParser()),p.use(u.CORS()),p.use(u.bodyParser({mapParams:!0})),p.get("/webrtc/details",o),p.get("/session/all-sessions",t),p.get("/session/getsession",a),p.get("/session/clients",d),p.get("/user/all-users",i),p.get("/user/getuser",l),p.on("MethodNotAllowed",c),p.listen(r.restPort,function(){console.log("%s listening at %s",p.name,p.url)}),console.log(" REST server env => "+r.enviornment+" running at\n "+r.restPort),module};