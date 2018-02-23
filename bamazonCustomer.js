//bamazon customer file//

//dependencies//
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("tty-table");
var chalk = require("chalk");

///////////////////////

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
	console.log("Welcome to BAMAZON");
	console.log("connected as id " + connection.threadId);
	console.log("  ____________________________________________")
	console.log("//A Saudi Basic Industries Corporation Venture\\\\");
	displayItem()
});

/////////////////////

//inquirer prompts//
function itemSelect() {
	inquirer.prompt(
		[{
			type: "input",
			name: "itemName",
			message: "Enter an item by product name or ID: ",
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
		itemOrder(data);
		displayItem()
	})
}

///////////////////

//app functions//

//display item list//
function displayItem() {
	connection.query("SELECT * FROM products", function(err, res) {
		var rows = [];
		dbResults = res;
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

//order item
function itemOrder(input) {
	//if user input is item name	
	if (isNaN(input.itemName) === true) {
		for (i = 0; i < dbResults.length; i++) {
			if (input.itemName.toUpperCase() === dbResults[i].productName.toUpperCase()) {
				var chosenItem = dbResults[i];
				var itemMatch = true;
			}
		}
	}
	//if user input is item ID
	else if (isNaN(input.itemName) === false) {
		for (i = 0; i < dbResults.length; i++) {
			if (parseInt(input.itemName) === dbResults[i].itemID) {
				var chosenItem = dbResults[i];
				var itemMatch = true;
			}
		}
	}	

	if (!itemMatch) {
		return console.log("No items match your input!");
	} 

	if (input.itemQuantity > chosenItem.stockQuantity) {
		return console.log("You want more of that item than we have in stock!");
	}

	var newStockQuantity = (chosenItem.stockQuantity - input.itemQuantity);

	connection.query(
		"UPDATE products SET ? WHERE ?",
		[
			{
				stockQuantity : newStockQuantity
			},
			{
				itemID : chosenItem.itemID
			}
		],
		function(error) {
			if (error) throw err;
			console.log("======================");
			console.log("Order successfully placed");
			console.log("Your order comes out to be " + (chosenItem.price * input.itemQuantity).toFixed(2) + " dollars. Enjoy!");
			console.log("======================");
		}
	)
} 