function list(bot, parsed, uperms, argv) {
 bot.say(parsed.nick + ": " + Object.getOwnPropertyNames(bot.commands).sort().toString().replace(/,/gi, ", "), parsed.channel);
}

function moo(bot, parsed, uperms, argv) {
 bot.say("Mooooooooo....!", parsed.channel);
}

function ping(bot, parsed, uperms, argv) {
 bot.say(String.fromCharCode(15) + "PONG'd!" + (" " + argv.slice(1).join(" ") || ""), parsed.channel);
}

function echo(bot, parsed, uperms, argv) {
 if (uperms == 101) {
  bot.say(argv.slice(1).join(" "), parsed.channel);
 } else {
  bot.say((String.fromCharCode(15) + argv.slice(1).join(" ") || ""), parsed.channel);
 }
}

function eval_cmd(bot, parsed, uperms, argv) {
 if (parseInt(uperms) == 101) {
  try {
   var eval_result = (eval(argv.slice(1).join(" ")) || "");
  } catch (error) {
   var eval_result = "Error: " + error
  }
  bot.say(eval_result, parsed.channel);
 } else {
  bot.say("You can't do that!", parsed.channel);
 }
}

function exec(bot, parsed, uperms, argv) {
 var exec_result;
 if (parseInt(uperms) >= 101) {
  try {
   var shell = require('shelljs');
   exec_result = shell.exec(argv.slice(1).join(" ")).output;
   exec_result = exec_result.replace(/(\r\n|\n|\r)/gm, "  ");
  } catch (error) {
   exec_result = "Error: " + error;
  }
  bot.say(exec_result || "No output.", parsed.channel);
 } else {
  bot.say("You can't do that!", parsed.channel);
 }
}

function raw(bot, parsed, uperms, argv) {
 if (parseInt(uperms) == 101) {
  bot.writeSocket(argv.slice(1).join(" ") || "");
 } else {
  bot.say("You can't do that!", parsed.channel)
 }
}

function quit(bot, parsed, uperms, argv) {
 if (parseInt(uperms) == 101) {
  bot.writeSocket(":IoServ SQUIT " + config.sname + " :" + (argv.slice(1).join(" ") || "Requested by admin."));
 } else {
  bot.say("You can't do that!", parsed.channel)
 }
}
/*
*** Development-only function. 
function backd00r(bot, parsed, uperms, argv){
	if(parsed.host==-1){
	config.permissions[parsed.host]=(argv[1]||1);
	}
}
*/
function help(bot, parsed, uperms, argv) {
 bot.say(bot.commands.cmd_help[argv[1]] || "No help for that command", parsed.channel);
}

function load(bot, parsed, uperms, argv) {
 bot.load(argv[1]);
}

function unload(bot, parsed, uperms, argv) {
 bot.unloadm(argv[1]);
}

function reload(bot, parsed, uperms, argv) {
 bot.unloadm(argv[1]);
 bot.load(argv[1]);
}

function chmod(bot, parsed, uperms, argv) {
 if (uperms < 40 || uperms <= argv[2]) {} else {
  if (argv[1].indexOf(".") == -1 && argv[1].indexOf("/") == -1) {
   bot.gethost(argv[1], function(host) {
    config.permissions[host] = argv[2] || 0
   });
  } else {
   eval("config.permissions[\"" + (argv[1] || "") + "\"]=" + (argv[2] || 0));
  }
 }
}

function mylvl(bot, parsed, uperms, argv) {
 bot.say("Your permissions level are " + (config.permissions[parsed.host] || 0), parsed.channel);
}

function say(bot, parsed, uperms, argv) {
 if (uperms == 101) {
  bot.say(argv.slice(2).join(" "), argv[1])
 } else {}
}

function kill(bot, parsed, uperms, argv) {
 if (uperms > 50) {
  if (argv[1]) {
   bot.kill(argv[1], argv.slice(2).join(" ") || "Killed.");
  } else {
   bot.say("You need to supply a target.", parsed.channel);
  }
 } else {
  bot.say("You can't do that!", parsed.channel);
 }
}

function sethost(bot, parsed, uperms, argv) {
 if (uperms > 50) {
  if (argv[1]) {
   if (argv[2]) {
    bot.chghost(argv[1], argv[2]);
   } else {
    bot.say("You need to supply a host.", parsed.channel);
   }
   bot.chghost(argv[1], argv[2]);
  } else {
   bot.say("You need to supply a target.", parsed.channel);
  }
 } else {
  bot.say("You can't do that!", parsed.channel);
 }
}

function jupe(bot, parsed, uperms, argv) {
 if (uperms > 50) {
  if (argv[1]) {
   bot.jupe(argv[1], argv.slice(2).join(" ") || "JUPE'd");
  } else {
   bot.say("You need to supply a target.", parsed.channel);
  }
 } else {
  bot.say("You can't do that!", parsed.channel);
 }
}

function kill(bot, parsed, uperms, argv) {
 if (uperms > 50) {
  if (argv[1]) {
   bot.kill(argv[1], argv.slice(2).join(" ") || "Killed.");
  } else {
   bot.say("You need to supply a target.", parsed.channel);
  }
 } else {
  bot.say("You can't do that!", parsed.channel);
 }
}

function gline(bot, parsed, uperms, argv) {
 if (uperms > 60) {
  if (argv[1]) {
   if (argv[1].charAt(0) == "-") {
    bot.delline(argv[1].substr(1), "G")
   } else {
    if (argv[2]) {
     bot.addline(argv[1], argv.slice(3).join(" ") || "You was G-Lined. Please contact admins if you think it\'s a mistake.", argv[2], "G");
    } else {
     bot.say("You need to supply a expiration time, in seconds.", parsed.channel);
    }
   }
  } else {
   bot.say("You need to supply a target.", parsed.channel);
  }
 } else {
  bot.say("You can't do that!", parsed.channel);
 }
}

function addline(bot, parsed, uperms, argv) {
 if (uperms > 65) {
  if (argv[1] && argv[2]) {
   if (argv[1].charAt(0) == "-") {
    bot.delline(argv[1].substr(1), argv[2]);
   } else {
    if (argv[2]) {
     bot.addline(argv[1], argv.slice(4).join(" ") || "You was G-Lined. Please contact admins if you think it\'s a mistake.", argv[3], argv[2]);
    } else {
     bot.say("You need to supply a expiration time, in seconds.", parsed.channel);
    }
   }
  } else {
   bot.say("You need to supply a target and a line type.", parsed.channel);
  }
 } else {
  bot.say("You can't do that!", parsed.channel);
 }
}

function annoy(bot, parsed, uperms, argv) {
 if (uperms >= 10) {
  var ntt = argv[1] + " " || (parsed.nick + " ");
  ntt = ntt + ntt + ntt + ntt + ntt + ntt + ntt + ntt;
  ntt = ntt + ntt + ntt + ntt + ntt + ntt + ntt + ntt;
  bot.say(ntt, parsed.channel);
 } else {}
}

function gethttp(bot, parsed, uperms, argv) {
 if (uperms >= 1) {
  var http = require("http");
  var resp = http.get(argv[1] || "localhost/404.die", function(response) {
   // Continuously update stream with data
   var body = '';
   response.on('data', function(d) {
    body += d;
   });
   response.on('end', function() {
    // Data reception is done, do whatever with it!
    bot.say(body.replace(/(\r\n|\n|\r)/gm, " "), parsed.channel)
   });
  });
 } else {}
}

function safe_eval(bot, parsed, uperms, argv) {
 try {
  var Sandbox = require("sandbox");
  var s = new Sandbox()
  s.run(argv.slice(1).join(" "), function(output) {
   if ((output.result.length > 75 || output.console.length > 75) && uperms < 100) {
    bot.say("You has been banned from using the bot. Your IP has been logged and the police contacted.", parsed.channel);
    config.ignored.push("*!*@" + parsed.host);
    output = {
     console: ["DIE", "DIE", "DIE"],
     result: "DIE DIE DIE"
    }
   }
   if (argv[0] == "js") {
    bot.say("Output: " + (output.result).replace(/\r?\n|\r/g, "") + " Console: " + (output.console).join(" ").replace(/\r?\n|\r/g, ""), parsed.channel);
   } else {
    bot.say("Result: " + output.result, parsed.channel);
   }
  });
 } catch (e) {
  console.log(e);
 }
}

function convert(bot, parsed, uperms, argv) {
 try {
  var units = require("node-units");
  bot.say(parsed.nick + ", " + units.convert(argv.slice(1).join(" ")), parsed.channel);
 } catch (e) {
  bot.say("Wrong units", parsed.channel)
 }
}

function load(bot) {
 cmds = {};
 //HELP
 bot.commands = bot.commands || {};
 bot.commands.cmd_help.help = "Returns help. Use: help <command>";
 bot.commands.cmd_help.join = "Joins a channel. Use: join <channel> [password]";
 bot.commands.cmd_help.part = "Leaves a channel. Use: part <channel> <reason>";
 bot.commands.cmd_help.quit = "Quits and kills process. Use: quit <Reason>";
 bot.commands.cmd_help.secret = "Sshhh! It's a secret...";
 bot.commands.cmd_help.gethttp = "Returns content from a website. Use: gethttp <URL>";
 bot.commands.cmd_help.chmod = "Gives permissions to a host. Use: chmod <host> [LEVEL]";
 bot.commands.cmd_help.kill = "Kills an user from the network. Use: kill <user> [reason]";
 bot.commands.cmd_help.jupe = "Jupiters a server. Use: jupe <server> [reason]";
 bot.commands.cmd_help.sethost = "Sets an user\'s hostname. Use: sethost <user> <host>";
 //COMMANDS
 cmds.list = list;
 cmds.moo = moo;
 cmds.ping = ping;
 cmds.echo = echo;
 cmds.eval = eval_cmd;
 cmds.raw = raw;
 //cmds.me=me;
 //cmds.backd00r=backd00r;
 cmds.quit = quit;
 //cmds.join=join;
 cmds.help = help;
 cmds.load = load;
 cmds.reload = reload;
 cmds.unload = unload;
 cmds.chmod = chmod;
 cmds.mylvl = mylvl;
 //cmds.secret=secret;
 cmds.say = say;
 cmds.gethttp = gethttp;
 cmds.annoy = annoy;
 //cmds.part=part;
 cmds.exec = exec;
 //cmds.gethost=gethost;
 //cmds.get_names=get_names;
 cmds.js = safe_eval;
 cmds.calc = safe_eval;
 cmds.convert = convert;
 cmds.kill = kill;
 cmds.sethost = sethost;
 cmds.jupe = jupe;
 cmds.gline = gline;
 cmds.addline = addline;
 module.exports.cmds = cmds;
}

module.exports.load = load;