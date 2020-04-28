
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || 
window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || 
window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || 
window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

var carddb;
var prevdb;
var cardrequest;
var prerequest;



function PrevSaveDBInit() {
    prerequest = window.indexedDB.open("PreviousReadings",1);

    prerequest.onerror = function(event) {
        console.log("Could not access Previous Readings.");
    };

    prerequest.onsuccess = function(event) {
        prevdb = event.target.result;
    };

    prerequest.onupgradeneeded = function(event) {

        var prevdb = event.target.result;
        //create an object store (table in database)
        var objectStore = prevdb.createObjectStore("previousreadings", { keyPath: "id", autoIncrement:true });
        
        //Add Indexes
        objectStore.createIndex("card", "card");
        objectStore.createIndex("direction", "direction");
        objectStore.createIndex("spread", "spread");
        objectStore.createIndex("cardpos", "cardpos");

        //make sure object store done being created so we can add data to it.
        objectStore.transaction.oncomplete = function(event) {
            // Store values in the newly created objectStore.
            var readingObjectStore = prevdb.transaction("previousreadings", "readwrite").objectStore("previousreadings");
        }
    }
}

function prevSaveAdd(cardName, orientation, spreadType, cardPos) {
    var request = prevdb.transaction("previousreadings", "readwrite").objectStore("employee")
    .add({ card: cardName, direction: orientation, spread: spreadType, position: cardPos });
    
    request.onsuccess = function(event) {
    alert("Previous save added.");
    };
    
    request.onerror = function(event) {
    alert("Unable to add data to Previous Saves.");
    }
}

function prevReadAll() {
    return new Promise( function (resolve, reject) {
        var objectStore = prevdb.transaction("employee").objectStore("employee");
        
        objectStore.openpointer().onsuccess = function(event) {
            //the pointer from the result
            var pointer = event.target.result;
            
            //while the pointer is pointing to something
            if (pointer) {
                resolve(pointer);
            } else {
                console.log("All entries retreived");
            }
        }
    });
}

function CardDBInit(arrayObjectDataAdd) {

    cardrequest = window.indexedDB.open("TarotDeckInfo", 1);

    cardrequest.onerror = function(event) {
        console.log("Could not access Tarot Deck Info.");
    };

    cardrequest.onsuccess = function(event) {
        carddb = event.target.result;
    };

    cardrequest.onupgradeneeded = function(event) {

        var carddb = event.target.result;
        //create an object store (table in database)
        var objectStore = carddb.createObjectStore("tarotcards", { keyPath: "cardname" });
        
        //Add Indexes
        objectStore.createIndex("up", "up");
        objectStore.createIndex("down", "down");

        //make sure object store done being created so we can add data to it.
        objectStore.transaction.oncomplete = function(event) {
            // Store values in the newly created objectStore.
            var cardObjectStore = carddb.transaction("tarotcards", "readwrite").objectStore("tarotcards");

            arrayObjectDataAdd.forEach(function(card) {
                
                cardObjectStore.add(card);
                
            });
        }
    }
}

function cardDBRead(KeyRetreive) {

    return new Promise( function (resolve, reject) {

        var transaction = carddb.transaction("tarotcards");
        var objectStore = transaction.objectStore("tarotcards");
        var request = objectStore.get(KeyRetreive);
    
        request.onerror = function(event) {
            alert("Unable to retrieve data from database!");
        }
    
        request.onsuccess = function(event) {
            // Do something with the request.result!
            if(request.result) {
                resolve(request.result);
            } else {
                alert("Could not find entry in db");
            }
        }
    });
    
}




