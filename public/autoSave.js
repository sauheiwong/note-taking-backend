import { API_BASE_URL } from "./config.js";

const editorElement = document.getElementById("note");
const noteId = document.getElementById("noteId").value;

let isSaved = false;

const successPop = `
<div class="alert alert-dismissible alert-success rounded-pill" id="save-success">
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    <strong>Auto Save Success</strong>.
</div>
`

const failPop = (message) => {
    return `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <strong>Auto Save Fail</strong> ${message}
            </div>
            `
}

const announcement = document.getElementById("announcement");

function debounce(func, delay){
    let timeoutId;
    return function(...args){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(args);
        }, delay);
    };
}

const saveContentToServer = (content) => {
    const noteContent = content[0];
    fetch(`${API_BASE_URL}/api/protected/notes/${noteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: noteContent })
    })
    .then(response => {
        if (!response.ok){
            return response.json().then(errorData => {
                throw new Error(`HTTP Error. status: ${response.status}, message: ${errorData.message || "unknown error"}`)
            })
        }
        return response.json();
    })
    .then(data => {
        isSaved = true;
        announcement.innerHTML = successPop;
        setTimeout(() => {announcement.innerHTML = ''}, 5000);
    })
    .catch(error => {
        console.error("save fail: ", error);
        announcement.innerHTML = failPop(error);
        setTimeout(() => {announcement.innerHTML = ''}, 10000);
    })
}

const debouncedSave = debounce(saveContentToServer, 1000);

editorElement.addEventListener("input", () => {
    isSaved = false;

    const content = editorElement.value;
    announcement.innerHTML = '';
    debouncedSave(content);
})

window.addEventListener("beforeunload", (event) => {
    if (!isSaved) {
        event.preventDefault(); // Cancel the event
        console.log("in !isSaved");
        event.returnValue = "You have unsaved changes. Leaving now will discard them."; // Chrome requires
    }
})