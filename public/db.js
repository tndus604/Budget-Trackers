let db;
// opening a "budget" database
const request = indexedDB.open("budget", 1);

// generating handlers
request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!" + event.target.errorCode);
};
request.onsuccess = function(event) {
  db = event.target.result;
  if (navigator.onLine) {
      checkDatabase()
  }
};

// Creating or updating the version of the database
request.onupgradeneeded = function(event) { 
    // Save the IDBDatabase interface 
    var db = event.target.result;
  
    // Create an objectStore for this database
    var objectStore = db.createObjectStore("pending", { autoIncrement: true });
};

function saveRecord(data) {
    const transaction = db.transi
}