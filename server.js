var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : '',
  user            : '',
  password        : '',
  database        : ''
})

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('port', 3742);

app.get('/players', function(req, res, next) {
  var context = {}
  pool.query("SELECT Players.id, FirstName, LastName, Position, CONCAT(Teams.Location, ' ', Teams.Name) AS Team FROM Players LEFT JOIN Teams ON TeamId = Teams.id",
  function(err, rows) {
    if(err) {
      next(err);
      return;
    }
    context.rowsP = rows;
    pool.query("SELECT id, CONCAT(Location, ' ', Name) AS Team FROM Teams",
    function(err, rows) {
      if(err) {
        next(err);
        return;
      }
      context.rowsT = rows;
      res.send(JSON.stringify(context));
    });
  });
});

app.get('/teams', function(req, res, next) {
  pool.query("SELECT id, Location, Name FROM Teams",
  function(err, rows) {
    var context = {}
    if(err) {
      next(err);
      return;
    }
    context.rows = rows;
    res.send(JSON.stringify(context));
  });
});

app.get('/games', function(req, res, next) {
  pool.query("SELECT g.id, DATE_FORMAT(g.Date, '%Y-%m-%d'), CONCAT(th.Location, ' ', th.Name) AS HomeTeam, g.HomeTeamScore, CONCAT(ta.Location, ' ', ta.Name) AS AwayTeam, g.AwayTeamScore FROM Games g JOIN Teams th ON g.HomeTeam = th.id JOIN Teams ta ON g.AwayTeam = ta.id",
  function(err, rows) {
    var context = {}
    if(err) {
      next(err);
      return;
    }
    context.rowsG = rows;
    pool.query("SELECT id, CONCAT(Location, ' ', Name) AS Team FROM Teams", 
    function(err, rows) {
      if (err) {
        next(err);
        return;
      }
      context.rowsT = rows;
      res.send(JSON.stringify(context));
    });
  });
});

app.get('/appearances', function(req, res, next) {
  pool.query("SELECT gp.GameId, gp.PlayerId, CONCAT(DATE_FORMAT(g.Date, '%m-%d-%y'), ' ', t.Name, ' vs. ', te.Name) AS Game, CONCAT(p.FirstName, ' ', p.LastName) AS Player, gp.PlayerPoints FROM GamePlayer gp INNER JOIN Games g ON gp.GameId = g.id INNER JOIN Players p ON gp.PlayerId = p.id INNER JOIN Teams t ON g.AwayTeam = t.id INNER JOIN Teams te ON g.HomeTeam = te.id",
  function(err, rows) {
    var context = {}
    if(err) {
      next(err);
      return;
    }
    context.rows = rows;
    pool.query("SELECT g.id, CONCAT(DATE_FORMAT(g.Date, '%m-%d-%y'), ' ', ta.Name, ' vs. ', th.Name) AS Game FROM Games g INNER JOIN Teams ta ON g.AwayTeam = ta.id INNER JOIN Teams th ON g.HomeTeam = th.id;",
    function(err, rows) {
      if (err) {
        next(err);
        return;
      }
      context.rowsG = rows;
      pool.query("SELECT id, CONCAT(FirstName, ' ', LastName) as Name FROM Players", 
      function(err, rows) {
        if (err) {
          next(err);
          return;
        }
        context.rowsP = rows;
        res.send(JSON.stringify(context));
      });
    });
  });
});

app.get('/accolades', function(req, res, next) {
  pool.query("SELECT id, Name, Description FROM Accolades",
  function(err, rows) {
    var context = {}
    if(err) {
      next(err);
      return;
    }
    context.rows = rows;
    res.send(JSON.stringify(context));
  });
});

app.get('/winners', function(req, res, next) {
  pool.query("SELECT aw.AccId, aw.PlayerId, a.Name, CONCAT(p.FirstName, ' ', p.LastName) AS PlayerName FROM AccoladeWinners aw INNER JOIN Accolades a ON aw.AccId = a.id INNER JOIN Players p ON aw.PlayerId = p.id",
  function(err, rows) {
    var context = {}
    if(err) {
      next(err);
      return;
    }
    context.rows = rows;
    pool.query("SELECT id, Name FROM Accolades", function(err, rows) {
      if (err) {
        next(err);
        return;
      }
      context.rowsA = rows;
      pool.query("SELECT id, CONCAT(FirstName, ' ', LastName) as Name FROM Players", function(err, rows) {
        if (err) {
          next(err);
          return;
        }
        context.rowsP = rows;
        res.send(JSON.stringify(context));
      });
    });
  });
});

app.post("/players", function(req, res, next) {
  if (req.body.type == "New") {
    pool.query("INSERT INTO Players (FirstName, LastName, Position, TeamId) VALUES (?)", [[req.body.firstName, req.body.lastName, req.body.position, req.body.team]], function(err, result) {
      if(err) {
        console.log(err.stack);
        next(err);
        return;
      }
      var context = {};
      pool.query("SELECT Players.id, FirstName, LastName, Position, CONCAT(Teams.Location, ' ', Teams.Name) AS Team FROM Players LEFT JOIN Teams ON TeamId = Teams.id",
      function(err, rows) {
        if(err) {
          next(err);
          return;
        }
        context.rowsP = rows;
        pool.query("SELECT id, CONCAT(Location, ' ', Name) AS Team FROM Teams",
        function(err, rows) {
          if(err) {
            next(err);
            return;
          }
          context.rowsT = rows;
          res.send(JSON.stringify(context));
        });
      });
    });
  } else if (req.body.type == "Update") {
    pool.query("UPDATE Players SET FirstName=?, LastName=?, Position=?, TeamId=? WHERE id=?", [req.body.firstName, req.body.lastName, req.body.position, req.body.team, req.body.id], function(err, result) {
      if(err) {
        console.log(err.stack);
        next(err);
        return;
      }
      var context = {};
      pool.query("SELECT Players.id, FirstName, LastName, Position, CONCAT(Teams.Location, ' ', Teams.Name) AS Team FROM Players LEFT JOIN Teams ON TeamId = Teams.id",
      function(err, rows) {
        if(err) {
          next(err);
          return;
        }
        context.rowsP = rows;
        res.send(JSON.stringify(context));
      });
    });
  } else if (req.body.type == "Search") {
    var context = {}
    pool.query("SELECT Players.id, FirstName, LastName, Position, CONCAT(Teams.Location, ' ', Teams.Name) AS Team FROM Players LEFT JOIN Teams ON TeamId = Teams.id WHERE FirstName LIKE ? OR LastName LIKE ? OR Position LIKE ? OR Teams.Location LIKE ? OR Teams.Name LIKE ?",
    ["%"+req.body.searchVal+"%", "%"+req.body.searchVal+"%", "%"+req.body.searchVal+"%", "%"+req.body.searchVal+"%", "%"+req.body.searchVal+"%"],
    function(err, rows) {
      if(err) {
        next(err);
        return;
      }
      context.rowsP = rows;
      res.send(JSON.stringify(context));
    });
  }
}); 

app.post("/games", function(req, res, next) {
  if (req.body.type == "New") {
    pool.query("INSERT INTO Games (Date, HomeTeam, HomeTeamScore, AwayTeam, AwayTeamScore) VALUES (?)", 
    [[req.body.date, req.body.homeTeam, req.body.homeScore, req.body.awayTeam, req.body.awayScore]], 
    function(err, result) {
      if (err) {
        console.log(err.stack);
        next(err);
        return;
      }
      var context = {};
      pool.query("SELECT g.id, DATE_FORMAT(g.Date, '%Y-%m-%d'), CONCAT(th.Location, ' ', th.Name) AS HomeTeam, g.HomeTeamScore, CONCAT(ta.Location, ' ', ta.Name) AS AwayTeam, g.AwayTeamScore FROM Games g JOIN Teams th ON g.HomeTeam = th.id JOIN Teams ta ON g.AwayTeam = ta.id", 
      function(err, rows) {
        if (err) {
          next(err);
          return;
        }
        context.rowsG = rows;
        pool.query("SELECT id, CONCAT(Location, ' ', Name) AS Team FROM Teams", 
        function(err, rows) {
          if (err) {
            next(err);
            return;
          }
          context.rowsT = rows;
          res.send(JSON.stringify(context));
        });
      });
    });
  } else if (req.body.type == "Update") {
    pool.query("UPDATE Games SET Date=?, HomeTeam=?, HomeTeamScore=?, AwayTeam=?, AwayTeamScore=? WHERE id=?", [req.body.date, req.body.homeTeam, req.body.homeScore, req.body.awayTeam, req.body.awayScore, req.body.id], function(err, result) {
      if(err) {
        console.log(err.stack);
        next(err);
        return;
      }
      var context = {};
      pool.query("SELECT g.id, DATE_FORMAT(g.Date, '%Y-%m-%d'), CONCAT(th.Location, ' ', th.Name) AS HomeTeam, g.HomeTeamScore, CONCAT(ta.Location, ' ', ta.Name) AS AwayTeam, g.AwayTeamScore FROM Games g JOIN Teams th ON g.HomeTeam = th.id JOIN Teams ta ON g.AwayTeam = ta.id", 
      function(err, rows) {
        if (err) {
          next(err);
          return;
        }
        context.rowsG = rows;
        res.send(JSON.stringify(context));
      });
    });
  }
});

app.post("/teams", function(req, res, next) {
  if (req.body.type == "New") {
    pool.query("INSERT INTO Teams (Location, Name) VALUES (?)", [[req.body.location, req.body.name]], function(err, result) {
      if(err) {
        console.log(err.stack);
        next(err);
        return;
      }
      pool.query("SELECT id, Location, Name FROM Teams", function(err, rows) {
        var context = {};
        if(err) {
          next(err);
          return;
        }
        context.rows = rows;
        res.send(JSON.stringify(context));
      });
    });
  } else if (req.body.type == "Update") {
      pool.query("UPDATE Teams SET Location=?, Name=? WHERE id=?", [req.body.location, req.body.name, req.body.id], function(err, result) {
      if(err) {
        console.log(err.stack);
        next(err);
        return;
      }
      pool.query("SELECT id, Location, Name FROM Teams", function(err, rows) {
        var context = {};
        if(err) {
          next(err);
          return;
        }
        context.rows = rows;
        res.send(JSON.stringify(context));
       });
    });
  }
}); 

app.post("/accolades", function(req, res, next) {
  if (req.body.type == "New") {
    pool.query("INSERT INTO Accolades (Name, Description) VALUES (?)", [[req.body.name, req.body.description]], function (err, result) {
      if (err) {
        console.log(err.stack);
        next(err);
        return;
      }
      pool.query("SELECT Name, Description FROM Accolades", function (err, rows) {
        var context = {};
        if (err) {
          next(err);
          return;
        }
        context.rows = rows;
        res.send(JSON.stringify(context));
      });
    });
  }
  else if (req.body.type == "Update") {
    pool.query("UPDATE Accolades SET Name=?, Description=? WHERE id=?", [req.body.name, req.body.description, req.body.id], function(err, result) {
      if (err) {
        console.log(err.stack);
        next(err);
        return;
      }
      pool.query("SELECT id, Name, Description FROM Accolades", function (err, rows) {
        var context = {};
        if(err) {
          next(err);
          return;
        }
        context.rows = rows;
        res.send(JSON.stringify(context));
      });
    });
  }
});

app.post('/winners', function(req, res, next) {
  if (req.body.type == "New") {
    pool.query("INSERT INTO AccoladeWinners (AccId, PlayerId) VALUES (?)", 
    [[req.body.accolade, req.body.player]], 
    function(err, result) {
      if (err) {
        console.log(err.stack);
        next(err);
        return;
      }
      var context = {};
      pool.query("SELECT aw.AccId, aw.PlayerId, a.Name, CONCAT(p.FirstName, ' ', p.LastName) AS PlayerName FROM AccoladeWinners aw INNER JOIN Accolades a ON aw.AccId = a.id INNER JOIN Players p ON aw.PlayerId = p.id", 
      function(err, rows) {
        if (err) {
          next(err);
          return;
        }
        context.rows = rows;
        pool.query("SELECT id, Name FROM Accolades", function(err, rows) {
          if (err) {
            next(err);
            return;
          }
          context.rowsA = rows;
          pool.query("SELECT id, CONCAT(FirstName, ' ', LastName) as Name FROM Players", function(err, rows) {
            if (err) {
              next(err);
              return;
            }
            context.rowsP = rows;
            res.send(JSON.stringify(context));
          });
        });
      });
    });
  } else if (req.body.type == "Delete") {
    pool.query("DELETE FROM AccoladeWinners WHERE AccId=? AND PlayerId=?", [req.body.accolade, req.body.player], function(err, rows) {
      if (err) {
        console.log(err.stack);
        next(err);
        return;
      }
        var context = {};
        pool.query("SELECT aw.AccId, aw.PlayerId, a.Name, CONCAT(p.FirstName, ' ', p.LastName) AS PlayerName FROM AccoladeWinners aw INNER JOIN Accolades a ON aw.AccId = a.id INNER JOIN Players p ON aw.PlayerId = p.id",
        function(err, rows) {
          if (err) {
            next(err);
            return;
          }
          context.rows = rows;
          res.send(JSON.stringify(context));
        });
    });
  }
});

app.post('/appearances', function(req, res, next) {
  pool.query("INSERT INTO GamePlayer (GameId, PlayerId, PlayerPoints) VALUES (?)", 
  [[req.body.game, req.body.player, req.body.points]], 
  function(err, result) {
    if (err) {
      console.log(err.stack);
      next(err);
      return;
    }
    var context = {};
    pool.query("SELECT gp.GameId, gp.PlayerId, CONCAT(DATE_FORMAT(g.Date, '%m-%d-%y'), ' ', t.Name, ' vs. ', te.Name) AS Game, CONCAT(p.FirstName, ' ', p.LastName) AS Player, gp.PlayerPoints FROM GamePlayer gp INNER JOIN Games g ON gp.GameId = g.id INNER JOIN Players p ON gp.PlayerId = p.id INNER JOIN Teams t ON g.AwayTeam = t.id INNER JOIN Teams te ON g.HomeTeam = te.id",
    function(err, rows) {
      if(err) {
        next(err);
        return;
      }
      context.rows = rows;
      pool.query("SELECT CONCAT(DATE_FORMAT(g.Date, '%m-%d-%y'), ' ', ta.Name, ' vs. ', th.Name) AS Game FROM Games g INNER JOIN Teams ta ON g.AwayTeam = ta.id INNER JOIN Teams th ON g.HomeTeam = th.id;",
      function(err, rows) {
        if (err) {
          next(err);
          return;
        }
        context.rowsG = rows;
        pool.query("SELECT id, CONCAT(FirstName, ' ', LastName) as Name FROM Players", 
        function(err, rows) {
          if (err) {
            next(err);
            return;
          }
          context.rowsP = rows;
          res.send(JSON.stringify(context));
        });
      });
    });
  });
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
