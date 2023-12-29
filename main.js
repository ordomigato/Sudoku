let numSelected = null;
let tileSelected = null;
let darkMode = false;

let errors = 0;
let correct = 0;

const numbersFoundMap = new Map();

const board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
]

const solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]


// GAME SETUP
window.onload = function() {
    setGame();
}

addEventListener('keypress', (e) => {
    if (['1','2','3','4','5','6','7','8','9'].includes(e.key)) {
        selectNumber(e.key)
    }
})

function setGame() {
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", (e) => selectNumber(e.target.id));
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    selectNumber("1");

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                console.log(board[r][c])
                numbersFoundMap.set(board[r][c], numbersFoundMap.get(board[r][c]) ? numbersFoundMap.get(board[r][c]) + 1 : 1)
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("bottom-line");
            }
            if (r == 3 || r == 6) {
                tile.classList.add("top-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("right-line");
            }
            if (c == 3 || c == 6) {
                tile.classList.add("left-line");
            }
            tile.addEventListener("mouseover", (e) => {
                if (isCompleteTile(e.target.classList)) {
                    // nothing
                } else {
                    tile.classList.add('placeholder')
                    const div = document.createElement("div")
                    div.innerHTML = numSelected.id
                    tile.appendChild(div)
                }
            })
            tile.addEventListener("mouseout", (e) => {
                if (isCompleteTile(e.target.classList)) {
                    // nothing
                } else {
                    tile.classList.remove('placeholder')
                    tile.innerText = ""
                }
            })
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber(number){
    if (numCompletionCheck(number)) {
        return
    }
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    const el = document.getElementById(number)
    numSelected = el
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (isCompleteTile(this.classList)) {
            return;
        }

        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.classList.add("tile-complete");
            correct += 1;
            this.innerHTML = ''
            this.classList.add('success');
            numbersFoundMap.set(numSelected.id, numbersFoundMap.get(numSelected.id) ? numbersFoundMap.get(numSelected.id) + 1 : 1)
            const isComplete = numCompletionCheck(numSelected.id)
            if (isComplete) {
                disableDigit(numSelected.id)
            }
            setTimeout(() => {
                this.classList.remove('success');
                this.classList.remove('placeholder');
                this.innerText = numSelected.id;
            }, 1000)
        }
        else {
            errors += 1;
            this.innerHTML = ''
            this.classList.add('error');
            setTimeout(() => {
                this.classList.remove('error');
            }, 1000)
            document.getElementById("errors").innerText = errors;
        }
    }
}

function isCompleteTile(classList) {
    return classList.contains('tile-complete') || classList.contains('tile-start')
}

// check if all of a single number has been found.
function numCompletionCheck(digit) {
    return numbersFoundMap.get(digit) === 9
}

function disableDigit(digit) {
    document.getElementById(digit).classList.add('complete')
    const nextDigit = document.querySelector('#digits .number:not(.complete)')
    selectNumber(nextDigit.id)
}


// DARK MODE SETTINGS
const darkModeSwitchEl = document.getElementById('dark-mode-switch')
darkModeSwitchEl.addEventListener("change", switchTheme)

function switchTheme() {
    let root = document.querySelector(':root');
    if (this.checked) {
        root.style.setProperty('--main-bg-color', '#222')
        root.style.setProperty('--font-color', '#fff')
        root.style.setProperty('--border-color', '#444')
        root.style.setProperty('--tile-start-color', '#333')
        root.style.setProperty('--number-selected-bg-color', 'gray')
        root.style.setProperty('--number-selected-color', '#fff')
        root.style.setProperty('--success-color', 'green')
        root.style.setProperty('--error-color', 'red')
    } else {
        root.style.setProperty('--main-bg-color', '#fff')
        root.style.setProperty('--font-color', '#000')
        root.style.setProperty('--border-color', 'lightgray')
        root.style.setProperty('--tile-start-color', 'whitesmoke')
        root.style.setProperty('--number-selected-bg-color', 'gray')
        root.style.setProperty('--number-selected-color', '#fff')
        root.style.setProperty('--success-color', '#F1EDE3')
        root.style.setProperty('--error-color', '#F7BEC0')
    }
}

// Draggable Controller && options menu
let initX, initY, firstX, firstY;
const controller = document.getElementById('controller')
const optionsMenu = document.getElementById('options')
const gameContainer = document.getElementById('game-container')

function resetPlacement() {
    let maxLeftControllerOffset = window.innerWidth - controller.offsetWidth;
    
    controller.style.top = 0;
    controller.style.left = maxLeftControllerOffset;
    optionsMenu.style.top = 0;
    optionsMenu.style.left = 0;
}
resetPlacement()

controller.addEventListener('mousedown', mouseDownDragIt)
controller.addEventListener('touchstart', touchstartSwipIt);

optionsMenu.addEventListener('mousedown', mouseDownDragIt)
optionsMenu.addEventListener('touchstart', touchstartSwipIt);

function mouseDownDragIt(e) {
    e.preventDefault();
    initX = this.offsetLeft;
	initY = this.offsetTop;
	firstX = e.pageX;
	firstY = e.pageY;

    this.addEventListener('mousemove', dragIt, false);

	window.addEventListener('mouseup', function() {
		this.removeEventListener('mousemove', dragIt, false);
	}.bind(this), false);
}

function touchstartSwipIt(e) {
	e.preventDefault();
	initX = this.offsetLeft;
	initY = this.offsetTop;
	var touch = e.touches;
	firstX = touch[0].pageX;
	firstY = touch[0].pageY;

	this.addEventListener('touchmove', swipeIt, false);

	window.addEventListener('touchend', function(e) {
		e.preventDefault();
		controller.removeEventListener('touchmove', swipeIt, false);
	}, false);

}

function dragIt(e) {
    const maxLeftOffset = window.innerWidth - this.offsetWidth;
    const maxTopOffset = window.innerHeight - this.offsetHeight;
    // don't let the component go beyond the windows width
    const isToLeft = initX+e.pageX-firstX <= 0;
    const isToRight = initX+e.pageX-firstX >= maxLeftOffset
    if (isToRight) {
        this.style.left = maxLeftOffset
    } else if (isToLeft) {
        this.style.left = 0
    } else {
        this.style.left = initX+e.pageX-firstX + 'px';
    }
    // don't let the component go beyond the windows height
    const isAtBottom = initY+e.pageY-firstY + this.offsetHeight > window.innerHeight
    const isAtTop = initY+e.pageY-firstY <= 0
    if (isAtTop) {
        this.style.top = 0 + 'px';
    } else if (isAtBottom) {
        this.style.top = maxTopOffset + 'px';
        this.style.top = parseInt(this.style.top) - 1 + 'px'; 
    } else {
        this.style.top = initY+e.pageY-firstY + 'px';
    }
}

function swipeIt(e) {
	var contact = e.touches;
	this.style.left = initX+contact[0].pageX-firstX + 'px';
	this.style.top = initY+contact[0].pageY-firstY + 'px';
}

window.addEventListener("resize", (event) => {
    resetPlacement()
});
