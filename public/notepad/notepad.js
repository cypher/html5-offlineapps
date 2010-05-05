document.observe("dom:loaded", function() {
  $('status').innerHTML = window.navigator.onLine ? 'Online' : 'Offline';
  updateNoteList();
});

function nullDataHandler(transaction, results) { }

function errorHandler(transaction, error)
{
    // error.message is a human-readable string.
    // error.code is a numeric error code
    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
 
    // Handle errors here
    // var we_think_this_error_is_fatal = true;
    // if (we_think_this_error_is_fatal) return true;
    return true;
}

var database = function() {
  shortName = 'notesdb';
  version = '0.1';
  displayName = 'Notepad Database';
  maxSize = 65536; // in bytes
  db = openDatabase(shortName, version, displayName, maxSize);

  // Create the db if it doesn't exist
  db.transaction(function(transaction) {
    // This will fail if the table already exists
    transaction.executeSql('CREATE TABLE notes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, note TEXT NOT NULL);', [], nullDataHandler, errorHandler);
    // These will be skipped if it already exists
    transaction.executeSql('INSERT INTO notes (note) VALUES ("This is an example note");', [], nullDataHandler, errorHandler);
  });

  return db;
};

var saveNote = function() {
  note = $('note').value;

  if( !note.strip().empty() ) {
    database().transaction(function(transaction){
      transaction.executeSql('INSERT INTO notes (note) VALUES (?)', [note.strip()]);
    });

    updateNoteList();
  }
};

var updateNoteList = function() {
  database().transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM notes;", [], function(transaction, results) {
      list = $('list');
      // Clear out items
      list.innerHTML = '';

      for (var i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);

        li = document.createElement('li');
        li.innerHTML = row['note'];
        list.appendChild(li);
      }
    }, errorHandler);
  });
};
