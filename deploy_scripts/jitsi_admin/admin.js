// This is intended to be the SkotOS XMPP admin bot.
// It needs to connect to the server to hold chatrooms open.
// It should also be able to kick users approximately on demand (eventually.)

// Docs on Strophe, the XMPP client it uses:
// Strophe JS lib: https://strophe.im/strophejs/
// Strophe class API docs: https://strophe.im/strophejs/doc/1.3.0/index/Classes.html
// Strophe example code: https://github.com/strophe/strophejs/tree/master/examples


require('./strophe-1.4.2.umd.js');

var SKOTOS_SERVER = 'wss://meet.testing-14.madrubyscience.com/xmpp-websocket';
var JID = 'skotosadmin';
var PASSWORD = 'S00perS3krit';

var connection = null;

function log(msg) 
{
    console.log(msg + "\n");
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
        log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
        log('Strophe failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
        log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
        log('Strophe is disconnected.');
    } else if (status == Strophe.Status.CONNECTED) {
        log('Strophe is connected.');
        log('ECHOBOT: Send a message to ' + connection.jid + 
            ' to talk to me.');

        connection.addHandler(onMessage, null, 'message', null, null,  null); 
        //connection.send($pres().tree());
    }
}

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
        var body = elems[0];

        log('ECHOBOT: I got a message from ' + from + ': ' + 
            Strophe.getText(body));
    
        //var reply = $msg({to: from, from: to, type: 'chat'})
        //    .cnode(Strophe.copyElement(body));
        //connection.send(reply.tree());

        //log('ECHOBOT: I sent ' + from + ': ' + Strophe.getText(body));
    }

    // we must return true to keep the handler alive.  
    // returning false would remove it after it finishes.
    return true;
}

connection = new Strophe.Connection(SKOTOS_SERVER);
connection.connect(JID, PASSWORD, onConnect);

// Uncomment the following lines to spy on the wire traffic.
connection.rawInput = function (data) { log('RECV: ' + data); };
connection.rawOutput = function (data) { log('SEND: ' + data); };

// Uncomment the following line to see all the debug output.
Strophe.log = function (level, msg) { log('LOG: ' + msg); };

function disconnect() {
    connection.disconnect();
}

setTimeout(disconnect, 5000);
