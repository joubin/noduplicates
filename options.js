
document.addEventListener('DOMContentLoaded', function() {
  $("#urltoignore").keyup(function(event){
    if(event.keyCode == 13){
        $("#addtoignore").click();
    }

});

  document.getElementById("addtoignore").onclick = function(){
    url = document.getElementById("urltoignore").value
    if (url !== "" && isurl(url)) {
      addToIgnore(getDomain(document.getElementById("urltoignore").value));
      document.getElementById("urltoignore").value = "";
      loadtable()

    }
  };

  document.getElementById("addtostrict").onclick = function(){
    url = document.getElementById("urltoignore").value
    if (url !== "" && isurl(url)) {
      addToStrict(getDomain(document.getElementById("urltoignore").value));
      document.getElementById("urltoignore").value = "";
      loadtable()

    }
  };
  loadtable()

});

function addToStrict(value) {
    chrome.storage.sync.get("strictList", function(list){
      mylist = $.map(list["strictList"], function(el) { return el });
      if (mylist.indexOf(value) >= 0) {
        return;
      }
      mylist.push(value)
      chrome.storage.sync.set({"strictList":mylist}, function(){
        loadtable();
      });
    });
}

function addToIgnore(value) {
    chrome.storage.sync.get("ignoreList", function(list){
      mylist = $.map(list["ignoreList"], function(el) { return el });
      if (mylist.indexOf(value) >= 0) {
        return;
      }
      mylist.push(value)
      chrome.storage.sync.set({"ignoreList":mylist}, function(){
        loadtable();
      });
    });
}

function removeFromIgnore(value){
  chrome.storage.sync.get("ignoreList", function(list){
    mylist = $.map(list["ignoreList"], function(el) { return el });

    if(mylist.indexOf(value) > -1 ){
      mylist.splice(mylist.indexOf(value) , 1)
    }
    else{
      return;
    }
    chrome.storage.sync.set({"ignoreList":mylist}, function(){
      loadtable();
    });
  });
}

function removeFromStrict(value){
  chrome.storage.sync.get("strictList", function(list){
    mylist = $.map(list["strictList"], function(el) { return el });

    if(mylist.indexOf(value) > -1 ){
      mylist.splice(mylist.indexOf(value) , 1)
    }
    else{
      return;
    }
    chrome.storage.sync.set({"strictList":mylist}, function(){
      loadtable();
    });
  });
}

function cleartable(){
  var table = document.getElementById("table");
  table.innerHTML = "  <table  id=\"table\" class=\"table\"><thead><tr><th>#</th><th>URL</th><th>Delete</th></tr></thead><tbody></tbody></table>";
}

function loadtable(){

  var table = document.getElementById("table");
  id = 0;
  cleartable();
  chrome.storage.sync.get("ignoreList", function(item){

    array = Array.from(item["ignoreList"])
    array.forEach(function(subitem){
      var row = table.insertRow(1+id++);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = id;
      cell2.innerHTML = subitem;
      cell3.innerHTML = "<button id=\"deleteIgnore"+id+"\" value=\""+subitem+"\" type=\"button\" class=\"btn btn-danger\">Delete</button>";
    })
    getElementsStartsWithId("deleteIgnore").forEach(function(item){
      item.onclick = function(){
        removeFromIgnore(item.value)
      }
    });
  });
  chrome.storage.sync.get("strictList", function(item){

    array = Array.from(item["strictList"])
    array.forEach(function(subitem){
      var row = table.insertRow(1+id++);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = id;
      cell2.innerHTML = subitem;
      cell3.innerHTML = "<button id=\"deleteStrict"+id+"\" value=\""+subitem+"\" type=\"button\" class=\"btn btn-warning\">Delete</button>";
    })
    getElementsStartsWithId("deleteStrict").forEach(function(item){
      item.onclick = function(){
        removeFromStrict(item.value)
      }
    });
  });
}


function getElementsStartsWithId( id ) {
  var children = document.body.getElementsByTagName('*');
  var elements = [], child;
  for (var i = 0, length = children.length; i < length; i++) {
    child = children[i];
    if (child.id.substr(0, id.length) == id)
      elements.push(child);
  }
  return elements;
}
