Cards = new Meteor.Collection("cards");
// "type": "door", "number": i, "path": "images/base/doors/door_base_" + pad(i, 4) + ".jpg", "where": where,


if (Meteor.isClient) {
  Template.main.board_cards = function () {
    return Cards.find({"where": "board"});
  };

  Template.main.hand_cards = function () {
    return Cards.find({"where": "hand"});
  };

  Template.main.character_cards = function () {
    return Cards.find({"where": "character"});
  };

  Template.main.decks = function () {
    return [
      {
        "name": "Gold",
        "deck": "gold",
        "card_back": {
          "type": "gold",
          "number": -1,
          "path": "images/base/gold_back.jpg",
          "location": "back",
        },
        "top_discard": Cards.findOne({"where": "gold-discard"}),
      },
      {
        "name": "Doors",
        "deck": "door",
        "card_back": {
          "type": "door",
          "number": -1,
          "path": "images/base/door_back.jpg",
          "location": "back",
        },
        "top_discard": Cards.findOne({"where": "door-discard"}),
      },
    ];
  }

  // TODO: switch to using an event map
  dropCard = function(theEvent, where) {
    theEvent.preventDefault();
    var theData = theEvent.dataTransfer.getData("Text");
    console.log("dropped " + theData + " on " + where);

    // TODO: handle failures?
    Cards.update({_id: theData}, {$set: {"where": where}});
    theEvent.preventDefault();
  };

  // TODO: switch to using an event map
  dragCard = function(theEvent) {
    var card_id = theEvent.target.id;
    theEvent.dataTransfer.setData("Text", card_id);
    console.log("dragged " + card_id);
  };
}

if (Meteor.isServer) {
  function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
  }

  Meteor.startup(function () {
    // code to run on server at startup
    Cards.remove({});

    for (var i=1; i <= 95; i++) {
      var where = "deck";
      if (i < 5) {
        where = "hand";
      } else if (i < 10) {
        where = "character";
      } else if (i < 20) {
        where = "board";
      } else if (i < 25) {
        where = "door-discard";
      } else if (i < 30) {
        where = "gold-discard";
      }

      Cards.insert({
        "type": "door",
        "number": i,
        "path": "images/base/doors/door_base_" + pad(i, 4) + ".jpg",
        "where": where,
        "deck-order": 0,
      });
    }
  });
}

// vim: sts=2 sw=2
