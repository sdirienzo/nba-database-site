var url = "http://localhost:3742/accolades";
document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rows] of response.rows.entries()) {
    let id = rows["id"];
    let tr = document.createElement("tr");
    document.getElementsByTagName("tbody")[0].appendChild(tr);
    for (let prop in rows) {
      if (rows.hasOwnProperty(prop)) {
        if (prop !== "id") {
          let td = document.createElement("td");
          let input = document.createElement("input");
          input.type = "text";
          if (rows[prop] == null) {
            input.value = "None";
          }
          else {
            input.value = `${rows[prop]}`;
          }
          input.readOnly = true;
          input.style.borderColor = "transparent";
          input.style.width = "100%";
          td.appendChild(input);
          document.getElementsByTagName("tr")[i+1].appendChild(td);
        }
      }
    }

    let updateTd = document.createElement("td");
    let updateButton = document.createElement("button");
    updateButton.name = "Update";
    updateButton.innerHTML = "Update";
    updateButton.value = id;
    updateButton.className = "btn btn-success btn-sm";
    updateTd.appendChild(updateButton);

    document.getElementsByTagName("tr")[i + 1].appendChild(updateTd); 
  }
  bindUpdateBtns();  
}

function bindButtons() {
  document.getElementById("addAcc").addEventListener("click", function(event) {
    var req = new XMLHttpRequest()
    var payload = {};
    payload.type = "New";
    payload.name = document.getElementById("accName").value;
    payload.description = document.getElementById("accDesc").value;
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function() {
      if (req.status >= 200 && req.status < 400) {
        var tbody = document.getElementsByTagName("tbody")[0];
        while(tbody.firstChild) {
          tbody.removeChild(tbody.firstChild);
        }
        document.getElementById("accName").value = "";
        document.getElementById("accDesc").value = "";
        var response = JSON.parse(req.responseText);
        buildTable(response);
      }
      else {
        console.log("Error in network request: " + req.statusText);
      }
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();
  });
}

function initialize() {
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.setRequestHeader('Accept', 'application/json');
  req.addEventListener('load', function () {
    if (req.status >= 200 && req.status < 400) {
      var tbody = document.getElementsByTagName("tbody")[0];
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      var response = JSON.parse(req.responseText);
      buildTable(response);
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}

function bindUpdateBtns() {
  let updateBtns = document.querySelectorAll("[name=Update]");
  for (let i = 0; i < updateBtns.length; i++) {
    updateBtns[i].addEventListener("click", function(event) {
      let name = this.parentElement.parentElement.childNodes[0].firstChild;
      let description = this.parentElement.parentElement.childNodes[1].firstChild;
      if (name.hasAttribute("readOnly")) {
        name.removeAttribute("readOnly");
        name.className = "form-control mb-2 mr-sm-2";
        name.style.border = "inherit";
        description.removeAttribute("readOnly");
        description.className = "form-control mb-2 mr-sm-2";
        description.style.border = "inherit";
      }
      else {
        var req = new XMLHttpRequest();
        var payload = {};
        payload.type = "Update";
        payload.name = name.value;
        payload.description = description.value;
        payload.id = this.value;
        if (payload.name != "" && payload.description != "") {
          req.open("POST", url, true);
          req.setRequestHeader("Content-type", "application/json");
          req.addEventListener("load", function() {
            if (req.status >= 200 && req.status < 400) {
              var tbody = document.getElementsByTagName("tbody")[0];
              while(tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
              }
              var response = JSON.parse(req.responseText);
              buildTable(response);
            }
            else {
              console.log("Error in network request: " + req.statusText);
            }
          });
          req.send(JSON.stringify(payload));
          event.preventDefault();          
        }
        else {
          alert("Please enter the required fields");
          event.preventDefault();
        }
      }
    });
  }
}