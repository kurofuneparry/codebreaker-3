//
// Variables used in the web page
//

colors = ['red', 'yellow', 'green', 'blue', ];

length = 4;

banner = document.getElementById('banner');
historyDiv = document.getElementById('history');
guessDiv = document.getElementById('guess');
dotsDiv = document.getElementById('dots');
menuDiv = document.getElementById('menu');

//
// Functions used in the web page:
//

// Makes a dot
function makeDot(color=colors[0], htmlClass='') {
	let dot = document.createElement('span');
    dot.style.backgroundColor = color;
	dot.className = htmlClass;
	return dot;
}

// Makes a button
function button(name, func) {
    let result = document.createElement('button');
    result.onclick = func;
    result.appendChild(document.createTextNode(name));
    return result
}

// Returns a random code
function random() {
    let result = [];
    let choose = function(choices) { // Picks a random element from choices
    	return choices[Math.floor(Math.random() * choices.length)];
    }
    while (result.length < length) {
        result.push(choose(colors));
    }
    return result;
}

// Clears the current guess
function clear() {
	for (let i=0; i<guessDiv.children.length; i++) {
	    guessDiv.children[i].style.backgroundColor = 'white';
	    guessDiv.children[i].className = 'empty';
	}
}

// Adds the color to the guess
function addColor(color) {
	// The first 'empty' dot is colored
	for (let i=0; i<guessDiv.children.length; i++) {
	    if (guessDiv.children[i].className == 'empty') {
	        guessDiv.children[i].style.backgroundColor = color;
	        guessDiv.children[i].className = '';
	        break; // No 'empty' dot? Then nothing happens in this loop
	    }
	}
}

// Creates an array of all possible codes
function allCodes(base=[[]]) {
	let longer = [];
	for (let i=0; i < base.length; i++) { // For each base array
		for (let j=0; j < colors.length; j++) { // Add another array with the next color at the end
			longer.push(base[i].concat([colors[j]]));
		}
	}

	// If the arrays need to be longer, continue recursion
	return longer[0].length < length ? allCodes(longer) : longer
}

// Gives a response to a guess only when the code is complete
function respond() {
	let response = '';
	for (let i=0; i<guessDiv.children.length; i++) {
	    if (guessDiv.children[i].style.backgroundColor == secret[i]) {
	        response.push('right ');
	    } else if (guessDiv.children[i].className != 'empty') {
	        response.push('wrong ');
	    }
	}
    return response;
}

// Submit a guess for a response
function submit() {
    // Elements for the response on the web page are created        
    let div = document.createElement('div');
    let dotResponse = document.createElement('div');
    let textResponse = document.createElement('div');
            
    // The colored dots are copied for the response
    for (let i=0; i<guessDiv.children.length; i++) {
        dotResponse.appendChild(makeDot(guessDiv.children[i].style.backgroundColor));
    }

    // Text is written for the response
    textResponse.className = 'response';
    textResponse.innerText = respond();
    
    // The elements are added to the page and the guess is cleared
    div.appendChild(dotResponse);
    div.appendChild(textResponse);
    historyDiv.appendChild(div);
    clear();
}


//
// The website is built
//

// Put text in the banner
banner.innerText = 'The number of possible codes is: ' + allCodes().length;

// Make the dots that change color
for (let i=0; i<length; i++) {
	guessDiv.appendChild(makeDot('white', 'empty'));
}

// Add a clickable dot for each color
for (let i=0; i < colors.length; i++) {
	let dot = makeDot(colors[i]);
	dot.onclick = function () {
	    addColor(colors[i]);
        // If the code has now been completed, submit it for a response
        if (guessDiv.children[guessDiv.children.length-1].style.backgroundColor != 'white') {
            submit()
        }
	};
	dotsDiv.appendChild(dot);
}

// Add buttons to the page
menu.appendChild(button('Clear', clear));

// The secret code the user will try to guess
secret = random();
