var ws = require("nodejs-websocket");
var fs = require("fs");
// var jsnes = require("jsnes");

console.log("开始建立连接...");

var socket;
var server = ws.createServer(function (conn) {
	socket = conn;
	conn.on("text", function (content) {
		const data = JSON.parse(content);
		if (data.type === 'start') {
			start(data);
		} else if (data.type === 'render') {
			render(data);
		}
		// conn.sendText(str)
	})
	conn.on("close", function (code, reason) {
		console.log("关闭连接");
	});
	conn.on("error", function (code, reason) {
		console.log("异常关闭");
	});
}).listen(3001);

function start() {
	var romData = fs.readFileSync('roms/Contra (U) [!].nes', { encoding: 'binary' });
	server.connections.forEach(function (conn) {
		conn.sendText(JSON.stringify({
			type: 'origin',
			data: romData
		}))
	})
}

function render(data) {
	server.connections.forEach(function (conn) {
		// conn.sendText(JSON.stringify(info))
		conn.sendText(JSON.stringify({
			type: 'render',
			data: data.data
		}));
	});
}


console.log("WebSocket建立完毕")