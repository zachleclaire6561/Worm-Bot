"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Discord = require('discord.js');

var mysql = require('mysql'); ///var testUtil = require('./testUtility.js');


var Client =
/*#__PURE__*/
function (_Discord$Client) {
  _inherits(Client, _Discord$Client);

  function Client(SQLConnection) {
    var _this;

    _classCallCheck(this, Client);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Client).call(this));
    SQLConnection.connect(function (err) {
      if (err) throw err;
      console.log("Connected to Database!");
    });
    return _this;
  }

  _createClass(Client, null, [{
    key: "addToDataBase",
    value: function addToDataBase(column, entries, values) {
      var query = "INSERT INTO " + column + "(";

      if (entries.length != values.length) {
        console.log(entries);
        console.log(values);
        throw new Error('Invalid Constructor Parameters');
      }

      for (j = 0; j < entries.length; j++) {
        query += entries[j];

        if (j != entries.length - 1) {
          query += ", ";
        }
      }

      query += ") VALUES ?";
      SQLConnection.connect(function (err) {
        if (err) throw err;
        console.log();
        SQLConnection.query(query, values, function (err, result) {
          if (err) throw err;
          console.log("Number of Rows Inserted: " + result.affectedRows);
        });
      });
    }
    /*
    static updateDataBase() {
        var query =
    }
      static readRecord() {
      }
    */

  }]);

  return Client;
}(Discord.Client);