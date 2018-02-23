//bamazon customer file//

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
		width : 16
	},
]

///////////////////////

//mysql requirements//
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

//app initialization//
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	console.log("Welcome to BAMAZON.");
	console.log("A Saudi Basic Industries Corporation Venture");
	displayItem()
});

/////////////////////

//inquirer prompts//
function itemSelect() {
	inquirer.prompt(
		[{
			type: "input",
			name: "itemName",
			message: "Enter an item by name or ID",
			validate: function validateitemName(name){
			return name !== "";
			}
		},
		{
			type: "input",
			name: "itemQuantity",
			message: "How many would you like to buy?",
			validate: function validateitemQuantity(name){
			return !isNaN(name);
			}
		}]
	).then(data => {
		testFunction(data);
		displayItem()
	})
}

///////////////////

//app functions//
function displayItem() {
	connection.query("SELECT * FROM products", function(err, res) {
		var rows = [];
		for (i = 0; i < res.length; i++) {
			rows.push([res[i].itemID, res[i].productName, res[i].price, res[i].stockQuantity]);
		}

		var t2 = Table(header,rows,
		{
			borderStyle : 1,
			paddingBottom : 0,
			headerAlign : "center",
			align : "center",
			color : "white"
		});
		console.log(t2.render());
		itemSelect()
	});
};

//testing area//

function testFunction(input) {
	console.log(input)
	if (isNaN(input.itemName) === true) {
		console.log(input.itemName + " is not a number");
		console.log(input.itemQuantity);
	} else {
		console.log(input.itemName + " is a number");
		console.log(input.itemQuantity);
	}
}