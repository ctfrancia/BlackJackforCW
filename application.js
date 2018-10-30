$(document).ready(function (){
    
let cards = [];
let playerHand = [];
let dealerHand = [];
let cardCount = 0;
let endOfTurn = false;
    
var suits = ["clubs", "dia", "hearts", "spades"];
var num = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

var output = document.getElementById("output");
var playerSide = document.getElementById("playerSide");
var dealerSide = document.getElementById("dealerSide");
var pValue = document.getElementById("pValue");
var dValue = document.getElementById("dValue");

var randomNumber = Math.floor((Math.random() * 52) + 1);
//We are creating out deck below
//for/in loops through the properties of an object if you do a console.log(suits[s]) then it will show the suits (clubs,dia,hea,spades).
   for (s in suits){
       //we first go through and check what's the first letter of each word in the array and assaigning it to a variable. making sure to uppercase it for consistancy.
       var suit = suits[s][0].toUpperCase();
       //next we are using the ternary operator to decide what background to give it based on the first letter of that array. If it's an "S" or "C"(Spades or Clubs) then the background color will have the value "black" if true, "red" if false.
       var bgcolor = (suit == "S" || suit == "C") ? "black": "red"; 
      for(n in num){
    //we have to use parseInt because "n" will be a string value and we want numerical
    //we have to +1 because it's a 0 based counting.
        var cardValue = (n>9) ? 10: parseInt(n) + 1 ;
        //with this loop we are going to make an object that will represent our deck of cards
          var deck = {
              suit: suit, //comes from the variable above
              icon: suits[s], //comes from the first letter of each word
              bgcolor: bgcolor, //based on  the ternary operator above
              cardnum: num[n], //the second inner loop
              cardvalue: cardValue //the ternary operator
          }
          //this makes sure that we are creating the 52 values
          cards.push(deck);
      }
    }
   // console.log(cards);
    
    $('#btnstart').click(function(){
        shuffleDeck(cards);
        dealNewCards();
        $('#pValue').text('0');
        $('#dValue').text('0');
                  
    })
    
    function dealNewCards(){
        // whenever we deal out new cards we want to start everything new
        playerHand = [];
        dealerHand = [];
        //here jQuery is easier than JavaScript
        $('#dealerSide').text('');
        $('#playerSide').text('');
        //we are pushing the values into the array
        for(var x = 0; x< 2; x++){
            dealerHand.push(cards[cardCount]);
            //I wanted to use jQuery but didn't know how to += with it.but didn't know about the second argument that we are passing to the function
            //We added the additional arg of x because when we are loop through with x those are the number of cards that we are dealing.
            dealerSide.innerHTML +=cardOutput(cardCount, x); //Every card value has a value. 
//the if statement is only passing to the dealerSide "x" is the cards the two people get
            if (x==0){
                dealerSide.innerHTML += '<div id ="cardCover" style="left:100px;"></div>';
            }
            cardCount++ 
            playerHand.push(cards[cardCount]);
            playerSide.innerHTML +=cardOutput(cardCount, x);
            cardCount++
        }
        $('pValue').text(checkTotal(playerHand));
        //pValue.innerHTML = checkTotal(playerHand);
        console.log(dealerHand);
        console.log(playerHand);
    }
    
    function cardOutput(n,x){
        //this is returning the format for the cards that will get returned above
        /* cards[n].icon is the array that is holding all the cards
           and icon because we want to fetch the icon that is being stored
           x as the second argument and the variable hpos (horizontal position) is what is allowing us to move the cards on the x-axis. using the ternary operator in the variable we are telling it that if it is the first card (0>0) is false) then only 100px to the left, then the second card will be added 60px MORE ot the left*/
        var hpos = (x > 0) ? x * 60 + 100 : 100;
        return '<div class="icard ' + cards[n].icon + '" style="left:' + hpos + 'px;">  <div class="top-card suit">' + cards[n].cardnum + '<br></div>  <div class="middle-card suit"></div>  <div class="bottom-card suit">' + cards[n].cardnum +'<br></div> </div>';
    }
    
    function shuffleDeck(array){
    //the for loop is cycling starting from the last to the beginning
        
        for( var i = array.length -1; i > 0; i-- ){
            var j = Math.floor(Math.random() * (i +1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    }
    
    $('#hit').click(function(){
        //add new card to players hand.
        playerHand.push(cards[cardCount]);
        playerSide.innerHTML +=cardOutput(cardCount, (playerHand.length -1));
        cardCount++;
        var rValue = checkTotal(playerHand);
        pValue.innerHTML = rValue;
        if(rValue > 21){
            alert("Busted! Press Start if you want to play again!");
        }
    })
    
    function checkTotal(arg){
        var rValue = 0;
        var aceAdjust = false;
        //because Ace can be 1 or 11 if it's true then we are adding 10 since it already has a value of 1.
        for (var i in arg){
            if(arg[i].cardnum == 'A' && !aceAdjust){
                aceAdjust = true;
                rValue = rValue + 10;
            }
            rValue += arg[i].cardvalue
        }
        //here we are saying if there is an ace and our hand is larger than 21 then we will deduct the 10 points.
        if (aceAdjust && rValue >21){
            rValue = rValue -10;
        }
        return rValue;
    }
    
    $('#stay').click(function(){
        //where the dealer will play out.
        var dealerValue= checkTotal(dealerHand)
        endOfTurn = true;
        document.getElementById('cardCover').style.display = 'none';
        dValue.innerHTML = dealerValue;
        
        //now it's the dealers turn
        while( dealerValue < 17){
        dealerHand.push(cards[cardCount]);
        dealerSide.innerHTML +=cardOutput(cardCount, (dealerHand.length -1));
        cardCount++;
        dealerValue = checkTotal(dealerHand);
        dValue.innerHTML = dealerValue;
        }
        
        //Who won?
        var playerValue = checkTotal(playerHand);
        var dealerValue = checkTotal(dealerHand);
        if ( playerValue < 22 && playerValue > dealerValue || dealerValue > 21 && playerValue < 22){
            alert("You won! Press Start to play another round");
            
        } else if (playerValue > 21){
            alert("Dealer won! Better luck next time, Press Start to play again!");
            
        } else {
            alert("Push! Press Start to play again!");
        }
        
    })
          
})
