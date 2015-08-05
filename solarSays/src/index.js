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

// ARN: arn:aws:lambda:us-east-1:892437208924:function:solarSays

/**
 * App ID for the skill
 */
 
// amzn1.echo-sdk-ams.app.4a6e37df-37af-4a7c-b083-cc5acce9e8c0
var APP_ID = "";//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * Array containing knock knock jokes.
 */
var JOKE_LIST = [
    {setup: "Hello", punchline: "I like you"},
    {setup: "Hello", punchline: "I like drawing"},
    {setup: "Hello", punchline: "I like mama"},
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
    console.log("SolarSaysSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
SolarSaysSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SolarSaysSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    var speechOutput = "Welcome to the Solar Says, you can say hello";
    response.ask(speechOutput);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
SolarSaysSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("SolarSaysSkill onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

SolarSaysSkill.prototype.intentHandlers = {
    
    // register custom intent handlers
    SolarSaysIntent: function (intent, session, response) {
      
        //Select a random joke and store it in the session variables.
        var jokeID = Math.floor(Math.random() * JOKE_LIST.length);

        //The stage variable tracks the phase of the dialogue.
        //session.attributes.setup = JOKE_LIST[jokeID].setup;
        //session.attributes.punchline = JOKE_LIST[jokeID].punchline;

        speechOutput = JOKE_LIST[jokeID].punchline;
        
        // tellWithCard(speechOutput, cardTitle, cardContent)
        response.tellWithCard(speechOutput, "Solar Says", speechOutput);
    },
    HelpIntent: function (intent, session, response) {
        response.ask("You can say hello to me!");
    }

}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SolarSays Skill.
    var skill = new SolarSaysSkill();
    skill.execute(event, context);
};
