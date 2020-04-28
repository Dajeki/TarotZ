const TOTAL_CARDS_DECK = 78;
const PAPRFU_TOTAL = 3; //paprfu
const STAR_TOTAL = 6; //star
const PLANET_TOTAL = 8; //planet

class TarotSpread { 

    constructor (spreadType) {       
        if (typeof(spreadType) == 'string') {
            switch (spreadType)
            {
                case 'paprfu':
                    this.totalCardsInSpread = PAPRFU_TOTAL;
                    break;
                case 'star':
                    this.totalCardsInSpread = STAR_TOTAL;
                    break;
                case 'planet':
                    this.totalCardsInSpread = PLANET_TOTAL;
                    break;
                default:
                    throw Error('Invalid argument: Expected a string of an available Tarot spread. You entered ' + spreadType + ".");
            }
            this.currentCardSelect = [1]; //must make an array for reference passing inside of reset click. This took me forever and now I see why javascript uses objects :(
            this.spreadType = [spreadType];
            this.arrayOfCardObjects = [];
            this.dataobject = {'arrayData': this.arrayOfCardObjects, 'spreadType': this.spreadType};
        }
        else {
            throw Error('Invalid argument: Expected string. You entered ' + typeof(spreadType) + ".");
        }
    }

    setupTarotBoard() {
        let dataobject = this.dataobject;
        //to start at the max and work our way down
        let cardPositions = this.totalCardsInSpread;
        let gridContainer;
        let btnNum = 0;

        
        if(this.spreadType[0] == 'planet'){   
            btnNum = 1;
        }else if (this.spreadType[0] == 'star'){
            btnNum = 2;
        }else {
            btnNum = 3;
        }

        //if we get a selection back aka the return is at least one element. then we can continue to create everything
        //if there is one selected, that means that we have already created this board and not deleted it yet.
        if ($('#grid-container' + btnNum).length) {
            console.log("Already created elements");
            return true;
        }

        $('#Page' + btnNum).append('<div style="z-index:2" id="grid-container' + btnNum + '" data-role="main" class="ui-content hundredper-width-height"></div>');       

        gridContainer = $('#grid-container' + btnNum);
        gridContainer.append(`<div id="HomeButton" class="Mat">
                                <a href="#Menu" data-role="button" class="ui-btn-icon-bottom-right ui-shadow">
                                    <button id="homebtn${btnNum}" class="homebtn ui-btn ui-shadow ui-corner-all">HOME</button>     
                                </a>
                                <button id="savebtn${btnNum}" class="savebtn ui-btn ui-shadow ui-corner-all">SAVE SPREAD</button> 
                                <button id="reset${btnNum}" style='position:absolute; top:0; right:0; padding:2em; width: 20%; height:10%;' class="ui-shadow ui-corner-all ui-btn-icon-left" src='img/reset.png'></button>
                            </div>`);
        
        //make grid appropriate grid for our spread
        gridContainer.addClass( this.spreadType[0] + '-grid-container');
        while (cardPositions > 0) {
            //append the divs for the card positions for the appropriate spread
            gridContainer.append('<div class="Card' + cardPositions + ' border-radius-3"><h1>Card'+ cardPositions-- + '</h1></div>');
        }
        //append the mat
        // gridContainer.append('<div class="Mat hundredper-width-height"></div>');
        gridContainer.append('<div class="MatEnd hundredper-width-height"></div>');
        gridContainer.append('<div id="Deck" data-role"content" class="Deck"></div>');
        
        //get names from txt file

        //this is to check to see if we got the text from teh file already
        console.log("Array of card Objects length " + dataobject.arrayData.length);
        if (this.dataobject.arrayData.length == 0){

            $.get('Cards.txt', dataobject, function(data) {
                console.log("Getting cards");
                var pictureNameArray;
                let deck = $('.Deck');

                //split the text file by \n
                pictureNameArray = data.split(/(\r\n|\r|\n)/g);
                //\n\r is what is in the output newlines of the text file (It is an output from the console because yeah lazy)
                pictureNameArray = removeNewlineFromValues(pictureNameArray);
                
                let randomSelect;           
                let alreadySelected;          
                let TotalSelectionAvailable = 78;
                dataobject['nameArray'] = [];

                for(let i = 0; i < TotalSelectionAvailable; ++i){
                    dataobject['nameArray'].push(pictureNameArray[i]);
                }
                

                //this is so we can get appropriate button number to make
                
                if(dataobject.spreadType == 'planet') {
                    btnNum = 1;
                }
                else if(dataobject.spreadType == 'star') {
                    btnNum = 2;
                }
                else if(dataobject.spreadType == 'paprfu') {
                    btnNum = 3;
                }

                
                
                let reversed = "";
                let countdownIndex = TOTAL_CARDS_DECK
                for(; countdownIndex > 0; --countdownIndex ) {
            
                    randomSelect = Math.floor(Math.random() * countdownIndex);
                    
                    //if upper number reverse of available randoms flip the card
                    if (TotalSelectionAvailable/2 > randomSelect){
                        reversed = "reversedCard";
                    }else {
                        reversed = "";
                    }

                    // <div class="DeckCard border-radius-3">
                    //     </div>
                    // <button data-icon="arrow-r" class="ui-button ui-widget ui-corner-all" style="position:absolute; width:10vh; height:10vh; top:0; right:0;"><button></button>
                    var element = $(`<div class="popup" data-role="popup" data-position-to="window" id="${pictureNameArray[randomSelect]}">   
                                        <img class="popupimage ${reversed}" src="img/${pictureNameArray[randomSelect]}.jpg">
                                        <a href="#" data-rel="back" data-role="button" class="ui-btn-right ui-corner-all">
                                            <button class="exitButton ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-delete"></button>     
                                        </a>
                                    </div>`);
                    var popupOpener = $(`<div class="DeckCard border-radius-3" style="z-index:${countdownIndex};">
                                            <div style="position:absolute; width:100%; height:100%;" class="${reversed}">
                                                <a href="#${pictureNameArray[randomSelect]}" data-rel="popup" data-position-to="window" data-transition="fade">
                                                    <img class="hundredper-width-height CardFront popphoto rotate180" src="img/${pictureNameArray[randomSelect]}.jpg">
                                                </a>
                                            </div>
                                            
                                            <img class="hundredper-width-height CardBack" src="img/CardBack.png" style="z-index:${countdownIndex}">
                                        </div>`);
                    

                    if(dataobject.spreadType[0] == 'planet'){
                        $('#Page1').append(element);
                    }else if (dataobject.spreadType[0] == 'star'){
                        $('#Page2').append(element);
                    }else {
                        $('#Page3').append(element);
                    }

                    deck.append(popupOpener);

                    pictureNameArray = removeValueFromArray(pictureNameArray, pictureNameArray[randomSelect]);
                    
                    element.popup();


                }  
                $.get('CardsInfoUp.txt', dataobject, function(data) {
                    var pictureUp;
                    console.log("Getting cardsInfoUp");    
                    //split the text file by \n
                    pictureUp  = data.split(/(\r\n|\r|\n)/g);
                    //remove newline returns from the split
                    pictureUp = removeNewlineFromValues(pictureUp);
                    // pictureNameArray = removeValueFromArray(pictureNameArray, '\r\n');
                    // pictureNameArray = removeValueFromArray(pictureNameArray, '\n');
                    dataobject['picup'] = pictureUp;

                    $.get('CardsInfoDown.txt', dataobject, function(data) {
                        console.log("Getting cardsInfoDown"); 
                        var pictureDown;
                        pictureDown  = data.split(/(\r\n|\r|\n)/g);
                        //remove newline returns from the split
                        pictureDown = removeNewlineFromValues(pictureDown);
                        dataobject['picdown'] = pictureDown;

                    
                        //call the object creator with out created arrays
                        dataobject['arrayData'] = TarotCardObjectCreator(dataobject['nameArray'], dataobject['picup'], dataobject['picdown'] );
                    }, 'text');     
                }, 'text');    
            }); 
        }
        else {

            let deck = $('.Deck');
            let randomSelect;           
            let alreadySelected;          
            let TotalSelectionAvailable = 78;
            let pictureNameArray = [];

            //create shallow copy of array
            for(let i = 0; i < dataobject.arrayData.length; ++i){
                pictureNameArray.push(dataobject.arrayData[i].cardname);
            }

            //this is so we can get appropriate button number to make
            if(dataobject.spreadType == 'planet') {
                btnNum = 1;
            }
            else if(dataobject.spreadType == 'star') {
                btnNum = 2;
            }
            else if(dataobject.spreadType == 'paprfu') {
                btnNum = 3;
            }
          
            
            let reversed = "";
            let countdownIndex = TOTAL_CARDS_DECK
            for(; countdownIndex > 0; --countdownIndex ) {
        
                let randomSelect = Math.floor(Math.random() * countdownIndex);
                
                //if upper number reverse of available randoms flip the card
                if (TotalSelectionAvailable/2 > randomSelect){
                    reversed = "reversedCard";
                }else {
                    reversed = "";
                }

                
                // <div class="DeckCard border-radius-3">
                //     </div>
                // <button data-icon="arrow-r" class="ui-button ui-widget ui-corner-all" style="position:absolute; width:10vh; height:10vh; top:0; right:0;"><button></button>
                var element = $(`<div class="popup" data-role="popup" data-position-to="window" id="${pictureNameArray[randomSelect]}">   
                                    <img class="popupimage ${reversed}" src="/img/${pictureNameArray[randomSelect]}.jpg">
                                    <a href="#" data-rel="back" data-role="button" class="ui-btn-right ui-corner-all">
                                        <button class="exitButton ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-delete"></button>     
                                    </a>
                                </div>`);
                var popupOpener = $(`<div class="DeckCard border-radius-3" style="z-index:${countdownIndex};">
                                        <div style="position:absolute; width:100%; height:100%;" class="${reversed}">
                                            <a href="#${pictureNameArray[randomSelect]}" data-rel="popup" data-position-to="window" data-transition="fade">
                                                <img class="hundredper-width-height CardFront popphoto rotate180" src="/img/${pictureNameArray[randomSelect]}.jpg">
                                            </a>
                                        </div>
                                        
                                        <img class="hundredper-width-height CardBack" src="/img/CardBack.png" style="z-index:${countdownIndex}">
                                    </div>`);
                

                if(dataobject.spreadType[0] == 'planet'){
                    $('#Page1').append(element);
                }else if (dataobject.spreadType[0] == 'star'){
                    $('#Page2').append(element);
                }else {
                    $('#Page3').append(element);
                }

                deck.append(popupOpener);

                pictureNameArray = removeValueFromArray(pictureNameArray, pictureNameArray[randomSelect]);
                element.popup();
            }
        }
    }
    
    resetCurrentCard(){
        this.totalCardsInSpread = 1;
    }    
    
    setupCardClickHandler() {
        var spreadType = this.spreadType[0];
        var currentCardSelect = this.currentCardSelect;
        var totalCardsInSpread = this.totalCardsInSpread;
        
        var zindexcounter = 2;
        $('.DeckCard').click( function(e) {
            var currentTarget = $(this); //This is in context of who called the click
            console.log(currentTarget);
            console.log(totalCardsInSpread);
            console.log(spreadType);
            console.log(currentCardSelect);
            
            if(currentTarget.data('setCard') == 'set' && currentTarget.data("flippedCard") == 'flipped'){

            }
            else if (currentCardSelect[0] <= totalCardsInSpread && currentTarget.data('setCard') != 'set') {
                //animate the card to the appopriate spot according to the spread type
                currentTarget.addClass('animateTransform ' + spreadType + 'PlaceCard' + currentCardSelect[0]++);
               
                if(currentTarget.css('z-index') != '78'){
                    currentTarget.css("z-index", parseInt(currentTarget.css("z-index")) +  zindexcounter++ );
                    currentTarget.children('img.CardBack').css("z-index", parseInt(currentTarget.css("z-index")) + zindexcounter++ );
                } 

                //Set the setCard data to set so that you can only click the card once to place.
                currentTarget.data("setCard","set");
                
            }
            else if (currentTarget.data('setCard') == 'set' && currentTarget.data("flippedCard") != 'flipped')
            {

                currentTarget.data("flippedCard","flipped");
                currentTarget.children('div').children('a').children('img.CardFront').addClass('animateTransform').removeClass('rotate180');
                currentTarget.children('img.CardBack').addClass('animateTransform').addClass('rotate180');
                
                setTimeout(function() { currentTarget.children('img.CardBack').hide();}, 1000);

                
                let cardName = currentTarget.children('div').children('a').attr('href');
                let hashSplit = cardName.split('#');

                //index 0 is the # and index 1 is the name
                cardDBRead(hashSplit[1]).then(function(DatabaseReturn) {

                    //check to see if it is a reversed meaning by having reversed card class added from earlier before choosing text
                    if (currentTarget.children('div').hasClass('reversedCard')) {
                        $(currentTarget.children('div').children('a').attr('href')).append('<div style="text-align: center; width:100%; color: white; background-color:black;"><h2>' + DatabaseReturn.down + '</h2></div>');
                    }
                    else {
                        $(currentTarget.children('div').children('a').attr('href')).append('<div style="text-align: center; width:100%; color: white; background-color:black;"><h2>' + DatabaseReturn.up + '</h2></div>');
                    }
                });
                  return false;
            }
        });
    }
    
    resetBoardIndexReset = 1
    resetBoard(){

        let cardOnBoard;
        this.currentCardSelect[0] = 1;
        for(let i = 1; i <= this.totalCardsInSpread; i++){
            cardOnBoard = $('.'+ this.spreadType[0] + 'PlaceCard' + i);
            cardOnBoard.removeClass(this.spreadType[0] + 'PlaceCard' + i).data("setCard","").data("flippedCard","").css('z-index', this.resetBoardIndexReset++);//.css("z-index", "")
            cardOnBoard.children('div').children('a').children('img').addClass('rotate180');//.css("z-index", "");
            cardOnBoard.children('img.CardBack').removeClass('rotate180').show();//.css("z-index", "")
                
        }
    }
}
