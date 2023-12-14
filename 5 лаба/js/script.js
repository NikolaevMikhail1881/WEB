"use strict";
function createAuthorElement(record) {
    let user = record.user || { 'name': { 'first': '', 'last': '' } };
    let authorElement = document.createElement('div');
    authorElement.classList.add('author-name');
    authorElement.innerHTML = user.name.first + ' ' + user.name.last;
    return authorElement;
}
function createUpvotesElement(record) {
    let upvotesElement = document.createElement('div');
    upvotesElement.classList.add('upvotes');
    upvotesElement.innerHTML = record.upvotes.toString();
    return upvotesElement;
}
function createFooterElement(record) {
    let footerElement = document.createElement('div');
    footerElement.classList.add('item-footer');
    footerElement.append(createAuthorElement(record));
    footerElement.append(createUpvotesElement(record));
    return footerElement;
}
function createContentElement(record) {
    let contentElement = document.createElement('div');
    contentElement.classList.add('item-content');
    contentElement.innerHTML = record.text;
    return contentElement;
}
function createListItemElement(record) {
    let itemElement = document.createElement('div');
    itemElement.classList.add('facts-list-item');
    itemElement.append(createContentElement(record));
    itemElement.append(createFooterElement(record));
    return itemElement;
}
function renderRecords(records) {
    let factsList = document.querySelector('.facts-list');
    factsList.innerHTML = '';
    for (let i = 0; i < records.length; i++) {
        factsList.append(createListItemElement(records[i]));
    }
}
function setPaginationInfo(info) {
    document.querySelector('.total-count').innerHTML = info.total_count.toString();
    let start = info.total_count && (info.current_page - 1) * info.per_page + 1;
    document.querySelector('.current-interval-start').innerHTML = start.toString();
    let end = Math.min(info.total_count, start + info.per_page - 1);
    document.querySelector('.current-interval-end').innerHTML = end.toString();
}
function createPageBtn(page, classes = []) {
    let btn = document.createElement('button');
    classes.push('btn');
    for (let cls of classes) {
        btn.classList.add(cls);
    }
    btn.dataset.page = page.toString();
    btn.innerHTML = page.toString();
    return btn;
}
function renderPaginationElement(info) {
    let btn;
    let paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';
    btn = createPageBtn(1, ['first-page-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);
    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('pages-btns');
    paginationContainer.append(buttonsContainer);
    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i = start; i <= end; i++) {
        btn = createPageBtn(i, i == info.current_page ? ['active'] : []);
        buttonsContainer.append(btn);
    }
    btn = createPageBtn(info.total_pages, ['last-page-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);
}
function downloadData(page = 1) {
    let factsList = document.querySelector('.facts-list');
    let url = new URL(factsList.dataset.url);
    let perPage = document.querySelector('.per-page-btn').value;
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per-page', perPage);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url.toString());
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderRecords(this.response.records);
        setPaginationInfo(this.response['_pagination']);
        renderPaginationElement(this.response['_pagination']);
    };
    xhr.send();
}
function perPageBtnHandler(event) {
    downloadData(1);
}
function pageBtnHandler(event) {
    if (event.target.dataset.page) {
        downloadData(parseInt(event.target.dataset.page));
        window.scrollTo(0, 0);
    }
}
function searchBtnHandler() {
    let url = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru/facts");
    const searchData = document.querySelector('search-field').value;
    url.searchParams.append('q', searchData.toString()); 
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url.toString());
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderRecords(this.response.records);
        setPaginationInfo(this.response['_pagination']);
        renderPaginationElement(this.response['_pagination']);
    };
    xhr.send();
}
function getAutocompleteData() { // функция получения данных для автозаполнения с api -(программный интерфейс для взаимодействия)
    let url = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru/autocomplete"); // создание переменной url
    const currentData = document.getElementsByClassName('search-field')[0].value; // текущее значение поля поиска 
    url.searchParams.append('q', currentData.toString()); // добавление в url параметра q со значением поля поиска 
    let xhr = new XMLHttpRequest();  // создание xhr - xml httl request 
    xhr.open('GET', url.toString()); // подготовка гет запроса на url 
    xhr.responseType = 'text'; // тип ответа - текст 
    xhr.onload = function () { // при получении ответа сработает функция 
        setAutocompleteData(JSON.parse(xhr.response)); // вызов функции 
    };
    xhr.send(); // выполнить запрос 
}
function setAutocompleteData(data) { // функция установки данных автозаполнения 
    const input = document.getElementById("autocomplete-input"); // получение элемента 
    const autocompleteList = document.getElementById("autocomplete-list"); // получение элемента 
    if (!autocompleteList) // если лист пустой 
        return; // выход 
    function setBorder() { // функция постановки границ окна подсказки 
        if (!autocompleteList) // если лист пустой 
            return; // выход
        autocompleteList.style.border = "5px solid #e63946";
        autocompleteList.style.borderTop = "none";
        input.style.borderBottom = "none";
    }
    function delBorder() { // // функция удаления границ окна подсказки
        if (!autocompleteList) // если лист пустой 
            return; // выход
        autocompleteList.style.border = "none";
        input.style.borderBottom = "5px solid #e63946";
    }
    if (!data || data.length == 0) { // если дата пустая (дополнений нет) 
        autocompleteList.innerHTML = ""; // автозаполнение пустое 
        delBorder(); // удаление границ 
    }
    else {
        setBorder(); // создание границ 
    }
    input.addEventListener("keyup", function (event) { // при отпускании кнопки 
        if (event.key === "Enter") // кнопки ентер 
            return; // выход 
        autocompleteList.innerHTML = ""; // обнуление 
        for (let str of data) { // проход по значениям данных 
            const listItem = document.createElement("li"); // создание элемента списка 
            listItem.classList.add("autocomplete-item"); // добавление класса 
            listItem.textContent = str; // добавление в элемент контента 
            listItem.addEventListener("click", function () { // добавление события по клику 
                input.value = str; // подставление в строку ввода значения автодополнения 
                autocompleteList.innerHTML = ""; // обнуление 
                delBorder(); // удаление границ 
            });
            autocompleteList.appendChild(listItem); // добавление в автозаполнение элемента 
        }
    });
}
window.onload = function () { // момент загрузки окна 
    var _a; 
    downloadData(); // вызов функции 
    const paginationElement = document.querySelector('.pagination'); // получение элементов с классом 
    if (paginationElement) { // если элемент существует 
        paginationElement.onclick = pageBtnHandler; // при клике сработает обработчик pageBtnHandler
    }
    const perPageBtn = document.querySelector('.per-page-btn'); //  получение элементов с классом
    if (perPageBtn) { // если элемент существует
        perPageBtn.onchange = perPageBtnHandler; // при изменении сработает обработчик perPageBtnHandler
    }
    function searchHandler() { // обработчик поиска searchHandler - кнопка поиска
        const autocompleteList = document.getElementById("autocomplete-list"); // получение элемента с классом 
        const input = document.getElementById("autocomplete-input"); // получение элемента с классом 
        if (autocompleteList) // если лист существует 
            autocompleteList.innerHTML = ""; // обнуление 
        if (!autocompleteList) // если его нет 
            return; // выход 
        autocompleteList.style.border = "none"; // скрытие границы 
        input.style.borderBottom = "5px solid #e63946"; // нижняя граница 
        let url = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru/facts"); // создание url 
        const searchData = document.getElementsByClassName('search-field')[0].value; // получение значения первого элемента в классе 
        url.searchParams.append('q', searchData.toString()); // добавление параметра q  со значением  searchData в url
        let xhr = new XMLHttpRequest(); // создание xhr - xml httl request 
        xhr.open('GET', url.toString()); // подготовка гет запроса на url
        xhr.responseType = 'json'; // тип ответа json 
        xhr.onload = function () { // когда получен ответ от сервера 
            renderRecords(this.response.records); 
            setPaginationInfo(this.response['_pagination']);                      // выполняются три функции 
            renderPaginationElement(this.response['_pagination']);
        };
        xhr.send(); // выполнить запрос 
        input.value = "";  // обнуление инпута
    }
    function handleEnterKey(event) { // обработка нажатия энтера
        if (event.key === "Enter") { // если нажали энтер 
            searchHandler(); // выполняется 
        }
    }
    const searchBtn = document.querySelector('.search-btn'); // получение кнопки поиска 
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', searchHandler); // проверка на null (существование)
    const inputElement = document.getElementById("autocomplete-input"); // получение строки поиска 
    inputElement === null || inputElement === void 0 ? void 0 : inputElement.addEventListener("keydown", handleEnterKey); // добавление eventlistener если строка поиска не null или undefined 
    const autocomplete = document.getElementsByClassName('search-field')[0]; // получение строки поиска 
    autocomplete.addEventListener('input', function () { // добавляем слушателя событий 
        getAutocompleteData(); // вызывается функция автозаполнения
    });
    // if (autocompleteList?.innerHTML)
    document.getElementById("autocomplete-list").style.width = ((_a = document.getElementById("input-container")) === null || _a === void 0 ? void 0 : _a.offsetWidth) - 10 + "px"; // изменение ширины 
};
