 //// Initialize Firebase ////
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyDQvjBBtYKvO-bBw09ORvk5xS0r18sfSCg",
        authDomain: "rockpaperscissors-ff755.firebaseapp.com",
        databaseURL: "https://rockpaperscissors-ff755.firebaseio.com",
        storageBucket: "rockpaperscissors-ff755.appspot.com",
        messagingSenderId: "495506074507"
      };
      firebase.initializeApp(config);
      var database = firebase.database();
      ///////////////////////////////

      //// game vars ////
      // var options = ["r", "p", "s"];
      var userWin = 0;
      var userLoss = 0;
      var userTie = 0;

      var players;
      var player1Guess;
      var player2Guess;
      var player1;
      var player2;
      var nameSubmit = true;
      var turn;
      ///////////////////////////////

      //// firebase vars ////
      var name = "";
      var count = 0;
      var currentPlayer;
      var connectedPlayers;
      var currentPlayer1;
      var playerWins;
      var con;
      var uniqueKey;
      var uniquePlayer;
      var uniquePlayer1;
      var uniquePlayer2;
      ///////////////////////////////

      var playerName;
      //// game ////
      function gamePlayFunc (s1, s2) {
        console.log("game on!!!!!!");
        if (s1 === "rock" && s2 === "scisors") {
          console.log("User Wins!");
          //return s1;
          database.ref("players/player1/name").on("value", function(snapshot) {
            playerName = snapshot.val(); 
          }, function(errorObject) {console.log("Errors handled: " + errorObject.code);});
          return playerName;
          userWin++;
        } else if (s1 === "paper" && s2 === "rock") {
            console.log("User Wins!");
            database.ref("players/player1/name").on("value", function(snapshot) {
            playerName = snapshot.val(); 
          }, function(errorObject) {console.log("Errors handled: " + errorObject.code);});
          return playerName;
            userWin++;
        } else if (s1 === "scisors" && s2 === "paper") {
            console.log("User Wins!");
            database.ref("players/player1/name").on("value", function(snapshot) {
            playerName = snapshot.val(); 
          }, function(errorObject) {console.log("Errors handled: " + errorObject.code);});
          return playerName;
            userWin++;
        } else if (s1 === s2) {
            console.log("Tie");
            return "no winner";
            userTie++;
        } else {
            console.log("Robot wins");
            database.ref("players/player2/name").on("value", function(snapshot) {
            playerName = snapshot.val(); 
          }, function(errorObject) {console.log("Errors handled: " + errorObject.code);});
          return playerName;
            userLoss++;
        }
      }
      ///////////////////////////////

      //// phase II html ////
      function connectedPlayersFunc (playe, num) {
      $("#name" + num).html(playe.name);
      $("#options" + num).html();
      $("#wins" + num).html("wins: " + playe.wins);
      $("#losses" + num).html("Losses: " + playe.losses);
      }

      //// options list ////
      function optionsFunc (num) {
        var rock = $("<div class='optionsEl' selection='rock'>rock</div>");
        var paper = $("<div class='optionsEl' selection='paper'>paper</div>");
        var scisors = $("<div class='optionsEl' selection='scisors'>scisors</div>");

        var option = $("#options" + num);
        option.html("");
        option.append(rock);
        option.append(paper);
        option.append(scisors);
      }

      //// selected option options ////
      function optionSelectedFunc (select, num) {
        var selected = $("<div class='selectionEl'>" + select + "</div>");
        var option = $("#options" + num);
        option.html("");
        option.append(selected);
      }
      ///////////////////////////////

      //// result window ////
      function resultFunc (result) {
        var resulted = $("<div>" + result + "</div>");
        var option = $("#resultEl");
        option.html("");
        option.append(resulted);
      }
      ///////////////////////////////

      ///////////////////////////////



      //// connections ////
      var connectionsRef = database.ref("/connections");
      var connectedRef = database.ref(".info/connected");
      connectedRef.on("value", function(snap) {
        if (snap.val()) {
          var con = connectionsRef.push(true);
          con.onDisconnect().remove();
        }
      });
      connectionsRef.on("value", function(snap) {
        connectedPlayers = snap.numChildren();
      });
      ///////////////////////////////

      //// phase I initial ////
      $("#playerBtn").on("click", function() {
        if (nameSubmit) {
          nameInput = $("#name-input").val().trim();

          if (connectedPlayers === 1) {
            database.ref("/players/player1/").set({
              name: nameInput,
              wins: 0,
              losses: 0
            });
            currentPlayer = "player1";
            currentPlayer1 = 1;
          } else if (connectedPlayers === 2) {
            uniquePlayer2 = database.ref("/players/player2").set({
              name: nameInput,
              wins: 0,
              losses: 0
            });
            currentPlayer = "player2";
          }
          database.ref("/players/" + currentPlayer + "/").onDisconnect().remove();

          //connectedPlayersFunc(playerName, nameInput);
        }
        nameSubmit = false;
      });
      ///////////////////////////////

      //// phase I get database data only goes to current browser ////
      database.ref("players").on("child_added", function(childSnapshot) {

        // will appear in both browsers
        database.ref("players/player1").on("value", function(snapshot) {
          var number = 1;
          var playerVals = snapshot.val();
          connectedPlayersFunc(playerVals, number); 
        }, function(errorObject) {
          console.log("Errors handled: " + errorObject.code);
        });

        if (connectedPlayers === 2) {
          turn = 1;
          database.ref("/turns").set({turn: turn}); //replaces existing database data

          if (currentPlayer1 === 1) {
            optionsFunc(1);
            
          }

          database.ref("players/player2").on("value", function(snapshot) {
            var number = 2;
              var playerVals = snapshot.val();
              connectedPlayersFunc(playerVals, number); 
            }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
          });

         }

      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
      database.ref("/turns/").onDisconnect().remove()
      ///////////////////////////////

      //// optionSelection player1 ////
      $("#options1").on("click", ".optionsEl", function() {
        var clickedValue = $(this).attr("selection");
        optionSelectedFunc(clickedValue, 1);

        // save selection to server
        database.ref().child('players').child('player1').child('selection').set(clickedValue);

        turn = 2;
        database.ref("/turns").set({turn: turn});
      });
      ///////////////////////////////

      //// optionSelection player2 ////
      $("#options2").on("click", ".optionsEl", function() {
        var clickedValue = $(this).attr("selection");
        optionSelectedFunc(clickedValue, 2);

        // save selection to server
        database.ref().child('players').child('player2').child('selection').set(clickedValue);
      });
      ///////////////////////////////

      //// when turn is updated ////
      database.ref("turns").on("child_changed", function(childSnapshot) {
        //want to get values for turn 2 player 2
        var turnFire = childSnapshot.val();
        console.log("childSnapshot " + childSnapshot.val());
        console.log("turnFire " + turnFire);

        //alert("im working child changed");
        if (turnFire === 2 && currentPlayer1 !== 1) {
          optionsFunc(turnFire);
        } else if (turnFire === 1 && currentPlayer1 ===1 ){
          optionsFunc(turnFire);
        }

      });
      ///////////////////////////////

      //// when player2 option is updated ////
      database.ref('players/player2/selection').on("value", function(snapshot) {
        // check who won
        if ( snapshot.val().selection !== null ) {
  
          var selection1
          database.ref().child('players').child('player1').child('selection').on("value", function(snapshot) {
            selection1 = snapshot.val();
          });
          console.log("selection1 " + selection1);
          var selection2
          database.ref().child('players').child('player2').child('selection').on("value", function(snapshot) {
            selection2 = snapshot.val();
          });
          console.log("selection2 " + selection2);
          var resultGame = gamePlayFunc(selection1, selection2);
          console.log("yooooooooo " + gamePlayFunc(selection1, selection2))
          // print selection on both screens along with winner
          optionSelectedFunc(selection1, 1);
          optionSelectedFunc(selection2, 2);
          resultFunc(resultGame);

          // pause for 10 seconds
          // set turn
          //turn = 1;
          //database.ref("/turns").set({turn: turn});
          turn = 1;
          function populateFireFunc () {
            database.ref("/turns").set({turn: turn});
          }
          setTimeout(populateFireFunc, 10000);
        }
           
        }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
      ///////////////////////////////

      //// chat submission ////
      $("#talkBtn").on("click", function() {
        console.log("im working");

        var talk = $("#talk-input").val().trim(); // value passed into text area
        //document.getElementById("comment-input").value += talk;
        var obj = document.getElementById("comment-input");
        var txt = document.createTextNode(talk + "\n" );
        obj.appendChild(txt);
      });
      ///////////////////////////////
