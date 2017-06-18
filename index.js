const functions = require('firebase-functions');
const App = require('actions-on-google').ApiAiApp;

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const words = require('./words.json');

const WELCOME = "input.welcome";
const ACTION_LEARN = 'learn';
const ACTION_PRACTICE = "practice";
const ACTION_PRACTICE_RANDOM = "practice.random";
const HANDLE_ANSWER = "answer.selected";

let welcome = new (require('./welcome').welcome)();
let learn = new (require('./learn').learn)(admin, words);
let practice = new (require('./practice').practice)(admin, words);
let answer = new (require('./answer').answer)(admin, words);

exports.apiAiWebhook = functions.https.onRequest((request, response) => {
    const app = new App({ request, response });
    
    let actionMap = new Map();
    
    actionMap.set(WELCOME, welcome.handleRequest());
    actionMap.set(ACTION_LEARN, learn.handleRequest());
    actionMap.set(ACTION_PRACTICE, practice.handleRequest());
    actionMap.set(ACTION_PRACTICE_RANDOM, practice.handleRequest());
    actionMap.set(HANDLE_ANSWER, answer.handleRequest());

    app.handleRequest(actionMap);
});
