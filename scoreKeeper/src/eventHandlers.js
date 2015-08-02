// Alexa SDK for JavaScript v1.0.00
// Copyright (c) 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved. Use is subject to license terms.
'use strict';
var storage = require('./storage'),
    textHelper = require('./textHelper');

var registerEventHandlers = function (eventHandlers, skillContext) {
    eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
        //if user said a one shot command that triggered an intent event,
        //it will start a new session, and then we should avoid speaking too many words.
        skillContext.needMoreHelp = false;
    };

    eventHandlers.onLaunch = function (launchRequest, session, response) {
        //Speak welcome message and ask user questions
        //based on whether there are players or not.
        storage.loadGame(session, function (currentGame) {
            var speechOutput = '',
                reprompt;
            if (currentGame.data.players.length === 0) {
                speechOutput += 'ScoreKeeper, Let\'s start your game. Who\'s your first player?';
                reprompt = "Please tell me who is your first player?";
            } else if (currentGame.isEmptyScore()) {
                speechOutput += 'ScoreKeeper, '
                    + 'you have ' + currentGame.data.players.length + ' player';
                if (currentGame.data.players.length > 1) {
                    speechOutput += 's';
                }
                speechOutput += ' in the game. You can give a player points, add another player, reset all players or exit. Which would you like?';
                reprompt = textHelper.completeHelp;
            } else {
                speechOutput += 'ScoreKeeper, What can I do for you?';
                reprompt = textHelper.nextHelp;
            }
            response.ask(speechOutput, reprompt);
        });
    };
};
exports.register = registerEventHandlers;