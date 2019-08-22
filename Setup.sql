-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: May 06, 2019 at 05:05 PM
-- Server version: 10.3.13-MariaDB-log
-- PHP Version: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: ``
--

-- --------------------------------------------------------

--
-- Table structure for table `Accolades`
--

CREATE TABLE `Accolades` (
  `id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Accolades`
--

INSERT INTO `Accolades` (`id`, `Name`, `Description`) VALUES
(1, 'MVP', 'Most valuable player of the regular season');

-- --------------------------------------------------------

--
-- Table structure for table `AccoladeWinners`
--

CREATE TABLE `AccoladeWinners` (
  `AccId` int(11) NOT NULL,
  `PlayerId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `GamePlayer`
--

CREATE TABLE `GamePlayer` (
  `GameId` int(11) NOT NULL,
  `PlayerId` int(11) NOT NULL,
  `PlayerPoints` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Games`
--

CREATE TABLE `Games` (
  `id` int(11) NOT NULL,
  `Date` date NOT NULL,
  `HomeTeam` int(11) NOT NULL,
  `HomeTeamScore` int(11) NOT NULL,
  `AwayTeam` int(11) NOT NULL,
  `AwayTeamScore` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Games`
--

INSERT INTO `Games` (`id`, `Date`, `HomeTeam`, `HomeTeamScore`, `AwayTeam`, `AwayTeamScore`) VALUES
(1, '2018-11-15', 2, 107, 1, 86);

-- --------------------------------------------------------

--
-- Table structure for table `Players`
--

CREATE TABLE `Players` (
  `id` int(11) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Position` char(1) NOT NULL,
  `TeamId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Players`
--

INSERT INTO `Players` (`id`, `FirstName`, `LastName`, `Position`, `TeamId`) VALUES
(1, 'Stephen', 'Curry', 'G', 1),
(2, 'James', 'Harden', 'G', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Teams`
--

CREATE TABLE `Teams` (
  `id` int(11) NOT NULL,
  `Location` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Teams`
--

INSERT INTO `Teams` (`id`, `Location`, `Name`) VALUES
(1, 'Golden State', 'Warriors'),
(2, 'Houston', 'Rockets');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Accolades`
--
ALTER TABLE `Accolades`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `AccoladeWinners`
--
ALTER TABLE `AccoladeWinners`
  ADD PRIMARY KEY (`AccId`,`PlayerId`),
  ADD KEY `PlayerId` (`PlayerId`);

--
-- Indexes for table `GamePlayer`
--
ALTER TABLE `GamePlayer`
  ADD PRIMARY KEY (`GameId`,`PlayerId`),
  ADD KEY `PlayerId` (`PlayerId`);

--
-- Indexes for table `Games`
--
ALTER TABLE `Games`
  ADD PRIMARY KEY (`id`),
  ADD KEY `AwayTeam` (`AwayTeam`),
  ADD KEY `HomeTeam` (`HomeTeam`);

--
-- Indexes for table `Players`
--
ALTER TABLE `Players`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TeamId` (`TeamId`);

--
-- Indexes for table `Teams`
--
ALTER TABLE `Teams`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Accolades`
--
ALTER TABLE `Accolades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Games`
--
ALTER TABLE `Games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Players`
--
ALTER TABLE `Players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Teams`
--
ALTER TABLE `Teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `AccoladeWinners`
--
ALTER TABLE `AccoladeWinners`
  ADD CONSTRAINT `AccoladeWinners_ibfk_1` FOREIGN KEY (`AccId`) REFERENCES `Accolades` (`id`),
  ADD CONSTRAINT `AccoladeWinners_ibfk_2` FOREIGN KEY (`PlayerId`) REFERENCES `Players` (`id`);

--
-- Constraints for table `GamePlayer`
--
ALTER TABLE `GamePlayer`
  ADD CONSTRAINT `GamePlayer_ibfk_1` FOREIGN KEY (`GameId`) REFERENCES `Games` (`id`),
  ADD CONSTRAINT `GamePlayer_ibfk_2` FOREIGN KEY (`PlayerId`) REFERENCES `Players` (`id`);

--
-- Constraints for table `Games`
--
ALTER TABLE `Games`
  ADD CONSTRAINT `Games_ibfk_1` FOREIGN KEY (`AwayTeam`) REFERENCES `Teams` (`id`),
  ADD CONSTRAINT `Games_ibfk_2` FOREIGN KEY (`HomeTeam`) REFERENCES `Teams` (`id`);

--
-- Constraints for table `Players`
--
ALTER TABLE `Players`
  ADD CONSTRAINT `Players_ibfk_1` FOREIGN KEY (`TeamId`) REFERENCES `Teams` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
