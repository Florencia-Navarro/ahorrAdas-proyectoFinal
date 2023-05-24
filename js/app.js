const $ = (selector) => document.querySelector(selector)

/* -----aux----- */

const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")
const cleanContainer = (selector) => $(selector).innerHTML = ""

const randomId = () => self.crypto.randomUUID()

const getData = (key) => JSON.parse(localStorage.getItem(key))
const sendData = (key, array) => localStorage.setItem(key, JSON.stringify(array))

const categories = [
    {
        id: randomId(),
        nombre: "Comida"
    },
    {
        id: randomId(),
        nombre: "Servicios"
    },
    {
        id: randomId(),
        nombre: "Salidas"
    },
    {
        id: randomId(),
        nombre: "Educacion"
    },
    {
        id: randomId(),
        nombre: "Transporte"
    },
    {
        id: randomId(),
        nombre: "Trabajo"
    }
]

const allCategories = getData("categorias") || categories
const allOperations = getData("operaciones") || []

/* ----- RENDER ----- */

const renderCategories = (categories) => {
    cleanContainer("#categories-table-cont")
    $("#categories-table-cont").classList.add("w-full")
    let tablecategories = `<table class="w-11/12 m-3.5>`

    for(const {id, nombre} of categories){
        tablecategories += 
         `
        <tr>
            <td class=" py-2 px-5">${nombre}</td>
            <td class="flex flex-row py-2 px-2">
                <button class="text-xs p-3">Editar</button>
                <button class="text-xs p-3">Eliminar</button>
            </td>
                        
        </tr>
        `
    }
    tablecategories += `</table>`

    $("#categories-table-cont").innerHTML = tablecategories
}

const renderOperations = (operations) => {
    cleanContainer("#table-operation-cont")
    $("#table-operation-cont").classList.add("w-full")
    let tableOperations = `
    <table class="w-full">
        <thead>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Acciones</th>
        </thead>
    `
    if(allOperations.length){
        hideElement("#no-operation-img")
    
    for(const {id, descripcion, monto, categoria, fecha} of operations){
        tableOperations +=`
           
        <tr>
            <td class=" py-2 px-8">${descripcion}</td>
            <td class=" py-2 px-8">${categoria}</td>
            <td class=" py-2 px-8">${fecha}</td>
            <td class=" py-2 px-8">${monto}</td>
            <td class="flex flex-row py-2 px-8">
                <button class="text-xs p-3">Editar</button>
                <button class="text-xs p-3">Eliminar</button>
            </td>
        </tr>
        `
    }
    tableOperations +=` </table> `

    $("#table-operation-cont").innerHTML = tableOperations
}else{
    showElement("#no-operation-img")
}
}

/* -----  ----- */

const saveCategoryData = () => {
    return{
        id: randomId(),
        nombre: $("#addCategory").value
    }
}

const addCategory = () => {
    const currentCategories = getData("categorias")
    const newCategory = saveCategoryData()
    currentCategories.push(newCategory)
    sendData("categorias", currentCategories)
    renderCategories(currentCategories)
}

/* const addData = (key, callback) => {
    const currentData = getData(key)
    const newData = callback
    currentData.push(newData)
    sendData(key, currentData)
    render
} */

const saveOperationData = () => {
    return{
        id: randomId(),
        descripcion: $("#description-input").value,
        monto: $("#amount-input").valueAsNumber,
        tipo: $("#expense-profit-select").value,
        categoria: $("#category-select").value,
        fecha: $("#date-select").value 
    }
}

const addOperation = () => {
    const currentOperations = getData("operaciones")
    const newOperation = saveOperationData()
    currentOperations.push(newOperation)
    sendData("operaciones", currentOperations)
    renderOperations(currentOperations)

}



const initializeApp = () => {

    sendData("categorias", allCategories)
    sendData("operaciones", allOperations)
    sendData("cuentas", [])

    renderCategories(allCategories)
    renderOperations(allOperations)

    $("#btn-open-menu").addEventListener("click", () => {
        showElement("#btn-close-menu")
        hideElement("#btn-open-menu")
        showElement("#dropdown-menu")
    })

    $("#btn-close-menu").addEventListener("click", () => {
        showElement("#btn-open-menu")
        hideElement("#btn-close-menu")
        hideElement("#dropdown-menu")
    })

    $("#btn-hide-filters").addEventListener("click", () => {
        hideElement("#btn-hide-filters")
        hideElement("#filters-container")
        showElement("#btn-show-filters")
    })

    $("#btn-show-filters").addEventListener("click", () => {
        hideElement("#btn-show-filters")
        showElement("#filters-container")
        showElement("#btn-hide-filters")
    })

    $("#btn-categories").addEventListener("click", () => {
        hideElement("#balance-section")
        hideElement("#filters-section")
        hideElement("#operations-section")
        hideElement("#btn-open-menu")
        hideElement("#reports-section")
        hideElement("#new-operation")
        showElement("#edit-categories")
        showElement("#btn-close-menu")
    })

    $("#btn-reports").addEventListener("click", () => {
        hideElement("#balance-section")
        hideElement("#filters-section")
        hideElement("#operations-section")
        hideElement("#edit-categories")
        hideElement("#btn-open-menu")
        hideElement("#new-operation")
        showElement("#reports-section")
        showElement("#btn-close-menu")
    })
    $("#btn-new-operation").addEventListener("click", () => {
        hideElement("#balance-section")
        hideElement("#filters-section")
        hideElement("#operations-section")
        hideElement("#edit-categories")
        showElement("#new-operation")

    })

    $("#btn-add-category").addEventListener("click", (e) => {
        e.preventDefault()
        addCategory()
    })

    $("#add-new-operation").addEventListener("click", (e) => {
        e.preventDefault()
        showElement("#balance-section")
        showElement("#filters-section")
        showElement("#operations-section")
        showElement("#table-operation-cont")
        hideElement("#new-operation")
        hideElement("#no-operation-img")
        addOperation()
    })

}

window.addEventListener("load", initializeApp)