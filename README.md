TODO's:
- [x] fix bug, where attacking the top left corner 'drops' the GUI field down (changed align-items to start)
- [ ] reduce code duplication in the checkProximity() function, can combine multiple statements
- [x] add hit effect when this.receiveAttack() runs, so that it looks nicer
- [x] add AI for the enemy
- [ ] add game over
- [ ] use recursion for determine mode?
- [ ] use ES module instead of module.exports
- [ ] refactor obvious conditions, like if (player1Turn === true) => if (player1Turn)
- [x] remove hover effect from AI field
DRAG AND DROP:
- [x] add drag and drop feature
- [x] reduce amount of refreshing the board when placing the ship
- [ ] implement a proper reset button
- [x] add functionality to the random button
- [ ] add event listener to "R" key to also change mode
- [ ] add feature where turnboard tells you why the ship couldn't be placed?
CSS:
- [x] remove hover effect when placing ship
- [x] scale Board message
- [x] reduce maximum size on both fields
- [x] fix scaling of fields on smaller screen
- [x] correct the style of the info field (above the mode button)
- [ ] add nice hover stylings for the buttons in ship placement
- [ ] add proper hit texture, explosion? "💥" emoji?
IMAGES:
- [x] add images for each ship
- [ ] flip the falcon
- [ ] add another submarine model, with going over water a bit
OTHER:
- [ ] update eslint rule-set to template repo!

📚 Things I learned:
- how to use TDD using Jest
- implementing a drag and drop system
- refactoring code and keeping a consistent code style
- organizing code in a large codebase
- how to use clamp() in CSS to easily size elements