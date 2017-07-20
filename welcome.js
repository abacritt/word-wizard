const random = require('random-item');

let welcome = function () { };

const WELCOME_STRINGS = [
    "Hi! Do you want to learn a new word? Or do you want to practice words you learned earlier?",
    "Hello! Do you want to learn a new word? Or do you want to practice words you learned already?"
];

welcome.prototype.handleRequest = function (app) {
    app.ask(
        app.buildRichResponse()
            .addSimpleResponse(random(WELCOME_STRINGS))
            .addSuggestions([
                "Learn a new word",
                "Test learned words"
            ])
    );
};

exports.welcome = welcome;