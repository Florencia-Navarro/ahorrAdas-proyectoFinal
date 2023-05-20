const $ = (selector) => document.querySelector(selector)

/* -----aux----- */

const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")

/* ----- RENDER ----- */



/* -----  ----- */

const initializeApp = () => {
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

    $("#btn-categories").addEventListener("click", () => {
        hideElement("#balance-section")
        hideElement("#filters-section")
        hideElement("#operations-section")
        hideElement("#btn-close-menu")
        hideElement("#reports-section")
        hideElement("#new-operation")
        showElement("#edit-categories")
        showElement("#btn-open-menu")
    })

    $("#btn-reports").addEventListener("click", () => {
        hideElement("#balance-section")
        hideElement("#filters-section")
        hideElement("#operations-section")
        hideElement("#edit-categories")
        hideElement("#btn-close-menu")
        hideElement("#new-operation")
        showElement("#reports-section")
        showElement("#btn-open-menu")
    })
    $("#btn-new-operation").addEventListener("click", () => {
        hideElement("#balance-section")
        hideElement("#filters-section")
        hideElement("#operations-section")
        hideElement("#edit-categories")
        showElement("#new-operation")

    })

}

window.addEventListener("load", initializeApp)