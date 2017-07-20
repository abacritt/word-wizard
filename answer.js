let answer = function (admin, words) {
    this.db = admin.database();
    this.words = words;
};

answer.prototype.handleRequest = function (app) {
    let user = app.getUser();
    let userId = user.email ? user.email : user.userId;

    let answer = app.getContextArgument('actions_intent_option', 'OPTION').value;
    let response;

    if (answer.startsWith("true")) {
        response = app.buildRichResponse()
            .addSimpleResponse("Well done! Your response is correct!");

        this.db.ref('/users/' + userId + '/correct').once('value', (snapshot) =>  {
            let correct = snapshot.val();

            correct ? correct : 0;
            correct += 1;

            this.db.ref('/users/' + userId + '/correct').set(correct);
        });
    } else {
        let word = answer.split('|')[2];

        response = app.buildRichResponse()
            .addSimpleResponse("Your response is incorrect!")
            .addBasicCard(
            app.buildBasicCard()
                .setTitle(word)
                .setSubtitle(this.words[word].pos)
                .setBodyText(this.words[word].meaning)
            );

        db.ref('/users/' + userId + '/incorrect').once('value', (snapshot) => {
            let incorrect = snapshot.val();

            incorrect ? incorrect : 0;
            incorrect += 1;

            db.ref('/users/' + userId + '/incorrect').set(incorrect);
        });
    }

    response.addSuggestions([
        "Learn a new word",
        "Try another word",
        "Try a random word"
    ]);

    app.ask(response);
};

exports.answer = answer;