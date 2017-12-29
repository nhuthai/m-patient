var PATTERN = '';
var THRESHOLD = 'b';

function getBestMatch(arr) {
    Math.seed = 6;
    Math.seededRandom = function(max, min) {
        max = max || 1;
        min = min || 0;

        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280.0;

        return min + rnd * (max - min);
    }

    return arr[Math.floor(Math.random() * arr.length)];
}

function refineString(str) {
    return str.trim().toLocaleLowerCase();
}

function checkPsy(user) {
    return user['psyScore'] > THRESHOLD;
}

function checkDisease(user) {
    return refineString(user['disease']) == refineString(PATTERN);
}

function matchPsy(arr, psyScore) {
    if (psyScore !== undefined) {
        THRESHOLD = psyScore;
    }

    var filtered_arr = arr.filter(checkPsy);

    if (filtered_arr.length > 0) {
        arr = filtered_arr;
    }

    return arr;
}

function matchDisease(arr, disease) {
    if (disease !== undefined) {
        PATTERN = disease;
    }

    var filtered_arr = arr.filter(checkDisease);

    if (filtered_arr.length > 0) {
        arr = filtered_arr;
    }

    return arr;
}

module.exports = {matchPsy, matchDisease};