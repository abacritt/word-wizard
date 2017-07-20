const random = require('random-item');

const unknownResponses = [
    "Sorry, I cannot talk about that. I can only tell you a new word or help you practice your already learned words.",
    "I did not understand that. Let me know if you want to learn a new word or you want to practice a learned word.",
    "Sorry, I can only talk about words. Tell me if you want to learn a new word, or you want to test the words you learned already."
];

let meaning = function (admin, words) {
    this.db = admin.database();
    this.words = words;
};

meaning.prototype.handleRequest = function (app) {
    let word = app.getArgument("word");

    if (!word) {
        let rawInput = app.getRawInput();

        if (rawInput.indexOf(' ') == -1) {
            word = rawInput;
        }
    }

    let response;
    
    if (word) {
        if (this.words[word]) {
            response = app.buildRichResponse()
                .addSimpleResponse("Here's the meaning of " + word)
                .addBasicCard(
                app.buildBasicCard()
                    .setTitle(word)
                    .setSubtitle(this.words[word].pos)
                    .setBodyText(this.words[word].meaning)
                )
                .addSimpleResponse("What's next?");
        } else {
            response = app.buildRichResponse()
                .addSimpleResponse("Sorry! The word " + word + " is not present in our database");
        }
    } else {
        response = app.buildRichResponse()
            .addSimpleResponse(random(unknownResponses));
    }
    
    response.addSuggestions([
        "Learn a new word",
        "Test learned words"
    ]);
    
    app.ask(response);
};

exports.meaning = meaning;