import { API_BASE_URL } from "./config.js";

const search = document.getElementById("note-search");
const searchResults = document.getElementById("search-results")

const announcement = document.getElementById("announcement");

const failPop = (message) => {
    return `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <strong>Auto Save Fail</strong> ${message}
            </div>
            `
}

function debounce(func, delay){
    let timeoutId;
    return function(...args){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(args);
        }, delay);
    };
}

const searchNote = ([{ title }]) => {
    fetch(`${API_BASE_URL}/api/protected/note/?title=${title}`,
        { method: "GET" }
    )
    .then(response => {
        if (!response.ok){
            return response.json().then(errorData => {
                throw new Error(`HTTP Error. status: ${response.status}, message: ${errorData.message || "unknown error"}`)
            })
        }
        return response.json();
    })
    .then(data => {
        console.log("data: ", data);
        if (data.length === 0){
            searchResults.innerHTML = `
            <li>
                <p class="dropdown-item" >No result</p>
            </li>
            `
            return 
        }
        searchResults.innerHTML = data.map((note) => `
        <li>
            <a class="dropdown-item" href="${API_BASE_URL}/protected/view/note/${note._id}">
                ${note.title}
            </a>
        </li>
        `).join('')
    })
    .catch(error => {
        console.error("save fail: ", error);
        announcement.innerHTML = failPop(error);
        setTimeout(() => {announcement.innerHTML = ''}, 10000);
    })
}

const debouncedSearch = debounce(searchNote, 1000);

search.addEventListener("input", () => {
    const query = search.value;

    searchResults.innerHTML = "";

    if (!query || typeof query !== "string"){
        return
    }

    const title = titleCandidates.replace(/\s+/g, "").trim();
    debouncedSearch({ title })
})