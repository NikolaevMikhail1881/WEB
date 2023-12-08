// сonst - Как и в случае с let, у оператора блочная область видимости, однако переназначить его нельзя.
// cells - Свойство хранит коллекцию ячеек
const cells = document.querySelectorAll(".cell"); // 9 клеток - выбираю все с классом cell 
const statusText = document.querySelector("#statusText"); // Результат игры 
const restartBtn = document.querySelector("#restartBtn"); // Играть снова 
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],                // все выиграшные положения 
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];   // пустое поле для начала 
let currentPlayer = "X"; // первый игрок начинает за х 
let running = false; // флаг на продолжение игры 

initializeGame();     // вызов инициализации игры 
 
function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked)); // ожидание нажатия - активации кнопки - вызов функции по нажатию
    restartBtn.addEventListener("click", restartGame); // нажатие кнопки 
    statusText.textContent = `${currentPlayer}'s turn`; // очередь игрока 
    running = true; // активируем флаг - начинаем игру 
}
function cellClicked(){ // функция которая вызывается при нажатии на ячейку 
    const cellIndex = this.getAttribute("cellIndex");  // получаю номер ячейки 

    if(options[cellIndex] != "" || !running){  // если ячейка занята - возвращает к прошлой функции 
        return;
    }

    updateCell(this, cellIndex); // присваивает ячейке новое значение 
    checkWinner(); // проверка на выигрыш 
}
function updateCell(cell, index){ 
    options[index] = currentPlayer; // применяется js - ставит в массив 0 или х
    cell.textContent = currentPlayer; // применяется в html - ставит х или о 
}
function changePlayer(){ // смена игрок 
    currentPlayer = (currentPlayer == "X") ? "O" : "X"; // игрок меняется на противоположного    - Тернарный оператор 
    statusText.textContent = `${currentPlayer}'s turn`; // Текст чей ход 
}
function checkWinner(){ // проверка на победу
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){ // цикл проверки выиграшной комбинации переборкой 
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];



        // предотвращает прерывание функции - из - за начально пустах полей 
        if(cellA == "" || cellB == "" || cellC == ""){ // если какая то ячейка пустая  - проверка продолжается 
            continue;
        }
        if(cellA == cellB && cellB == cellC){ // если три поля равны из выиграшныйх положений то активируется флаг на победу 
            roundWon = true;
            break;
        }
    }

    if(roundWon){ // если активирован флаг
        statusText.textContent = `${currentPlayer} wins!`; // выводится победа
        running = false; // конец игры 
    }
    else if(!options.includes("")){ // если все ячейки заполнены и флаг неактивирован 
        statusText.textContent = `Draw!`; // выводится ничья 
        running = false; // конец игры  - переводит флаг в 0 
    }
    else{ // меняет игрока если никто не выиграл и есть пустые поля  
        changePlayer(); 
    }
}
function restartGame(){ // функция рестарта игры  - сброс до начальных настроек 
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}