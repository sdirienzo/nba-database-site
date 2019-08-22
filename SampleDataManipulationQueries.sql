-- These are some Database Manipulation queries for a partially implemented Project Website 
-- using the our NBA database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs.

-- get all Player ids and Names to populate the Player dropdowns
SELECT id, FirstName, LastName FROM Players;

-- get all Team ids and names to populate the Team/Home Team/Away Team dropdowns
SELECT id, Location, Name FROM Teams;

-- get all Accolade ids and names to populate the Accolade dropdowns
SELECT id, Name, FROM Accolades;

-- get all Game ids, Home/Away teams, and dates to populate Game dropdowns
SELECT id, HomeTeam, AwayTeam FROM Games;

-- get all players and their data to list on the Players page
SELECT FirstName, LastName, Position, CONCAT(Teams.Location, ' ', Teams.Name) AS Team FROM Players INNER JOIN Teams ON TeamId = Teams.id;

-- get all teams and their data to list on the Teams page
SELECT Location, Name FROM Teams;

-- get all games and their date to list on the games page TODO
SELECT g.Date, CONCAT(th.Location, ' ', th.Name) AS HomeTeam, g.HomeTeamScore, CONCAT(ta.Location, ' ', ta.Name) AS AwayTeam, g.AwayTeamScore FROM Games g JOIN 
Teams th ON g.HomeTeam = th.id JOIN Teams ta ON g.AwayTeam = ta.id;

-- get a single player's data for the Update Player form
SELECT FirstName, LastName, TeamId FROM Players WHERE id = :player_id_of_row_where_update_button_was_clicked;

-- get a single Team's data for the Update Team form
SELECT Location, Name, FROM Teams WHERE id = :team_id_of_row_where_update_button_was_clicked;

-- get a single Game's data for the Update Game form
SELECT Date, HomeTeam, HomeTeamScore, AwayTeam, AwayTeamScore FROM Games WHERE id = :game_id_of_row_where_update_button_was_clicked;

-- get a single Appearance's data for the Update Appearance form
SELECT GameId, PlayerId, PlayerPoints FROM GamePlayer WHERE GameId = :gameid_of_selected_row AND PlayerId = :playerid_of_selected_row;

-- get a single Accolade's data for the Update Accolade form
SELECT Name, Description FROM Accolades WHERE id = :accolade_id_of_row_where_update_button_was_clicked;

-- get a single Accolade Winner's data for the Update Winners form
SELECT AccId, PlayerId FROM Players WHERE AccId = :accolade_id_of_selected_row AND PlayerId = :playerid_of_selected_row;


-- get all players that play for a certain team
SELECT FirstName, LastName FROM Players WHERE TeamId = :team_input_from_user;


-- INSERT QUERIES

-- add a new player
INSERT INTO Players (FirstName, LastName, Position, TeamId) VALUES (:firstnameinput, :lastnameinput, :positioninput, :teaminput);

-- add a new team
INSERT INTO Teams (Location, Name) VALUES (:locationinput, :nameinput);

-- add a new Game
INSERT INTO Games (Date, HomeTeam, HomeTeamScore, AwayTeam, AwayTeamScore) VALUES (:dateinput, :hometeaminput, :hometeamscore, :awayteaminput, :awayteamscore);

-- add a new Accolade
INSERT INTO Accolades (Name, Description) VALUES (:accnameinput, :accdescriptioninput);

-- add a new Appearance (M-to-M relationship addition)
INSERT INTO GamePlayer (GameId, PlayerId, PlayerPoints) VALUES (:gameidinput, :playeridinput, :playerpointsinput);

-- add a new accolade winner (M-to-M relationship addition)
INSERT INTO AccoladeWinners (AccId, PlayerId) VALUES (:accidinput, :playeridinput);


-- UPDATE Queries

-- update player info based on info submitted in update form
UPDATE Players SET FirstName = :firstnameinput, LastName = :lastnameinput, Position = :positioninput, TeamId = :teaminput WHERE id = :player_id_of_row_where_update_button_was_clicked;

-- update team info based on info submitted in update form
UPDATE Teams SET Location = :locationinput, Name = :nameinput WHERE id = :team_id_of_row_where_update_button_was_clicked;

-- update game info based on info submitted in update form
UPDATE Games SET Date = :dateinput, HomeTeam = :hometeaminput, HomeTeamScore = :hometeamscoreinput, AwayTeam = :awayteaminput, AwayTeamScore = :awayteamscoreinput WHERE id = :game_id_of_row_where_update_button_was_clicked;

-- update accolade info based on info submitted in update form
UPDATE Accolades SET Name = :nameinput, Description = :descriptioninput WHERE id = :accolade_id_of_row_where_update_button_was_clicked;

-- update appearance info based on info submitted in update form
UPDATE GamePlayer SET GameId = :gameidinput, PlayerId = :playeridinput, PlayerPoints = :playerpointsinput WHERE GameId = :gameid_of_selected_row AND PlayerId = :playerid_of_selected_row;

-- update accolade winner info based on info submitted in update form
UPDATE AccoladeWinners SET AccId = :accidinput, PlayerId = :playeridinput WHERE AccId = :accolade_id_of_selected_row AND PlayerId = :playerid_of_selected_row;


-- DELETE Quereies, :selectedrow indicates the id of the entry in the row where the delete button was clicked

-- delete a player entry
DELETE FROM Players WHERE id = :selectedrow;

-- delete a Team entry
DELETE FROM Teams WHERE id = :selectedrow;

-- delete a Game entry
DELETE FROM Games WHERE id = :selectedrow;

-- delete an Accolade entry
DELETE FROM Accolades WHERE id = :selectedrow;

-- delete an Appearance entry
DELETE FROM GamePlayer WHERE id = :selectedrow;

-- delete an Accolade Winner entry
DELETE FROM AccoladeWinners WHERE id = :selectedrow;

