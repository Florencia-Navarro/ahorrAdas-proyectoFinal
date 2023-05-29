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
                <button class="text-xs p-3"onclick="editCategoryInput('${id}')">Editar</button>
                <button class="text-xs p-3" onclick="deleteCategory('${id}')">Eliminar</button>
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
    if(getData("operaciones").length){
        hideElement("#no-operation-img")
    
    for(const {id, descripcion, monto, categoria, fecha} of operations){
        tableOperations +=`
           
        <tr>
            <td class=" py-2 px-8">${descripcion}</td>
            <td class=" py-2 px-8">${categoria}</td>
            <td class=" py-2 px-8">${fecha}</td>
            <td class=" py-2 px-8">${monto}</td>
            <td class="flex flex-row py-2 px-8">
                <button class="text-xs p-3" onclick="editOperationForm('${id}')">Editar</button>
                <button class="text-xs p-3" onclick="deleteOperation('${id}')">Eliminar</button>
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

const saveCategoryData = (categoryId) => {
    return{
        id: categoryId ? categoryId : randomId(),
        nombre: $("#addCategory").value
    }
}

const addCategory = () => {
    const currentCategories = getData("categorias")
    const newCategory = saveCategoryData()
    currentCategories.push(newCategory)
    sendData("categorias", currentCategories)
    //renderCategories(currentCategories)
}


const saveOperationData = (operationId) => {
    return{
        id: operationId ? operationId : randomId(),
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
    //renderOperations(currentOperations)

}

const deleteCategory = (id) => {
    currentCategories = getData("categorias").filter(category => category.id !== id)
    sendData("categorias", currentCategories)
    renderCategories(currentCategories)
}

const deleteOperation = (id) => {
    currentOperations = getData("operaciones").filter(operation => operation.id !== id)
    sendData("operaciones", currentOperations)
    renderOperations(currentOperations)
}

const editCategory = () => {
    const categoryId = $("#btn-edit-category").getAttribute("data-id")
    const editCategories = getData("categorias").map(category => {
        if(category.id === categoryId){
            return saveCategoryData()
        }
        return category
    })
    sendData("categorias", editCategories)
}

const editCategoryInput = (id) => {
    hideElement("#balance-section")
    hideElement("#filters-section")
    hideElement("#operations-section")
    hideElement("#btn-open-menu")
    hideElement("#reports-section")
    hideElement("#new-operation")
    hideElement("#btn-add-category")
    hideElement("#categories-table-cont")
    showElement("#edit-categories")
    showElement("#btn-close-menu")
    showElement("#btns-cancel-edit-category")
    $("#btn-edit-category").setAttribute("data-id", id)
    const categorySelected = getData("categorias").find(category => category.id === id)
    $("#addCategory").value = categorySelected.nombre

}

const editOperation = () => {
    const operationid =$("#btn-edit-operation").getAttribute("data-id")
    console.log(operationid)
    const editOperations = getData("operaciones").map(operation => {
        if(operation.id === operationid){
            return saveOperationData(operationid)
        }
        return operation
    })
    sendData("operaciones", editOperations)
    //renderOperations(editOperations)
    console.log(editOperations)
}

const editOperationForm = (id) => {
    hideElement("#balance-section")
    hideElement("#filters-section")
    hideElement("#operations-section")
    hideElement("#edit-categories")
    hideElement("#new-operation-title")
    hideElement("#btns-cancel-add-operation")
    showElement("#new-operation")
    showElement("#edit-operation-title")
    showElement("#btns-cancel-edit-operation")
    $("#btn-edit-operation").setAttribute("data-id", id)
    const operationSelected = getData("operaciones").find(operation => operation.id === id)
    $("#description-input").value = operationSelected.descripcion
    $("#amount-input").valueAsNumber = operationSelected.monto
    $("#expense-profit-select").value = operationSelected.tipo
    $("#category-select").value = operationSelected.categoria
    $("#date-select").value = operationSelected.fecha
}


const initializeApp = () => {

    sendData("categorias", allCategories)
    sendData("operaciones", allOperations)
    sendData("cuentas", [])

    renderCategories(allCategories)
    renderOperations(allOperations)

    const operationsFromLocalStorage = getData("operaciones")

    if (operationsFromLocalStorage.length > 0) {
        renderOperations(operationsFromLocalStorage)
        showElement("#table-operation-cont")
        hideElement("#no-operation-img")
      } else {
        hideElement("#table-operation-cont")
        showElement("#no-operation-img")
      }

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
        renderCategories(getData("categorias"))
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
        renderOperations(getData("operaciones"))
    })

    $("#btn-edit-category").addEventListener("click", (e) => {
        e.preventDefault()
        hideElement("#btn-edit-cancel-category")
        hideElement("#btn-edit-category")
        showElement("#categories-table-cont")
        showElement("#btn-add-category")
        editCategory()
        renderCategories(getData("categorias"))
    })

    $("#btn-edit-operation").addEventListener("click", (e) => {
        e.preventDefault()
        hideElement("#new-operation")
        showElement("#balance-section")
        showElement("#filters-section")
        showElement("#operations-section")
        editOperation()
        renderOperations(getData("operaciones"))
    })

    $("#btns-cancel-add-operation").addEventListener("click", (e) => {
        e.preventDefault()
        showElement("#balance-section")
        showElement("#filters-section")
        showElement("#operations-section")
        hideElement("#new-operation")
    })

    $("#btn-edit-cancel-operations").addEventListener("click", (e) => {
        e.preventDefault()
        showElement("#balance-section")
        showElement("#filters-section")
        showElement("#operations-section")
        hideElement("#new-operation")
    });
    

}

window.addEventListener("load", initializeApp)