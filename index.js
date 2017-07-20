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
const TELL_MEANING = "meaning";
const TELL_SCORE = "score";
const FALLBACK = "input.unknown";

let welcome = new (require('./welcome').welcome)();
let learn = new (require('./learn').learn)(admin, words);
let practice = new (require('./practice').practice)(admin, words);
let answer = new (require('./answer').answer)(admin, words);
let meaning = new (require('./meaning').meaning)(admin, words);
let score = new (require('./score').score)(admin);

exports.apiAiWebhook = functions.https.onRequest((request, response) => {
    const app = new App({ request, response });
    
    let actionMap = new Map();
    
    actionMap.set(WELCOME, welcome.handleRequest.bind(welcome));
    actionMap.set(ACTION_LEARN, learn.handleRequest.bind(learn));
    actionMap.set(ACTION_PRACTICE, practice.handleRequest.bind(practice));
    actionMap.set(ACTION_PRACTICE_RANDOM, practice.handleRequest.bind(practice));
    actionMap.set(HANDLE_ANSWER, answer.handleRequest.bind(answer));
    actionMap.set(TELL_MEANING, meaning.handleRequest.bind(meaning));
    actionMap.set(FALLBACK, meaning.handleRequest.bind(meaning));
    actionMap.set(TELL_SCORE, score.handleRequest.bind(score));

    app.handleRequest(actionMap);
});
