var fs = require('fs'),
    RandomForestClassifier = require('random-forest-classifier').RandomForestClassifier;
const { serialize } = require('./serialization');
const { training } = require('./training');
const { match_psy } = require('./match');
const { match_disease } = require('./match');

/*var testdata = [{
    1:2,
    2:3,
    3:1,
    4:3,
    5:1,
    6:2,
    7:2,
    8:1
}
];*/

/*1:1,
 2:3,
 3:2,
 4:1,
 5:3,
 6:1,
 7:2,
 8:2*/

const server = {
    getUser: function(answers, user_data){
        var rf = new RandomForestClassifier({
            n_estimators: 10
        });
        /*var my_forest;
         rf.fit(data, null, "p", function(err, trees){
         my_forest = trees;
         });*/
        var my_forest = training(rf);
        testdata = serialize([3,1,2,1,3,2,2,2]);
        //testdata = serialize([1,3,2,1,3,1,2,2]);
        //testdata = serialize([2,3,1,3,1,2,2,1]);
        var pred = rf.predict(testdata, my_forest);
    
        var user_data = [
            { 'fb_id': 'Edward', 'disease' : 'lung cancer', 'psyScore': 'd' },
            { 'fb_id': 'Sharpe', 'disease' : 'lung cancer', 'psyScore': 'g' },
            { 'fb_id': 'And', 'disease' : 'parkinson', 'psyScore': 'g' },
            { 'fb_id': 'The', 'disease' : 'lung cancer', 'psyScore': 'b' },
            { 'fb_id': 'Magnetic', 'disease' : 'parkinson', 'psyScore': 'b' },
            { 'fb_id': 'Zeros', 'disease' : 'parkinson', 'psyScore': 'd' }
        ];
        user_data = match_disease(user_data, 'parkinson ');
        return match_psy(user_data, pred);
    }
};


module.exports = server;

