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

    for ( const { id, nombre } of categories ){
        tablecategories += 
         `
        <tr>
            <td class=" py-2 px-5 text-orange-500">${nombre}</td>
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
    if ( getData("operaciones").length ){
        hideElement("#no-operation-img")
    
    for ( const { id, descripcion, monto, categoria, fecha } of operations ){
        tableOperations +=`
           
        <tr>
            <td class=" py-2 px-8">${descripcion}</td>
            <td class=" py-2 px-8 text-orange-500">${categoria}</td>
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
} else {
    showElement("#no-operation-img")
}
}

const renderProfitsAndExpenses = () => {
    const currentOperations = getData("operaciones")
    let profits = 0
    let expenses = 0

    for ( const { tipo, monto } of currentOperations ){
        if ( tipo === "ganancia" ){
            profits += monto
            
        } else if( tipo === "gasto" ){
            expenses += monto
            $("#expenses").innerHTML = expenses
        }
    } 
    
    let totalBalance = profits - expenses
    $("#profits").innerHTML = profits
    $("#expenses").innerHTML = expenses
    $("#total-balance").innerHTML = totalBalance
}

const renderCategoriesOptions = (categories) => {
    cleanContainer("#categories-select")

    for ( const { id, nombre } of categories ){
        $("#categories-select").innerHTML += `
        <option  value="${nombre}">${nombre}</option>
        `
        $("#category-select").innerHTML += `
        <option  value="${nombre}">${nombre}</option>
        `
    }
}

const validateForm = (input, message) => {
    const description = $(input).value.trim()

    if ( description == "" ){
        showElement(message)
    } else {
        hideElement(message)
    }
    return description !== ""
}


const renderHigherGain = () => {
    const currentOperations = getData("operaciones")
    const filteredOperations = currentOperations.filter( operation => operation.tipo === "ganancia")

    const higherGain = filteredOperations.toSorted((a, b) => {
        if (a.monto < b.monto) return 1
        if (a.monto > b.monto) return -1
        return 0
    })
    $("#highest-earning-category").innerHTML = higherGain[0].categoria
    $("#highest-earning-amount").innerHTML = `+$${higherGain[0].monto}`
    $("#highest-earning-amount").classList.add("text-green-600")
    $("#month-highest-earning").innerHTML = higherGain[0].fecha
    $("#highest-earning-amount2").innerHTML = `+$${higherGain[0].monto}`
    $("#highest-earning-amount2").classList.add("text-green-600")
}

const renderHigherSpending = () => {
    const currentOperations = getData("operaciones")
    const filteredOperations = currentOperations.filter( operation => operation.tipo === "gasto")

    const higherSpending = filteredOperations.toSorted((a, b) => {
        if (a.monto < b.monto) return 1
        if (a.monto > b.monto) return -1
        return 0
    })
    $("#highest-spending-category").innerHTML = higherSpending[0].categoria
    $("#highest-spending-amount").innerHTML = `-$${higherSpending[0].monto}`
    $("#highest-spending-amount").classList.add("text-red-600")
    $("#month-highest-spending").innerHTML = higherSpending[0].fecha
    $("#highest-spending-amount2").innerHTML = `-$${higherSpending[0].monto}`
    $("#highest-spending-amount2").classList.add("text-red-600")
}

const highestBalance = () => {
    const currentOperations = getData("operaciones")
    const resultsByCategory = {}

    for ( const operation of currentOperations ){
        const category = operation.categoria
        const amount = operation.tipo === "ganancia" ? operation.monto : -operation.monto
        if ( !resultsByCategory[category] ){
            resultsByCategory[category] = amount
        } else {
            resultsByCategory[category] += amount
        }
    }

    let highestBalanceCategory = ""
    let highestBalanceValue = 0

    for ( const category in resultsByCategory ){
        const balance = resultsByCategory[category]

        if ( balance > highestBalanceValue ) {
            highestBalanceValue = balance
            highestBalanceCategory = category
        }
    }
    $("#highest-balance-category").innerHTML = highestBalanceCategory
    $("#highest-balance").innerHTML = highestBalanceValue
}

const totalBycategory = () => {
    const currentCategories = getData("operaciones")
    cleanContainer("#total-by-category")
    const resultsByCategory = {}

    for ( const {categoria, tipo, monto} of currentCategories ) {
    const category = categoria
    const amount = tipo === "ganancia" ? monto : -monto

    if ( !resultsByCategory[category] ) {
        resultsByCategory[category] = {
          profit: tipo === "ganancia" ? monto : 0,
          spent: tipo === "gasto" ? monto : 0
        }
      } else {
        resultsByCategory[category].profit += tipo === "ganancia" ? monto : 0
        resultsByCategory[category].spent += tipo === "gasto" ? monto : 0
      }
    
      let totalBycategoryTable = `
        <table class="w-full m-3.5 ">
            <thead>
                <tr>
                    <th class="py-1 px-8">Categoría</th>
                    <th class="py-1 px-8">Ganancia</th>
                    <th class="py-1 px-8">Gasto</th>
                    <th class="py-1 px-8">Balance</th>
                </tr>
            </thead>
            <tbody>
      `
      for ( const category in resultsByCategory ) {
        const profitCategory = resultsByCategory[category].profit
        const spentcategory = resultsByCategory[category].spent
        const balance =  profitCategory - spentcategory
  

    totalBycategoryTable += `
        <tr>
        <td class="py-3 px-8 text-center text-orange-500">${category}</td>
        <td class="py-3 px-8 text-center text-green-600">${profitCategory ? profitCategory : "+$0"}</td>
        <td class="py-3 px-8 text-center text-red-600">${spentcategory ? spentcategory : "-$0"}</td>
        <td class="py-3 px-8 text-center">${balance}</td>

    `
       
    }
    totalBycategoryTable += `</table>`
    $("#total-by-category").innerHTML = totalBycategoryTable

}
}

const totalByMonth = () => {
    const currentOperations = getData("operaciones")
    cleanContainer("#total-by-month")
    const totalMonth = {}

    for ( const operation of currentOperations ) {
        const { fecha, monto, tipo } = operation
        const month = `${new Date(fecha).getMonth() + 1}/${new Date(fecha).getFullYear()}`   

        if ( !totalMonth[month] ) {
            totalMonth[month] = { spent: 0, profit: 0, balance: 0 }
      }

      if ( tipo === "gasto" ) {
        totalMonth[month].spent += monto
      } else if (tipo === "ganancia") {
        totalMonth[month].profit += monto
      }

      totalMonth[month].balance =  totalMonth[month].profit -  totalMonth[month].spent
  
    }

    let totalByMonthTable = `
        <table class="w-full m-3.5 ">
            <thead>
                <tr>
                    <th class="py-1 px-8">Mes</th>
                    <th class="py-1 px-8">Ganancia</th>
                    <th class="py-1 px-8">Gasto</th>
                    <th class="py-1 px-8">Balance</th>
                </tr>
            </thead>
            <tbody>
      `
      for ( const month in totalMonth ) {
        const profitMonth = totalMonth[month].profit
        const spentMonth = totalMonth[month].spent
        const balance =  profitMonth - spentMonth

        totalByMonthTable += `
        <tr>
        <td class="py-3 px-8 text-center">${month}</td>
        <td class="py-3 px-8 text-center text-green-600">${profitMonth ? profitMonth : "+$0"}</td>
        <td class="py-3 px-8 text-center text-red-600">${spentMonth ? spentMonth : "-$0"}</td>
        <td class="py-3 px-8 text-center">${balance}</td>
        `
    }
    totalByMonthTable += `</table>`
    $("#total-by-month").innerHTML = totalByMonthTable
}
  

/* -----  ----- */

const saveCategoryData = (categoryId) => {
    return {
        id: categoryId ? categoryId : randomId(),
        nombre: $("#addCategory").value
    }
}

const saveOperationData = (operationId) => {
    return {
        id: operationId ? operationId : randomId(),
        descripcion: $("#description-operation-input").value,
        monto: $("#amount-input").valueAsNumber,
        tipo: $("#expense-profit-select").value,
        categoria: $("#category-select").value,
        fecha: $("#date-select").value 
    }
}

const addCategory = () => {
    const currentCategories = getData("categorias")
    const newCategory = saveCategoryData()
    currentCategories.push(newCategory)
    sendData("categorias", currentCategories)
}

const addOperation = () => {
    const currentOperations = getData("operaciones")
    const newOperation = saveOperationData()
    currentOperations.push(newOperation)
    sendData("operaciones", currentOperations)
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
    renderProfitsAndExpenses(currentOperations)
}

const editCategory = () => {
    const categoryId = $("#btn-edit-category").getAttribute("data-id")
    const editCategories = getData("categorias").map(category => {
        if ( category.id === categoryId ){
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
    const editOperations = getData("operaciones").map(operation => {
        if ( operation.id === operationid ){
            return saveOperationData(operationid)
        }
        return operation
    })
    sendData("operaciones", editOperations)
    renderProfitsAndExpenses(getData("operaciones"))
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
    $("#description-operation-input").value = operationSelected.descripcion
    $("#amount-input").valueAsNumber = operationSelected.monto
    $("#expense-profit-select").value = operationSelected.tipo
    $("#category-select").value = operationSelected.categoria
    $("#date-select").value = operationSelected.fecha
    
}


const initializeApp = () => {

    sendData("categorias", allCategories)
    sendData("operaciones", allOperations)

    renderCategories(allCategories)
    renderOperations(allOperations)
    renderProfitsAndExpenses(allOperations)
    renderCategoriesOptions(allCategories)

    const operationsFromLocalStorage = getData("operaciones")

    if ( operationsFromLocalStorage.length > 0 ) {
        renderOperations(operationsFromLocalStorage)
        showElement("#table-operation-cont")
        hideElement("#no-operation-img")
      } else {
        hideElement("#table-operation-cont")
        showElement("#no-operation-img")
      }
        
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().split('T')[0]
    $("#date-filter").value = formattedDate
    $("#date-select").value = formattedDate


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

        if ( operationsFromLocalStorage ) {
            renderHigherGain()
            renderHigherSpending()
            totalBycategory()
            highestBalance()
            totalByMonth()
            showElement("#reports-summary")
            hideElement("#no-reports-summary")
          } else {
            hideElement("#reports-summary")
            showElement("#no-reports-summary")
          }
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

        if ( validateForm("#addCategory", "#category-error") ){
            addCategory()
        }
        renderCategories(getData("categorias"))

    })

    $("#add-new-operation").addEventListener("click", (e) => {
        e.preventDefault()
        if(validateForm("#description-operation-input", "#operation-error")){
            addOperation()
        showElement("#balance-section")
        showElement("#filters-section")
        showElement("#operations-section")
        showElement("#table-operation-cont")
        hideElement("#new-operation")
        hideElement("#no-operation-img")
        
        } 
        //const currentOperations = getData("operaciones")
        renderOperations(getData("operaciones"))
        renderProfitsAndExpenses(getData("operaciones"))
       
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
        const currentOperations = getData("operaciones")
        renderOperations(currentOperations)
        renderProfitsAndExpenses(currentOperations)
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

    /* ------FILTERS------ */

    $("#exp-prof-filter").addEventListener("input", (e) => {
        const typeSelected = e.target.value
        const currentOperations = getData("operaciones")

        if ( typeSelected === "gasto" ){
            const filteredOperations = currentOperations.filter(operation => operation.tipo === "gasto")
            renderOperations(filteredOperations)
        } else {
            const filteredOperations = currentOperations.filter(operation => operation.tipo === "ganancia")
            renderOperations(filteredOperations)

        }
        
    })
    
    $("#categories-select").addEventListener("input", (e) => {
        const categoryId = e.target.value
        const currentOperations = getData("operaciones")

        if ( categoryId === "" ){
            renderOperations(currentOperations)
        } else {
            const filteredOperations = currentOperations.filter(operation => operation.categoria === categoryId)
            renderOperations(filteredOperations)
        }
    })

    $("#date-filter").addEventListener("change", (e) => {
        const dateSelected = new Date(e.target.value)
        const currentOperations = getData("operaciones")
        const filteredOperations = currentOperations.filter(operation => new Date(operation.fecha) >= dateSelected)
        renderOperations(filteredOperations)
    })

    $("#filters-to-sort").addEventListener("input", (e) => {
        const optionSelected = e.target.value
        const currentOperations = getData("operaciones")

        if ( optionSelected === "mas reciente" ){
            const filteredOperations = currentOperations.toSorted((a, b) => {
                const firstDate = new Date(a.fecha)
                const secondDate = new Date(b.fecha)
                if (firstDate < secondDate) return 1
                if (firstDate > secondDate) return -1
                return 0
            })
          renderOperations(filteredOperations)
        }  else if ( optionSelected === "menos reciente" ){
            const filteredOperations = currentOperations.toSorted((a, b) => {
                const firstDate = new Date(a.fecha)
                const secondDate = new Date(b.fecha)
                if (firstDate < secondDate) return -1
                if (firstDate > secondDate) return 1
                return 0
            })
            renderOperations(filteredOperations)
        } else if ( optionSelected === "mayor monto" ){
            const filteredOperations = currentOperations.toSorted((a, b) => {
                if (a.monto < b.monto) return 1
                if (a.monto > b.monto) return -1
                return 0
            })
            renderOperations(filteredOperations)
        }  else if ( optionSelected === "menor monto" ){
            const filteredOperations = currentOperations.toSorted((a, b) => {
                if (a.monto < b.monto) return -1
                if (a.monto > b.monto) return 1
                return 0
            })
            renderOperations(filteredOperations)
        } else if (optionSelected === "a-z" ){
            const filteredOperations = currentOperations.toSorted((a, b) => {
                if (a.descripcion < b.descripcion) return -1
                if (a.descripcion > b.descripcion) return 1
                return 0
            })
            renderOperations(filteredOperations)
        } else {
            const filteredOperations = currentOperations.toSorted((a, b) => {
                if (a.descripcion < b.descripcion) return 1
                if (a.descripcion > b.descripcion) return -1
                return 0
            })
            renderOperations(filteredOperations)
        }

    })
}

window.addEventListener("load", initializeApp)