let score = function (admin) {
    this.db = admin.database();
};

score.prototype.handleRequest = function (app) {
    let user = app.getUser();
    let userId = user.email ? user.email : user.userId;

    this.db.ref('/users/' + userId).once('value', (snapshot) => {
        let userData = snapshot.val();

        let learnedCount = userData.learned_words ? userData.learned_words.length : 0;
        let correct = userData.correct ? parseInt(userData.correct) : 0;
        let incorrect = userData.incorrect ? parseInt(userData.incorrect) : 0;

        let response = app.buildRichResponse();

        response.addSimpleResponse("You have learned " + learnedCount + " words so far.");

        let successString = "You have taken " + (correct + incorrect) + " tests. You have got " + correct + " correct.";
        
        if((correct + incorrect) > 0) {
            successString += " Your success rate is " + (100 * (correct / (correct + incorrect))).toFixed(2) + "%";
        }

        response.addSimpleResponse(successString);

        response.addSuggestions([
            "Learn a new word",
            "Test learned words"
        ]);

        app.ask(response);
    });
};

exports.score = score;