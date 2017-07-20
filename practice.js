var keys = Object.keys || require('object-keys');
const random = require('random-item');
const shuffle = require('shuffle-array');

const OPTION_COUNT = 4;
const MIN_LEARN_COUNT = 8;

const noLearnedWords = [
    "I can only test you once you have learned some words from me. Do you want to learn a new word? Or do you want to try with random words?",
    "Though you already know many words, you have not learned any word from me. You can either learn a new word, or you can practice with random words."
];

let practice = function(admin, words) {
    this.db = admin.database();
    this.words = words;
}

practice.prototype.handleRequest = function(app) {
    let user = app.getUser();
    let userId = user.email ? user.email : user.userId;

    this.db.ref('/users/' + userId + '/learned_words').once('value', (snapshot) => {
        let learnedWords = snapshot.val();

        if (app.getIntent() === "practice.random") {
            learnedWords = keys(this.words);
        }

        if (!learnedWords || learnedWords.length < MIN_LEARN_COUNT) {
            app.ask(
                app.buildRichResponse()
                    .addSimpleResponse(random(noLearnedWords))
                    .addSuggestions([
                        "Learn a new word",
                        "Test with random words"
                    ])
            );
        } else {
            let wordToAsk = random(learnedWords);

            app.askWithList(
                "What is the meaning of " + wordToAsk + "?",
                app.buildList(wordToAsk)
                    .addItems(this._buildOptionsArray(app, wordToAsk))
            );
        }
    });
};

practice.prototype._buildOptionsArray = function (app, wordToAsk) {
    let selectedWrods = [ wordToAsk ];
    let allWords = keys(this.words);

    for (var index = 0; index < allWords.length && selectedWrods.length < OPTION_COUNT; index++) {
        var word = random(allWords);
        
        if (!selectedWrods.includes(word)) {
            selectedWrods.push(word);
        }
    }

    let options = [];

    for (var index = 0; index < OPTION_COUNT; index++) {
        if (selectedWrods[index] === wordToAsk) {
            options.push(app.buildOptionItem(
                "true|" + [selectedWrods[index]] + "|" + wordToAsk,
                [selectedWrods[index]])
                .setDescription(this.words[selectedWrods[index]].meaning)
            );
        } else {
            options.push(app.buildOptionItem(
                "false|" + [selectedWrods[index]] + "|" + wordToAsk,
                [selectedWrods[index]])
                .setDescription(this.words[selectedWrods[index]].meaning)
            );
        }
    }

    options = shuffle(options);

    for (var index = 0; index < options.length; index++) {
        var element = options[index];
        element.setTitle("Option " + (index + 1));
    }

    return options;
};

exports.practice = practice;