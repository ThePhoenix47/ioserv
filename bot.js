var net = require('net');
var events = require('events');
var bot = new events.EventEmitter();

var socket = new net.Socket();
socket.setEncoding('UTF-8');
config = {};
bot.writeSocket = function(data) {
 socket.write(data + '\r\n');
 console.log(new Date() + " [" + config.server + "] " + data + '\n');
};
bot.socket = socket;
bot.module = {};
bot.lib = {};
bot.lib.mc = {};
bot.commands = {};
bot.commands.cmd_help = {};
bot.commands.aliases = {};
bot.unloadm = function(module) {
 var pathj = require("path").join;
 require.cache[pathj(__dirname, module + ".js")] = undefined;
 for (var i in bot.module[module].cmds) {
  delete bot.commands[i];
 }
 delete bot.module[module];
};
bot.parseLine = function(line) {
 if (!line || line == "") {
  return;
 }
 var parsed = {};
 var parts = line.toString().split(" ");
 parsed.numeric = parts[1];
 parsed.prefix = parts[0].substr(1);
 if (typeof parts.slice(2) == "object") {
  var args = parts.slice(2);
 } else {
  var args = [""];
 }
 parsed.args = args.join(" ");
 var hostname_regex = new RegExp("(.+)!(.+)@(.+)");
 if (hostname_regex.test(parsed.prefix)) {
  var ahostname = hostname_regex.exec(parsed.prefix);
  if (ahostname.length == 4) {
   parsed.nick = ahostname[1];
   parsed.ident = ahostname[2];
   parsed.host = ahostname[3];
   if (parsed.numeric == "KICK") {
    parsed.kicked = parts[3].replace(/(\r\n|\n|\r)/gm, "");
   }
   if (bot.isChan(parts[2])) {
    parsed.channel = parts[2];
   } else {
    parsed.channel = parsed.nick;
   }
   if (parsed.numeric == "KICK") {
    parsed.msg = parts.slice(4).join(" ").replace(/(\r\n|\n|\r)/gm, "").substr(1);
   } else {
    parsed.msg = parts.slice(3).join(" ").substr(1).replace(/(\r\n|\n|\r)/gm, "");
   }
  }
 }
 parsed.unparsed = parts;
 return parsed;
};
var clients = [];
bot.say = function(msg, target) {
 try {
  if (msg.indexOf(config.passwd) > -1) {
   return;
  }
 } catch (e) {}
 if (clients[target]) {
  clients[target].write("RESP " + msg + "\r\n");
 } else {
  bot.writeSocket(":IoServ PRIVMSG " + target + " :" + msg);
 }
};
bot.load = function(module) {
 try {
  bot.module[module] = require("./" + module + ".js");
  bot.module[module].load(bot, config);
  for (var i in bot.module[module].cmds) {
   bot.commands[i] = bot.module[module].cmds[i];
  }
 } catch (e) {
  /*
		var gist = require('gist');

		var newGist = {
  			"description": "Error while loading module "+module+".js \r\n",
  			"public": false,
 			 "files": {
    			"error.log": {
     				 "content": "Error: \n "+e
   			 }
  		}

		};
		gist(config.gh.token).create(newGist, function(err, resp, json) {
			if(err){console.log(err)}
 			 console.log("Error logged to "+json.html_url);
			 bot.say("Error logged to "+json.html_url, config.logchan||"##powder-bots");
		});
		*/
  //bot.say("Failed loading module "+module, config.logchan||"##powder-bots");
  console.log(new Date() + "[ERROR] Loading " + module + "> " + e.stack);

 }
};
bot.kill = function(target, reason) {
 bot.writeSocket(":"+config.bname+" kill " + target + " :"+config.bname+"@" + config.sname + " " + reason);
};
bot.chghost = function(target, host) {
 bot.writeSocket(":"+config.bname+" CHGHOST " + target + " " + host);
};
bot.jupe = function(target, reason) {
 bot.writeSocket(":"+config.bname+" SQUIT " + target + " :" + reason);
 bot.writeSocket(":" + config.sname + " SERVER " + target + " 2 :" + reason);
};
bot.samode = function(target, modes) {
 bot.writeSocket(":"+config.bname+" SAMODE " + target + " " + modes);
};
bot.addline = function(target, reason, time, type) {
 bot.writeSocket("TKL + " + (type || "G") + " * " + target + " "+config.bname+" " + ~~((new Date().getTime() + (time * 1000 || 1)) / 1000) + " " + ~~(new Date().getTime() / 1000) + " :" + reason);
};
bot.delline = function(target, type) {
 bot.writeSocket("TKL - " + (type || "G") + " * " + target + " "+config.bname);
};
var namesc = {};
bot.saveConfig = function() {
 var ConfFile = JSON.stringify(config);
 var fs = require('fs');
 fs.writeFile('config.txt', ConfFile, function(err) {
  if (err) return console.log(new Date + " [ERROR] " + err);
  console.log(new Date + ' [DEBUG] Config file was saved.');
 });
};
bot.init = function(pconfig) {
  var fs = require('fs');
  fs.readFile('config.txt', 'utf8', function(err, data) {
   if (err) {
    if (pconfig) {
     config = pconfig;
    } else throw new Error("No config suplied");
   } else {
    config = {};
    config = JSON.parse(data);
    console.log(new Date + " [INFO] Bot starting... Config File is:");
    console.log(config);
   }
   socket.connect(config.port, config.server, function() {
    setTimeout(function() {
     bot.writeSocket("PASS " + config.passwd);
     bot.writeSocket("PROTOCTL NICKv2 VHP NICKIP UMODE2 SJOIN SJOIN2 SJ3 NOQUIT TKLEXT ESVID MLOCK");
     bot.writeSocket("PROTOCTL SID=" + config.sid);
     bot.writeSocket("SERVER " + config.sname + " 1 :" + config.sdesc);
     bot.writeSocket(":" + config.sname + " EOS");
     for (i in config.modules) {
      bot.load(config.modules[i])
     }
     bot.writeSocket("NICK "+config.bname+" 1 " + (new Date).getTime() / 1000 + "+config.bname+" "+config.bhost+" "+config.sname+" 0 +SNaio "+config.sname+" uohM9w== :"+config.bname);
    }, 6000);
   });
  });
 }
 // Start a TCP Server
bot.rsocket = function(port, passwd) {
 net = require('net');
 return net.createServer(function(socket) {
  var name = Math.floor(Math.random() * 1000) + "-rcon";
  clients[name] = socket;
  console.log("[INFO] New from " + socket.remoteAddress);
  // Handle incoming messages from clients.
  socket.on('data', function(data) {
   console.log(new Date + " [DEBUG] [" + name + "@RCON]> " + data.toString());
   if (socket.auth) {
    bot.execCmd({
     "numeric": "PRIVMSG",
     "prefix": name + "!~" + name + "@" + name,
     "args": name + " " + data,
     "nick": name,
     "ident": "~" + name,
     "host": name,
     "channel": name,
     "msg": "?!" + data.toString(),
     "unparsed": [":" + name + "!~" + name + "@" + name, "PRIVMSG", name].push(data.toString().split(" "))
    });
   } else if (data.toString().split(" ")[0] == "PASS") {
    if (data.toString().split(" ")[1] == passwd) {
     socket.write("LOGIN_SUCESSFULL You logged in.\r\n");
     console.log("[INFO] Client from " + socket.remoteAddress + " logged in");
     socket.auth = true;
    } else {
     socket.write("ERR_WRONG_PASSWD Invalid password.\r\n");
    }
   } else {
    socket.write("ERR_NOT_LOGED_IN You need to auth using PASS <password>\r\n");
   }
  });

  // Remove the client from the list when it leaves
  socket.on('end', function() {
   console.log("[INFO] Client from " + socket.remoteAddress + " disconnected");
  });
  socket.on('error', function() {
   console.log("[INFO] Client from " + socket.remoteAddress + " disconnected");
  });
  console.log("[INFO] RCON server running at port " + port + "\n");
 }).listen(port);

};
bot.perms = function(host) {
 if (clients[host.split("!")[0]]) {
  return 101;
 }
 return config.permissions[host] || 0;
};
//console.log(config);

bot.execCmd = function(parsed) {
 var argv = parsed.msg.substr(2).split(" ");
 //console.log(bot.commands);
 //bot.module["ping"]["list"](bot, parsed, bot.perms(parsed.host))
 if (bot.commands[argv[0].toLowerCase()] == undefined || argv[0].toLowerCase() == "cmd_help" || argv[0].toLowerCase() == "aliases") {
  bot.say("No command called " + argv[0] + " was found!", parsed.channel);
 } else {
  try {
   bot.commands[argv[0].toLowerCase()](bot, parsed, bot.perms(parsed.host), argv);
  } catch (e) {
   bot.say("Error: " + e.toString(), parsed.channel);
   console.log(new Date + " [ERROR] While executing command: " + argv[0].toLowerCase() + ">" + e.toString());
  }
 }
};
socket.addListener('data', function(data) {
 var lines = (data.toString()).split("\r\n");
 for (var i = 0; i < lines.length; i++) {
  var numeric = (bot.parseLine(lines[i]) || {}).numeric;
  if (data.split(" ")[0] == "PING") {
   bot.emit("PING", data);
  }
  if (data.split(" ")[0] == "NICK") {
   bot.emit("NICK", data);
  }
  bot.emit(numeric, data, (bot.parseLine(data) || {}), bot);
  console.log(data);
 }
});

bot.on("PING", function(data, parsed) {
 bot.writeSocket("PONG " + config.sname + " " + config.server);
 console.log("[DEBUG] PONG'd");
});
bot.nicks = {};
bot.on("PRIVMSG", function(data, parsed) {
 if (parsed.unparsed[2].toLowerCase() == "ioserv") {
  var nick = parsed.unparsed[0].substr(1);
  var msg = parsed.unparsed.slice(3).join(" ").substr(1).replace("\r", "").replace("\n", "");
  console.log("Got PM from " + nick + ", data: " + msg);
  bot.execCmd({
   "numeric": "PRIVMSG",
   "prefix": nick + "!~" + nick + "@" + nick,
   "args": nick + " " + data,
   "nick": nick,
   "ident": "~" + nick,
   "host": nick,
   "channel": nick,
   "msg": "?!" + msg.toString(),
   "unparsed": [":" + nick + "!~" + nick + "@" + nick, "PRIVMSG", nick].push(msg.toString().split(" "))
  });
  console.log("User's host is " + (bot.nicks[nick] || new Array(7))[7]);
 }
});
bot.nicks[config.bname] = "1 " + (new Date).getTime() / 1000 + "+config.bname+" "+config.bhost+" "+config.sname+" 0 +SNaio "+config.sname+" uohM9w== :"+config.bname".split(" ");
bot.on("NICK", function(data) {
 var parts = data.split(" ");
 bot.nicks[parts[1]] = parts.slice(2);
});

socket.on('close', function() {
 console.log('[ERROR] Connection closed');
});
socket.on('error', function(err) {
 console.log('[ERROR] Connection closed ' + err);
});
module.exports = bot;