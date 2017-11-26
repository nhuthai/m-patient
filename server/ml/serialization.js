function serialize(arr){
    var text = '{';
    for (i = 0; i < arr.length; i ++){
        if(i == 0){
            text += '"q' + (i+1) + '" : ' + arr[i].toString();
        }
        else{
            text += ',"q' + (i+1) + '" : ' + arr[i].toString();
        }
    }
    text += '}';
    json_obj = JSON.parse(text);
    return [json_obj];
}

module.exports = { serialize };