const tmi = require('tmi.js');
const User = require("./user.js");
const mongoose = require('mongoose');
const reaction = require('./reaction.js');
mongoose.connect('mongodb://lamabot:L4ma2016-auth@ds059316.mlab.com:59316/lamasquadbot');

// Connection à twitch

const tmiConfig = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "Nom du bot",
        // Aller chercher le token ici http://twitchapps.com/tmi/ 
        password: "Le token oauth"
    },
    channels: [
        "Nom de la chaine que le bot va rejoindre"
    ]
};

// Config client twitch

let client = new tmi.client(tmiConfig);

client.connect();

client.on('connected', (adress, port) => {
    console.log(client.getUsername() + " s'est connecté sur : " + adress + ", port : " + port);
    client.say("Nom de la chaine", "Message");
});

// Création de commande pour le bot

const prefix = "!";

function commandParser(message){
    let prefixEscaped = prefix.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regex = new RegExp("^" + prefixEscaped + "([a-zA-Z]+)\s?(.*)");
    return regex.exec(message);
}

client.on('chat', (channel, user, message, isSelf) => {
    if (isSelf) return;

    let fullCommand = commandParser(message);

    if(fullCommand){
        let command = fullCommand[1];
        let param = fullCommand[2];

        switch(command){
            case "bonjour":
                client.say(channel, "Bonjour à toi " + user['display-name']);
                break;
            default:
                client.say(channel, "Commande '" + command + "'' non reconnue. Tapez " + prefix + "help pour la liste des commandes de " + client.getUsername());
        }
    }
    updateExperience(user['display-name'], channel);
});

//  Niveaux

/* function getMaximumExpByLevel(level){
    return level*1;
}

function getUserLevel(user, callback){
    let query = {'name': user};
    User.findOne(query, function(err, userDoc){
        if (err) console.log("Err while finding user experience : " , err);
        if(userDoc) {
            callback(userDoc)
        }
    });
}

function updateExperience(user, channel){
    let query = {'name': user};
    User.findOneAndUpdate(query, { $inc: { experience: 1 }}, {upsert:true,  setDefaultsOnInsert: true, new: true}, function(err, userDoc){
        if (err) console.log("Err while updating experience : " , err);
        if(userDoc.experience >= getMaximumExpByLevel(userDoc.level)){
            userDoc.experience = 0;
            userDoc.level++;
            userDoc.save((errLevel) => {
                if (errLevel) console.log("Err while updating level : " , errLevel);
                if(!errLevel){
                    client.say(channel, "CurseLit " + userDoc.name + " vient de passer niveau " + userDoc.level + " !");
                }
            });
        }
    });
}

client.on('chat', (channel, user, message, isSelf) => {
    if (isSelf) return;

    let fullCommand = commandParser(message);

    if(fullCommand){
        let command = fullCommand[1];
        let param = fullCommand[2];

        switch(command){
          case "rank":
            getUserLevel(user['display-name'], (userDoc) =>{
              client.whisper(user['display-name'], "Vous êtes level " + userDoc.level + ". Expérience : " + userDoc.experience + "/" + getMaximumExpByLevel(userDoc.level));
            });
            break;
        }
    }
});
*/
