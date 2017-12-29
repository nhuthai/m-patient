function getBestMatch(arr){
    Math.seed = 6;
    Math.seededRandom = function(max, min) {
        max = max || 1;
        min = min || 0;

        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280.0;

        return min + rnd * (max - min);
    }

    return arr[Math.floor(Math.random()*arr.length)];
}

var threshold = 'b';

function checkPsy(user) {
    //g>d>b
    return user['psyScore'] > threshold;
}

var pattern = '';

function checkDisease(user){
    return user['disease'].trim().toLowerCase() == pattern.trim().toLowerCase();
}

function matchPsy(arr, psyScore){
    threshold = psyScore;
    var filtered_arr = arr.filter(checkPsy);
    if (filtered_arr.length > 0){
        arr = filtered_arr;
    }
    return arr;
}

function matchDisease(arr, disease){
    console.log('arr', arr);
    pattern = disease;
    var filtered_arr = arr.filter(checkDisease);
    if (filtered_arr.length > 0){
        arr = filtered_arr;
    }
    return arr;
}

module.exports = {matchPsy, matchDisease};