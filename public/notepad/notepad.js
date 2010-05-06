document.observe("dom:loaded", function() {
  $('status').innerHTML = window.navigator.onLine ? 'Online' : 'Offline';
  $('status').className = $('status').innerHTML;

  $("loading").style.visibility = "hidden";

  // no iPhone
  if(navigator.appVersion.indexOf('iPhone OS ') < 0 && !running_on_localhost())
  {
    $("noiphone").style.visibility = "visible";
  }
  else if(!window.navigator.standalone && !running_on_localhost())
  {
    $("notinstalled").style.visibility = "visible";
  }
  // has navigation?
  else if(!(typeof navigator.geolocation != "undefined") && !running_on_localhost())
  {
    $("nonavigation").style.visibility = "visible";
  }
  else
  {
    // we're on a phone, and installed standalone
    // "real" app init code goes here
    $("navigation").style.visibility = "visible";
    $("main").style.visibility = "visible";

    navigator.geolocation.watchPosition(positionWatcher);

    updateNoteList();
  }
});

function running_on_localhost()
{
  return document.location.href.indexOf('localhost');
}

function positionWatcher(location)
{
  $("longitude").textContent = location.coords.longitude;
  $("latitude").textContent = location.coords.latitude;
}


function nullDataHandler(transaction, results) { }

function errorHandler(transaction, error)
{
    // error.message is a human-readable string.
    // error.code is a numeric error code
    console.log('Oops.  Error was \''+error.message+'\' (Code '+error.code+')');
 
    // Handle errors here
    // var we_think_this_error_is_fatal = true;
    // if (we_think_this_error_is_fatal) return true;
    return true;
}

var database = function() {
  shortName = 'notedb';
  version = '0.3';
  displayName = 'Notepad Database';
  maxSize = 65536; // in bytes
  db = openDatabase(shortName, version, displayName, maxSize);

  // Create the db if it doesn't exist
  db.transaction(function(transaction) {
    // This will fail if the table already exists
    transaction.executeSql('CREATE TABLE notes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, note TEXT NOT NULL, lat TEXT NOT NULL, lon TEXT NOT NULL);', [], nullDataHandler, errorHandler);

    // These will be skipped if it already exists
    transaction.executeSql('INSERT INTO notes (note, lat, lon) VALUES ("This is an example note", ?, ?);', [$("latitude").textContent, $("longitude").textContent], nullDataHandler, errorHandler);
  });

  return db;
};

var saveNote = function() {
  console.log("Saving note");
  note = $('note').value;

  if( !note.strip().empty() ) {
    database().transaction(function(transaction){
      console.log("Trying to insert note");
      transaction.executeSql('INSERT INTO notes (note, lat, lon) VALUES (?, ?, ?)', [note.strip(), $("latitude").textContent, $("longitude").textContent], nullDataHandler, errorHandler);
      console.log("Inserted note.");

      setTimeout(updateNoteList, 500);
      $('note').value = '';
      console.log("Done saving note.");
    });
  }
  else {
    console.log("Note is empty!");
  }
};

var updateNoteList = function() {
  console.log("Updating note list");
  database().transaction(function(transaction) {
    console.log("Reading note list");
    transaction.executeSql("SELECT * FROM notes;", [], function(transaction, results) {
      console.log("Updating notes")
      list = $('list');
      // Clear out items
      list.innerHTML = '';

      for (var i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);

        li = document.createElement('li');
        li.innerHTML = "" + row['note'] + " (" + row['lat'] + ", " + row['lon'] + ")";
        list.appendChild(li);
      }
      console.log("Done updating notes list.")
    }, errorHandler);
  });
};
