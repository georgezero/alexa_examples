// Alexa SDK for JavaScript v1.0.00
// Copyright (c) 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved. Use is subject to license terms.

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Session State: Handles a multi-turn dialog model.
 * - LITERAL slot: demonstrates literal handling for a finite set of known values
 *
 * Examples:
 * Dialog model:
 *  User: "Alexa, ask Solar to tell me something."
 *  Alexa: "Guess what Solar said"
 *  User: "What"
 *  Alexa: "<phrase>"
 *  User: "<phrase> who"
 *  Alexa: "<Punchline>"
 */

/**
 * App ID for the skill
 */
var APP_ID = "";//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * Array containing knock knock jokes.
 */
var JOKE_LIST = [
    {setup: "Pickle", punchline: "Pickle little flower to give to your mother."},
    // {setup: "", punchline: ""},
    // {setup: "", punchline: ""},
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SolarSaysSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SolarSaysSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SolarSaysSkill.prototype = Object.create(AlexaSkill.prototype);
SolarSaysSkill.prototype.constructor = SolarSaysSkill;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
SolarSaysSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
SolarSaysSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SolarSaysSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    handleTellMeAJokeIntent(session, response);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
SolarSaysSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

SolarSaysSkill.prototype.intentHandlers = {
    TellMeAJokeIntent: function (intent, session, response) {
        handleTellMeAJokeIntent(session, response);
    },

    WhosThereIntent: function (intent, session, response) {
        handleWhosThereIntent(session, response);
    },

    SetupNameWhoIntent: function (intent, session, response) {
        handleSetupNameWhoIntent(session, response);
    },

    HelpIntent: function (intent, session, response) {
        var speechOutput = "";

        switch (session.attributes.stage) {
            case 0:
                speechOutput = "Knock knock jokes are a fun call and response type of joke. " +
                    "To start the joke, just ask, by saying tell me a joke or you can say exit.";
                break;
            case 1:
                speechOutput = "You can ask, who's there or you can say exit.";
                break;
            case 2:
                speechOutput = "You can ask, who or you can say exit.";
                break;
            default:
                speechOutput = "Knock knock jokes are a fun call and response type of joke. " +
                    "To start the joke, just ask, by saying tell me a joke or you can say exit.";
        }

        response.ask(speechOutput);
    }
}

/**
 * Selects a joke randomly and starts it off by saying "Knock knock".
 */
function handleTellMeAJokeIntent(session, response) {
    var speechOutput = "";

    //Reprompt speech will be triggered if the user doesn't respond.
    var repromptSpeech = "You can ask who's there";

    //Check if session variables are already initialized.
    if (session.attributes.stage) {

        //Ensure the dialogue is on the correct stage.
        if (session.attributes.stage === 0) {
            //The joke is already initialized, this function has no more work.
            speechOutput = "knock knock!";
        } else {
            //The user attempted to jump to the intent of another stage.
            session.attributes.stage = 0;
            speechOutput = "That's not how knock knock jokes work! "
                + "knock knock";
        }
    } else {
        //Select a random joke and store it in the session variables.
        var jokeID = Math.floor(Math.random() * JOKE_LIST.length);

        //The stage variable tracks the phase of the dialogue.
        //When this function completes, it will be on stage 1.
        session.attributes.stage = 1;
        session.attributes.setup = JOKE_LIST[jokeID].setup;
        session.attributes.punchline = JOKE_LIST[jokeID].punchline;

        speechOutput = "Knock knock!";
    }

    response.askWithCard(speechOutput, repromptSpeech, "Wise Guy", speechOutput);
}

/**
 * Responds to the user saying "Who's there".
 */
function handleWhosThereIntent(session, response) {
    var speechOutput = "";
    var repromptSpeech = "";

    if (session.attributes.stage) {
        if (session.attributes.stage === 1) {
            //Retrieve the joke's setup text.
            speechOutput = session.attributes.setup;

            //Advance the stage of the dialogue.
            session.attributes.stage = 2;

            repromptSpeech = "You can ask, " + speechOutput + " who?";
        } else {
            session.attributes.stage == 0;
            speechOutput = "That's not how knock knock jokes work! "
                + "knock knock";

            repromptSpeech = "You can ask who's there."
        }
    } else {

        //If the session attributes are not found, the joke must restart.
        speechOutput = "Sorry, I couldn't correctly retrieve the joke. "
            + "You can say, tell me a joke";

        repromptSpeech = "You can say, tell me a joke";
    }

    response.ask(speechOutput, repromptSpeech);
}

/**
 * Delivers the punchline of the joke after the user responds to the setup.
 */
function handleSetupNameWhoIntent(session, response) {
    var speechOutput = "";
    var repromptSpeech = "";

    if (session.attributes.stage) {
        if (session.attributes.stage === 2) {
            speechOutput = session.attributes.punchline;

            //If the joke completes successfully, this function uses a "tell" response.
            response.tellWithCard(speechOutput, "Wise Guy", speechOutput);
        } else {

            session.attributes.stage == 0;
            speechOutput = "That's not how knock knock jokes work! "
                + "Knock knock!";

            repromptSpeech = "You can ask who's there."

            //If the joke has to be restarted, tis function uses an "ask" response.
            response.askWithCard(speechOutput, repromptSpeech, "Wise Guy", speechOutput);
        }
    } else {
        speechOutput = "Sorry, I couldn't correctly retrieve the joke. "
            + "You can say, tell me a joke";

        repromptSpeech = "You can say, tell me a joke";

        response.askWithCard(speechOutput, repromptSpeech, "Wise Guy", speechOutput);
    }
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SolarSays Skill.
    var skill = new SolarSaysSkill();
    skill.execute(event, context);
};
