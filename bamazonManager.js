//bamazon manager file//

//dependencies//
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("tty-table");
var chalk = require("chalk");

//table creation//
var header = [
	{
		value : "ID",
		headerColor : "cyan",
		color: "white",
		align : "center",
		width : 11
	},
	{
		value : "Product Name",
		headerColor : "cyan",
		color : "white",
		align : "center",
		width: 100
	},
	{
		value : "Price",
		headerColor : "cyan",
		color: "white",
		align : "center",
		width : 10
	},
	{
		value : "Quantity in Stock",
		headerColor : "cyan",
		color: "white",
		align : "center",
		width : 20
	},
]