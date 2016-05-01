IoServ
======
A framework to make IRC network services.

Usage:
======
#### bot.init(config) ####

Starts the bot with config.txt, or if no config.txt found it uses config parameter.

Config options:

server [String]: What server to connect

modules [Array]: What modules to load (you can load/unload modules later with bot.load and bot.unloadm)

port [Number]: What port will bot connect to server

sid [Number]: Server ID that will be used, make sure you don't use the same for other server.

passwd [String]: Password to use for authentication

desc [String]: Description used by server while connecting

sname [String]: Name your server will have, make sure you don't use it for other server or one of the servers won't connect

permissions [Object]: {host: permissions} host is the user's hostname (a string), and permissions is a number.

bname [String]: The nick that services bot will use

bhost [String]: Fake host that bot will use when it's presented to network

#### bot.say(msg, target) ####

Sends a message to a user or channel.

msg [String]: message being sent to target

target [String]: channel or user the message is being sent to

#### bot.kill(target, reason) ####

Kills a user from the network.

target [String]: user that is being killed from the network

reason [String]: Reason for the kill

#### bot.chghost(target, host) ####

Changes an user's shown hostname (real one only seen to opers that use WHOIS).

target [String]: nick of users

host [String]: new host for the user

#### bot.jupe(target, reason) ####

SQUITs and JUPEs a server, avoiding it from connecting

target [String]: target server

reason [String]: reason used for SQUIT, also new server's description.

#### bot.samode(target, modes) ####

Forcibly changes a channel modes. Useful for getting op in channels.

target [String]: channel being affected

modes [String]: modes being changed

#### bot.addline(target, reason, time, type) ####

Adds a line to a target, it can be GLine (G), IP Ban (Z), Nick ban (Q) or Spamfilter (F)

target [String]: ident@host being targeted

reason [String]: Reason for the line

time [Number]: How many secconds the line lasts (If time is 1 or undefined, ban wil last until it's removed)

type [String]: Line type, defaults to GLine

#### bot.delline(target, type): ####

Removes a line from the target.

target [String]: ident@host that has the line

type [String]: line type being removed

#### bot.saveConfig() ####

Saves variable config to config.txt

#### bot.rsocket(port, passwd) ####

Starts RCON server. Gives level 101 to clients.

port [Number]: Port that RCON will listen on

passwd [String]: RCON password

#### bot.nicks ####

Contains a object will all nicks on the network.

#### bot.perms(host) ####

Gets host's permissions level.

host [String]: Host to query for

#### bot.load(module) ####

Loads a module

module [String]: Module to be loaded

#### bot.execCmd(parsed) ####

Executes a command

parsed [Object]: Output of bot.parseLine(data)

#### bot.parseLine(line) ####

Parses a line from the uplink.

line [String]: Raw line from server

#### bot.socket ####

Contains socket used for connection, uses "socket" default module.