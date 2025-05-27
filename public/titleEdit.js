import { API_BASE_URL } from "./config.js";

const noteId = document.getElementById("noteId").value;
const noteTitle = document.getElementById("title");

const failPop = (message) => {
    return `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <strong>Change title fail</strong> ${message}
            </div>
            `
}

document.getElementById("edit-title").addEventListener("click", () => {
    const newTitle = document.getElementById("newTitle").value;
    if (newTitle.length === 0){
        announcement.innerHTML = failPop("title can not be empty");
            setTimeout(() => {announcement.innerHTML = ''}, 10000);
        return 
    }
    fetch(`${API_BASE_URL}/api/protected/note/${noteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newTitle })
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
            noteTitle.textContent = newTitle;
        })
        .catch(error => {
            console.error("save fail: ", error);
            announcement.innerHTML = failPop(error);
            setTimeout(() => {announcement.innerHTML = ''}, 10000);
        })
})