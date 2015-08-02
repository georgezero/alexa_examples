// Alexa SDK for JavaScript v1.0.00
// Copyright (c) 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved. Use is subject to license terms.

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Multiple slots: has 2 slots (name and score)
 * - Database Interaction: demonstrates how to read and write data to DynamoDB.
 * - NUMBER slot: demonstrates how to handle number slots.
 * - LITERAL slot: demonstrates literal handling for a finite set of known values
 * - Dialog and Session state: Handles two models, both a one-shot ask and tell model, and a multi-turn dialog model.
 *   If the user provides an incorrect slot in a one-shot model, it will direct to the dialog model. See the
 *   examples section for sample interactions of these models.
 *
 * Examples:
 * Dialog model:
 *  User: "Alexa, tell score keeper to reset."
 *  Alexa: "New game started without players. Who do you want to add first?"
 *  User: "Add the player Bob"
 *  Alexa: "Bob has joined your game"
 *  User: "Add player Jeff"
 *  Alexa: "Jeff has joined your game"
 *
 *  (skill saves the new game and ends)
 *
 *  User: "Alexa, tell score keeper to give Bob three points."
 *  Alexa: "Updating your score, three points for Bob"
 *
 *  (skill saves the latest score and ends)
 *
 * One-shot model:
 *  User: "Alexa, what's the current score?"
 *  Alexa: "Jeff has zero points and Bob has three"
 */
'use strict';
var ScoreKeeper = require('./scoreKeeper');

exports.handler = function (event, context) {
    var scoreKeeper = new ScoreKeeper();
    scoreKeeper.execute(event, context);
};