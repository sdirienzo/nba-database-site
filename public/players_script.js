var url = "http://localhost:3742/players";
document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rowsP] of response.rowsP.entries()) {
    let id = rowsP["id"];
    let tr = document.createElement("tr");
    document.getElementsByTagName("tbody")[0].appendChild(tr);
    for (let prop in rowsP) {
      if (rowsP.hasOwnProperty(prop)) {
        if (prop !== "id") {
          let td = document.createElement("td");
          let input = document.createElement("input");
          input.type = "text";
          if (rowsP[prop] == null) {
            input.value = "None";
          } else {
            input.value = `${rowsP[prop]}`;
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

function buildTeams(response) {
  for (const [i, rowsT] of response.rowsT.entries()) {
    let id = rowsT["id"];
    let op = document.createElement("option");
    op.innerText = `${rowsT["Team"]}`;
    op.value = id;
    document.getElementById("team").appendChild(op);
  }
}

function buildUpdatePos(event) {
  let row = event.parentElement.parentElement;
  let curPos = row.childNodes[2];
  let curPosVal = curPos.firstChild.value;
  let positions = document.getElementById("position").options;
  let posSelect = document.createElement("select");
  posSelect.className = "custom-select mb-2 mr-sm-2";
  for (let pos of positions) {
    if (pos.value != "Position...") {
      let op = document.createElement("option");
      op.value = pos.value;
      op.innerText = pos.value;
      if (op.value == curPosVal) {
        op.selected = true;
      }
      posSelect.appendChild(op);
    }
  }
  curPos.removeChild(curPos.firstChild);
  curPos.appendChild(posSelect);
}

function buildUpdateTeams(event) {
  let row = event.parentElement.parentElement;
  let curTeam = row.childNodes[3];
  let curTeamVal = curTeam.firstChild.value;
  let teams = document.getElementById("team").options;
  let teamSelect = document.createElement("select");
  teamSelect.className = "custom-select mb-2 mr-sm-2";
  for (let team of teams) {
    if (team.value != "Team...") {
      let op = document.createElement("option");
      op.value = team.value;
      op.innerText = team.innerText;
      if (op.innerText == curTeamVal) {
        op.selected = true;
      }
      teamSelect.appendChild(op);
    }
  }
  curTeam.removeChild(curTeam.firstChild);
  curTeam.appendChild(teamSelect);
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
      buildTeams(response);
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}

function bindButtons() {
  document.getElementById("addPlayer").addEventListener("click", function(event) {
    var req = new XMLHttpRequest();
    var payload = {};
    payload.type = "New";
    payload.firstName = document.getElementById("firstName").value;
    payload.lastName = document.getElementById("lastName").value;
    payload.position = document.getElementById("position").value;
    payload.team = document.getElementById("team").value;
    if (payload.team == "None") {
      payload.team = null;
    }
    if (payload.firstName != "" && payload.lastName != "" && position != "" && payload.team != "Team...") {
      req.open("POST", url, true);
      req.setRequestHeader("Content-Type", "application/json");
      req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
          var tbody = document.getElementsByTagName("tbody")[0];
          while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
          }
          document.getElementById("firstName").value = "";
          document.getElementById("lastName").value = "";
          document.getElementById("position").value = "Position...";
          document.getElementById("team").value = "Team...";
          var response = JSON.parse(req.responseText);
          buildTable(response);
        } else {
          console.log("Error in network request: " + req.statusText);
        }
      });
      req.send(JSON.stringify(payload)); 
      event.preventDefault();
    } else {
      alert("Please enter the required fields");
      event.preventDefault();
    }
  });
  document.getElementById("searchPlayer").addEventListener("click", function(event) {
    var req = new XMLHttpRequest();
    var payload = {};
    payload.type = "Search";
    payload.searchVal = document.getElementById("searchInput").value;
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function() {
      if (req.status >= 200 && req.status < 400) {
        var tbody = document.getElementsByTagName("tbody")[0];
        while (tbody.firstChild) {
          tbody.removeChild(tbody.firstChild);
        }
        document.getElementById("searchInput").value = "";
        var response = JSON.parse(req.responseText);
        buildTable(response);
      } else {
        console.log("Error in network request: " + req.statusText);
      }
    });
    req.send(JSON.stringify(payload)); 
    event.preventDefault();
  });
}

function bindUpdateBtns() {
  let updateBtns = document.querySelectorAll("[name=Update]");
  for (let i = 0; i < updateBtns.length; i++) {
    updateBtns[i].addEventListener("click", function(event) {
      let fname = this.parentElement.parentElement.childNodes[0].firstChild;
      let lname = this.parentElement.parentElement.childNodes[1].firstChild;
      let pos = this.parentElement.parentElement.childNodes[2].firstChild;
      let team = this.parentElement.parentElement.childNodes[3].firstChild;
      console.log(fname);
      if (fname.hasAttribute("readOnly")) {     
        fname.removeAttribute("readOnly");
        fname.className = "form-control mb-2 mr-sm-2";
        fname.style.border = "inherit";
        lname.removeAttribute("readOnly");
        lname.className = "form-control mb-2 mr-sm-2";
        lname.style.border = "inherit";
        buildUpdatePos(this);
        buildUpdateTeams(this);
      } else {
        var req = new XMLHttpRequest();
        var payload = {};
        payload.type = "Update"
        payload.firstName = fname.value;
        payload.lastName = lname.value;
        payload.position = pos.value;
        payload.team = team.value;
        payload.id = this.value;
        if (payload.team == "None") {
          payload.team = null;
        }
        if (payload.firstName != "" && payload.lastName != "" && position != "" && payload.team != "") {
          req.open("POST", url, true);
          req.setRequestHeader("Content-Type", "application/json");
          req.addEventListener("load", function() {
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
          req.send(JSON.stringify(payload)); 
          event.preventDefault();
        } else {
          alert("Please enter the required fields");
          event.preventDefault();
        }
      }
    });
  }
}