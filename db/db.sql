/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 50538
 Source Host           : localhost
 Source Database       : populous_dev

 Target Server Type    : MySQL
 Target Server Version : 50538
 File Encoding         : utf-8

 Date: 04/26/2017 12:08:36 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `beacon_messages`
-- ----------------------------
DROP TABLE IF EXISTS `beacon_messages`;
CREATE TABLE `beacon_messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `beacon_id` varchar(40) DEFAULT NULL,
  `title` text,
  `subtitle` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `beacon_messages_received`
-- ----------------------------
DROP TABLE IF EXISTS `beacon_messages_received`;
CREATE TABLE `beacon_messages_received` (
  `id` int(11) NOT NULL DEFAULT '0',
  `beacon_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `beacon_users`
-- ----------------------------
DROP TABLE IF EXISTS `beacon_users`;
CREATE TABLE `beacon_users` (
  `id` int(11) NOT NULL DEFAULT '0',
  `regid` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `emails`
-- ----------------------------
DROP TABLE IF EXISTS `emails`;
CREATE TABLE `emails` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `creation` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
