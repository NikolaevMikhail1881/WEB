// let- Директива, позволяет объявить локальную переменную с областью видимости, ограниченной текущим блоком кода
// push добавляет элемент в конец.
// pop удаляет последний элемент.
// join ()- Метод, объединяет все элементы массива в одну строку, используя определенный разделитель, который передается через параметр
// sort ()-Метод, сортирует массив по возрастанию
// contains - метод, позволяет проверить, содержит ли один элемент внутри себя другой.




// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.


function priority(operation) { 
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2; // болший приоритет 
    }
} 

// Проверка, является ли строка str числом.


function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);      // регулярное выражение 
}

// Проверка, является ли строка str цифрой.


function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.


function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') { // проверяет 1 символ char - 
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).


function compile(str) {     
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).
// Алгоритм Дейкстры - считает результат из инфиксной анотации в польскую 

function evaluate(str) {
    //alert(str);
    let n = str.length;
    let stack = [];
    for (token of tokenize(str))
    {
        if (isNumeric(token)) {
            stack.push(token);
        }
        else if (token == '+')
        {
            var a = Number(stack.pop());
            var b = Number(stack.pop());
            var res = a + b;
            stack.push(res);
        }
        else if (token == '*')
        {
            var a = Number(stack.pop());
            var b = Number(stack.pop());
            var res = a * b;
            stack.push(res);
        }
        else if (token == '-')
        {
            var a = Number(stack.pop());
            var b = Number(stack.pop()); 
            var res = b - a;
            stack.push(res);
        }
        else if (token == '/')
        {
            var a = Number(stack.pop());
            var b = Number(stack.pop());
            var res = b / a;
            stack.push(res);
        }
    }
    return stack.pop();
}

// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённогваго выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.


function clickHandler(event) {

    const buttonValue = event.target.innerText;
    let screen = document.querySelector('.answer');
    if (event.target.classList.contains('clear'))
    {
        screen.textContent = "";
    }
    else if (event.target.classList.contains('result'))
    {
        let str = screen.textContent;
        str.toString();
        screen.textContent = evaluate(compile(str)).toString();

    }
    else if (event.target.classList.contains('key')) {
        screen.textContent += buttonValue;
      }
}


// Назначьте нужные обработчики событий.


window.onload = function () {
    document.querySelector('.buttons').addEventListener('click', function (event) {
        clickHandler(event);
    });

    //evaluate(compile("(1+2)*3 / (4 + 4)"));
};