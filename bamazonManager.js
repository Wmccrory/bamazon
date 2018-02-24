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
	console.log("Welcome to BAMAZON MANAGER!");
	console.log("  ____________________________________________")
	console.log("//A Saudi Basic Industries Corporation Venture\\\\");
	appStart()
});

/////////////////////

//opening prompt

function appStart() {
	inquirer.prompt(
		{
			type: "list",
			name: "choice",
			message: "Please decide what you would like to do:",
			choices: ["View Products", "View Low Inventory", "Add Inventory", "Add New Product"]
		}
	).then(data => {
		switch(data.choice) {
			case "View Products" : 
				viewProducts()
				break;
			case "View Low Inventory" :
				viewLowInventory()
				break;
			case "Add Inventory" : 
				addInventory()
				break;
			case "Add New Product" :
				addNewProducts()
				break;
			default :
				console.log("You should not get this error")
		}
	})
}

//app functions

//viewing current inventory
function viewProducts() {
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
		appStart()
	});
}

//only viewing low inventory (<5 items)
function viewLowInventory() {
	connection.query("SELECT * FROM products", function(err, res) {
		var rows = [];
		dbResults = res;
		for (i = 0; i < res.length; i++) {
			if (res[i].stockQuantity <= 5) {
				rows.push([res[i].itemID, res[i].productName, res[i].price, res[i].stockQuantity]);
			}
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
		appStart()
	});
}

//adding inventory to existing items
function addInventory() {
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
		inquirer.prompt(
		[{
			type : "input",
			name : "itemName",
			message : "Enter a product name or ID here",
			validate : function validateitemName(name){
			return name !== "";
			}
		},
		{
			type : "input",
			name : "itemQuantity",
			message : "How many would you like to add?",
			validate : function validateitemQuantity(name){
				return !isNaN(name)
			}
		}]
		).then(input => {
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
			};	

			if (!itemMatch) {
				console.log("No items match your input!");
				return appStart()
			};

			var newStockQuantity = (parseInt(chosenItem.stockQuantity) + parseInt(input.itemQuantity));

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
					console.log("Stock Quantity has been set to " + newStockQuantity);
					console.log("======================");

					appStart()
				}
			);
		})
	});
}

//Creating new items
function addNewProducts() {
	console.log("Add New Products :)");
	inquirer.prompt(
		[
		{
			type : "input",
			name : "name",
			message : "What is the product name?",
			validate : function validateitemName(name){
				return name !== "";
			}
		},
		{
			type : "input",
			name : "price",
			message : "What is the price of the product?",
			validate : function validateitemQuantity(name){
				return !isNaN(name);
			}
		},
		{
			type : "input",
			name : "quantity",
			message : "What is the quantity of the product?",
			validate : function validateitemQuantity(name){
				return !isNaN(name);
			}
		},
		{
			type : "input",
			name : "department",
			message : "What department is this product located in?",
			validate : function validateitemQuantity(name){
				return name !== "";
			}
		}
		]
	).then(data => {
		console.log(data);

		connection.query(
				"INSERT INTO products SET ?",
				[
					{
						productName : data.name,
						price : data.price,
						stockQuantity : data.quantity,
						departmentName : data.department
					}
				],
				function(error) {
					if (error) throw err;
					console.log("======================");
					console.log("You added " + data.name + " to the " + data.department + " department!");
					console.log("======================");

					appStart()
				}
			);
	})
}