interface CustomRecord {
    user?: {
        name: {
            first: string
            last: string
        }
    }
    upvotes: number
    text: string
}

interface PaginationInfo {
    total_count: number
    current_page: number
    per_page: number
    total_pages: number
}

function createAuthorElement(record: CustomRecord): HTMLDivElement {
    let user = record.user || { 'name': { 'first': '', 'last': '' } }
    let authorElement = document.createElement('div')
    authorElement.classList.add('author-name')
    authorElement.innerHTML = user.name.first + ' ' + user.name.last
    return authorElement
}

function createUpvotesElement(record: CustomRecord): HTMLDivElement {
    let upvotesElement = document.createElement('div')
    upvotesElement.classList.add('upvotes')
    upvotesElement.innerHTML = record.upvotes.toString()
    return upvotesElement
}

function createFooterElement(record: CustomRecord): HTMLDivElement {
    let footerElement = document.createElement('div')
    footerElement.classList.add('item-footer')
    footerElement.append(createAuthorElement(record))
    footerElement.append(createUpvotesElement(record))
    return footerElement
}

function createContentElement(record: CustomRecord): HTMLDivElement {
    let contentElement = document.createElement('div')
    contentElement.classList.add('item-content')
    contentElement.innerHTML = record.text
    return contentElement
}

function createListItemElement(record: CustomRecord): HTMLDivElement {
    let itemElement = document.createElement('div')
    itemElement.classList.add('facts-list-item')
    itemElement.append(createContentElement(record))
    itemElement.append(createFooterElement(record))
    return itemElement
}

function renderRecords(records: CustomRecord[]): void {
    let factsList = document.querySelector('.facts-list') as HTMLDivElement
    factsList.innerHTML = ''
    for (let i = 0; i < records.length; i++) {
        factsList.append(createListItemElement(records[i]))
    }
}

function setPaginationInfo(info: PaginationInfo): void {
    document.querySelector('.total-count')!.innerHTML = info.total_count.toString()
    let start = info.total_count && (info.current_page - 1) * info.per_page + 1
    document.querySelector('.current-interval-start')!.innerHTML = start.toString()
    let end = Math.min(info.total_count, start + info.per_page - 1)
    document.querySelector('.current-interval-end')!.innerHTML = end.toString()
}

function createPageBtn(page: number, classes: string[] = []): HTMLButtonElement {
    let btn = document.createElement('button')
    classes.push('btn')
    for (let cls of classes) {
        btn.classList.add(cls)
    }
    btn.dataset.page = page.toString()
    btn.innerHTML = page.toString()
    return btn
}

function renderPaginationElement(info: PaginationInfo): void {
    let btn: HTMLButtonElement
    let paginationContainer = document.querySelector('.pagination') as HTMLDivElement
    paginationContainer.innerHTML = ''

    btn = createPageBtn(1, ['first-page-btn'])
    btn.innerHTML = 'Первая страница'
    if (info.current_page == 1) {
        btn.style.visibility = 'hidden'
    }
    paginationContainer.append(btn)

    let buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('pages-btns')
    paginationContainer.append(buttonsContainer)

    let start = Math.max(info.current_page - 2, 1)
    let end = Math.min(info.current_page + 2, info.total_pages)
    for (let i = start; i <= end; i++) {
        btn = createPageBtn(i, i == info.current_page ? ['active'] : [])
        buttonsContainer.append(btn)
    }

    btn = createPageBtn(info.total_pages, ['last-page-btn'])
    btn.innerHTML = 'Последняя страница'
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hidden'
    }
    paginationContainer.append(btn)
}

function downloadData(page = 1): void {
    let factsList = document.querySelector('.facts-list') as HTMLDivElement
    let url = new URL(factsList.dataset.url!)
    let perPage = (document.querySelector('.per-page-btn') as HTMLInputElement).value
    url.searchParams.append('page', page.toString())
    url.searchParams.append('per-page', perPage)
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url.toString())
    xhr.responseType = 'json'
    xhr.onload = function () {
        renderRecords(this.response.records)
        setPaginationInfo(this.response['_pagination'])
        renderPaginationElement(this.response['_pagination'])
    }
    xhr.send()
}

function perPageBtnHandler(event: Event): void {
    downloadData(1)
}

function pageBtnHandler(event: Event): void {
    if ((event.target as HTMLElement).dataset.page) {
        downloadData(parseInt((event.target as HTMLElement).dataset.page!))
        window.scrollTo(0, 0)
    }
}

function searchBtnHandler():void {
    let url = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru/facts")
    const searchData = (document.querySelector('search-field') as HTMLInputElement).value
    url.searchParams.append('q', searchData.toString())
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url.toString())
    xhr.responseType = 'json'
    xhr.onload = function () {
        renderRecords(this.response.records)
        setPaginationInfo(this.response['_pagination'])
        renderPaginationElement(this.response['_pagination'])
    }
    xhr.send()
}

function getAutocompleteData(): void{
    let url = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru/autocomplete")
    const currentData = (document.getElementsByClassName('search-field')[0] as HTMLInputElement).value
    url.searchParams.append('q', currentData.toString())
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url.toString())
    xhr.responseType = 'text'
    xhr.onload = function () {
        setAutocompleteData(JSON.parse(xhr.response))
    }
    xhr.send()
}



function setAutocompleteData(data: string[]){
    const input = document.getElementById("autocomplete-input") as HTMLInputElement
    const autocompleteList = document.getElementById("autocomplete-list")
    
    if (!autocompleteList) return

    function setBorder(){
        if (!autocompleteList) return
        autocompleteList.style.border = "5px solid #e63946"
        autocompleteList.style.borderTop = "none"
        input.style.borderBottom = "none"
    }
    
    function delBorder(){
        if (!autocompleteList) return
        autocompleteList.style.border = "none"
        input.style.borderBottom = "5px solid #e63946"
    }

    if (!data || data.length == 0){
        autocompleteList.innerHTML = ""
        delBorder()
    } else {
        setBorder()
    }
    
    input.addEventListener("keyup", function (event: KeyboardEvent) {
        if (event.key === "Enter") return
        autocompleteList.innerHTML = "" 

        for (let str of data) {
            const listItem = document.createElement("li")
            listItem.classList.add("autocomplete-item")
            listItem.textContent = str

            listItem.addEventListener("click", function () {
                input.value = str
                autocompleteList.innerHTML = ""
                delBorder()
            })

            autocompleteList.appendChild(listItem)
        }
    })
}

window.onload = function () {
    downloadData()
    
    const paginationElement = document.querySelector('.pagination') as HTMLElement
    if (paginationElement) {
        paginationElement.onclick = pageBtnHandler
    }

    const perPageBtn = document.querySelector('.per-page-btn') as HTMLElement
    if (perPageBtn) {
        perPageBtn.onchange = perPageBtnHandler
    }

    function searchHandler(){
        const autocompleteList = document.getElementById("autocomplete-list")
        const input = document.getElementById("autocomplete-input") as HTMLInputElement
        if (autocompleteList) autocompleteList.innerHTML = ""
        if (!autocompleteList) return

        autocompleteList.style.border = "none"
        input.style.borderBottom = "5px solid #e63946"

        let url = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru/facts")
        const searchData = (document.getElementsByClassName('search-field')[0] as HTMLInputElement).value
        url.searchParams.append('q', searchData.toString())
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url.toString())
        xhr.responseType = 'json'
        xhr.onload = function () {
            renderRecords(this.response.records)
            setPaginationInfo(this.response['_pagination'])
            renderPaginationElement(this.response['_pagination'])
        }
        xhr.send()
        input.value = ""
    }

    function handleEnterKey(event: KeyboardEvent) {
        if (event.key === "Enter") {
            searchHandler();
        }
    }

    const searchBtn = document.querySelector('.search-btn')
    searchBtn?.addEventListener('click', searchHandler)

    const inputElement = document.getElementById("autocomplete-input");
    inputElement?.addEventListener("keydown", handleEnterKey);


    const autocomplete = document.getElementsByClassName('search-field')[0] as HTMLInputElement
    autocomplete.addEventListener('input', function () {
        getAutocompleteData()
    })

    
    // if (autocompleteList?.innerHTML)
    document.getElementById("autocomplete-list")!.style.width = document.getElementById("input-container")?.offsetWidth! - 10 + "px"
}

