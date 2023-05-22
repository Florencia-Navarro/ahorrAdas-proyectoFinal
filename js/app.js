const $ = (selector) => document.querySelector(selector)

/* -----aux----- */

const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")
const cleanContainer = (selector) => $(selector).innerHTML = ""

const randomId = () => self.crypto.randomUUID()

const getData = (key) => JSON.parse(localStorage.getItem(key))
const sendData = (key, array) => localStorage.setItem(key, JSON.stringify(array))

const allCategories = getData("categorias")

/* ----- RENDER ----- */

const renderCategories = (categories) => {
    cleanContainer("#categories-table")
    for(const {id, nombre} of categories){
        $("#categories-table").innerHTML += 
         `
        <tr>
            <td class=" py-2 pr-8">${nombre}</td>
            <td class="flex flex-row py-2 px-8">
                <button class="text-xs p-3">Editar</button>
                <button class="text-xs p-3">Eliminar</button>
            </td>
                        
        </tr>
        `
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

console.log(allCategories)

const operations = []

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
    
const calculations = []

const initializeApp = () => {

    sendData("categorias", allCategories)
    sendData("operaciones", operations)
    sendData("cuentas", calculations)

    renderCategories(allCategories)

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

}

window.addEventListener("load", initializeApp)