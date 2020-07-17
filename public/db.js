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

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectstor("pending");
  store.add(record);
}

function checkDatabase() {
  // open a transaction on your pending db
  const transaction = db.transaction(["pending"], "readwrite");
  // access your pending object store
  const store = transaction.objectStore("pending");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          const transaction = db.transaction(["pending"], "readwrite");

          // access your pending object store
          const store = transaction.objectStore("pending");

          // clear all items in your store
          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);