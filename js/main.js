
let imgURLs = ["img/Page7.png", "img/CowsVoiceUnanswered.png", "img/CowsVoiceanswered.png", "img/Page5.png", 
                "img/DucksVoiceUnanswered.png", "img/DucksVoiceanswered.png", "img/Page3.png", 
                "img/ChickensVoiceUnanswered.png", "img/ChickensVoiceanswered.png", "img/Page1.png", 
                "img/FrontCover.png", "img/Chick.png", "img/Duck.png", "img/Cow.png", "img/background.svg"];

let audioURLs = [];


function preloadMedia( Media, typeData ){
    for (let data = 0; data < Media.length; ++data)
    {
        if (typeData.toLowerCase() == 'audio')
        {
                console.log("Loading audio at: " + Media[data]);
                new Audio(Media[data]);           
        }
        else if (typeData.toLowerCase() == 'img')
        {          
                console.log("Loading image at: " + Media[data]);
                (new Image()).url = Media[data];        
        }
    }
}

preloadMedia( audioURLs, 'audio' );
preloadMedia( imgURLs , 'img' );

function removeValueFromArray(oldArray, value) {
    return oldArray.filter(function(ele){ return ele != value; });
}

function removeNewlineFromValues(oldArray) {
    return oldArray.filter(function(ele){ return ele.replace(/(\r\n|\r|\n)/g, ""); });
}

function arrayToObject(arrayToConvert) {
    let newObject = {};
    for( let i = 0; i < arrayToConvert.length; ++i) {
        newObject[i] = arrayToConvert[i];
    }
    return newObject;
}

function TarotCardObjectCreator(valueCardNames, TarotCardUp, TarotCardDown ) {
    let newObject = {};
    let objectArray = [];
    for( let i = 0; i < valueCardNames.length; ++i) {
        newObject['cardname'] = valueCardNames[i];
        newObject['up'] = TarotCardUp[i];
        newObject['down'] = TarotCardDown[i];
        objectArray.push(Object.assign({}, newObject));
    } 
    console.log(objectArray);
    return objectArray;
    
}

/**
 * @param {number} number number on id of the grid container to remove the html from
 */
function clearScreen(number){
    $('#Page' + number).html("");
}

/**
 * @param {string} spread1 String of the spread type for the screen we are deleting
 */
function clearOtherScreens(screenKeep) {
    if (screenKeep == 'planet')
    {
        clearScreen(2);
        clearScreen(3);
    }
    if (screenKeep == 'star')
    {
        clearScreen(1);
        clearScreen(3);
    }
    if (screenKeep == 'paprfu')
    {
        clearScreen(2);
        clearScreen(1);
    }
}

/**
 * 
 * @param {TarotSpread} screenCreate screen we need to create
 */
function CreateScreen(screenCreate) 
{
    screenCreate.setupTarotBoard();
    clearOtherScreens(screenCreate.spreadType);
}