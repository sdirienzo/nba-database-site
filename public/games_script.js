var url = "http://localhost:3742/games";
document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("DOMContentLoaded", bindButtons);

function buildTable(response) {
  for (const [i, rows] of response.rowsG.entries()) {
    console.log(rows);
    let id = rows["id"];
    let tr = document.createElement("tr");
    document.getElementsByTagName("tbody")[0].appendChild(tr);
    for (let prop in rows) {
      if (rows.hasOwnProperty(prop)) {
        if (prop !== "id") {
          let td = document.createElement("td");
          let input = document.createElement("input");

          if (prop == "DATE_FORMAT(g.Date, '%Y-%m-%d')") {
            input.type = "date";
          }
          else {
            input.type = "text";
          }
          input.value = `${rows[prop]}`;
          input.readOnly = true;
          input.style.borderColor = "transparent";
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

function buildTeams(response, teamId) {
  for (const [i, rowsT] of response.rowsT.entries()) {
    let id = rowsT["id"];
    let op = document.createElement("option");
    op.innerText = `${rowsT["Team"]}`;
    op.value = id;
    document.getElementById(teamId).appendChild(op);
  }
}

function buildUpdateTeams(event, teamId) {
  let row = event.parentElement.parentElement;
  let curTeam;
  if (teamId == "homeTeam") {
    curTeam = row.childNodes[1];
  } else if (teamId == "awayTeam") {
    curTeam = row.childNodes[3];
  }
  let curTeamVal = curTeam.firstChild.value;
  let teams = document.getElementById(teamId).options;
  let teamSelect = document.createElement("select");
  teamSelect.className = "custom-select mb-2 mr-sm-2";
  for (let team of teams) {
    if (team.value != "Home Team..." && team.value != "Away Team...") {
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
      buildTeams(response, "homeTeam");
      buildTeams(response, "awayTeam");

    } else {
      console.log("Error in network request: " + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}

function bindButtons() {
  document.getElementById("addGame").addEventListener("click", function(event) {
    var req = new XMLHttpRequest();
    var payload = {};
    payload.type = "New";
    payload.date = document.getElementById("date").value;
    payload.homeTeam = document.getElementById("homeTeam").value;
    payload.homeScore = document.getElementById("homeScore").value;
    payload.awayTeam = document.getElementById("awayTeam").value;
    payload.awayScore = document.getElementById("awayScore").value;
    if (payload.date != "" && payload.homeTeam != "Home Team..." && payload.homeScore != "" && payload.awayTeam != "Away Team..." && payload.awayScore != "") {
      if (payload.homeTeam != payload.awayTeam) {
        if (payload.homeScore > 0 && payload.awayScore > 0) {
          req.open("POST", url, true);
          req.setRequestHeader("Content-type", "application/json");
          req.addEventListener("load", function() {
            if (req.status >= 200 && req.status < 400) {
              var tbody = document.getElementsByTagName("tbody")[0];
              while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
              }
              document.getElementById("date").value = "";
              document.getElementById("homeTeam").value = "Home Team...";
              document.getElementById("homeScore").value = "";
              document.getElementById("awayTeam").value = "Away Team...";
              document.getElementById("awayScore").value = "";
              var response = JSON.parse(req.responseText);
              buildTable(response);
            } else {
              console.log("Error in network request: " + req.statusText);
            }
          });
          req.send(JSON.stringify(payload));
          event.preventDefault();
        } else {
          alert("Error: Scores cannot be negative");
          event.preventDefault();
        }
      } else {
        alert("Error: Home and Away teams cannot be the same team");
        event.preventDefault();
      }
    } else {
      alert("Please enter the required fields");
      event.preventDefault();
    }
  });
}

function bindUpdateBtns() {
  let updateBtns = document.querySelectorAll("[name=Update]");
  for (let i = 0; i < updateBtns.length; i++) {
    updateBtns[i].addEventListener("click", function(event) {
      let date = this.parentElement.parentElement.childNodes[0].firstChild;
      let hmTeam = this.parentElement.parentElement.childNodes[1].firstChild;
      let hmTeamSc = this.parentElement.parentElement.childNodes[2].firstChild;
      let awTeam = this.parentElement.parentElement.childNodes[3].firstChild;
      let awTeamSc = this.parentElement.parentElement.childNodes[4].firstChild;
      if (date.hasAttribute("readOnly")) {
        date.removeAttribute("readOnly");
        date.style.border = "inherit";
        date.className = "form-control mb-2 mr-sm-2";
        hmTeam.removeAttribute("readOnly");
        hmTeam.style.border = "inherit";
        hmTeamSc.removeAttribute("readOnly");
        hmTeamSc.className = "form-control mb-2 mr-sm-2";
        hmTeamSc.style.border = "inherit";
        awTeam.removeAttribute("readOnly");
        awTeam.style.border = "inherit";
        awTeamSc.removeAttribute("readOnly");
        awTeamSc.className = "form-control mb-2 mr-sm-2";
        awTeamSc.style.border = "inherit";
        buildUpdateTeams(this, "homeTeam");
        buildUpdateTeams(this, "awayTeam");
      } else {
        var req = new XMLHttpRequest();
        var payload = {};
        payload.type = "Update"
        payload.date = date.value;
        payload.homeTeam = hmTeam.value;
        payload.homeScore = hmTeamSc.value;
        payload.awayTeam = awTeam.value;
        payload.awayScore = awTeamSc.value;
        payload.id = this.value;
        if (payload.date != "" && payload.homeTeam != "" && payload.homeScore != "" && payload.awayTeam != "" && payload.awayScore != "") {
          if (payload.homeTeam != payload.awayTeam) {
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
            alert("Error: Home and Away teams cannot be the same team");
            event.preventDefault();
          }
        } else {
          alert("Please enter the required fields");
          event.preventDefault();
        }
      }
    });
  }
}