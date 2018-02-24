# BAMAZON
An Amazon-like command line marketplace utilizing mysql to store items. The Bamazon marketplace relies on two separate javascript files to function, Bamazon Customer and Bamazon Manager. Bamazon Customer allows users to place orders (as inventory restrictions allow) and Bamazon Manager allows users to update item stock and add new items to the store.

This particular project could be useful as it exists already as a very rudimentary inventory management system. The interface is very simplistic, and does not allow for very much room for the user to get out in the weeds. If a user tries to select items that do not exist, an empty string, or enter a non-number in a field that only allows for numeric input, the input is gently rejected and user must enter a new input.

User interface could be further improved by making the user confirm their choice before it is committed to the database. Inventory management could be further improved by adding a subfunction if a user selects an item by item name that has more than one entry in the database.

### npm packages used:
- tty-table
- mysql
- inquirer

## Bamazon Customer

![Bamazon customer usage example](https://github.com/Wmccrory/bamazon/blob/master/bamazonCustomer.gif)

Bamazon inventory is automatically displayed and user is asked to pick an item by unique ID number or product name. Once item is selected, user is asked what quantity they would like. 

If there is enough quantity to stock their order, it is placed and the item quantity is updated in the database and the user is given the total purchase price for their order. User is then taken back to main order screen.

## Bamazon Manager

![Bamazon manager usage example](https://github.com/Wmccrory/bamazon/blob/master/bamazonManager.gif)

Menu is automatically displayed with four options:
- View inventory
- View low inventory
- Add inventory
- Add new item

If user selects "View inventory", a table is displayed with all items in the marketplace.

If user selects "View low inventory", a table is displayed that only shows items in the marketplace with less than 5 units in stock.

If user selects "Add inventory", the inventory table is displayed and user selects from one of the options and is asked to provide how many new units to add to the inventory. Inventory is then updated.

If user selects "Add new items", user is walked through item creation, and item is added into database after user supplies product name, price, quantity, and store department.

After user completes the option, they are taken automatically back to the main menu.