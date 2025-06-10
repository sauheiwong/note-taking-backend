import { API_BASE_URL } from "./config.js";

let deleteNoteId = null;
const deleteNoteTitleContainer = document.getElementById("delete-note-title");

document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        deleteNoteId = btn.getAttribute("data-note-id");
        deleteNoteTitleContainer.textContent = btn.getAttribute("data-note-title");
    })
})

const announcement = document.getElementById("announcement");

const successPop = `
<div class="alert alert-dismissible alert-success rounded-pill" id="delete-success">
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    <strong>Auto Delete Success</strong>.
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

document.getElementById("delete-note").addEventListener("click", () => {
    fetch(`${API_BASE_URL}/api/protected/notes/${deleteNoteId}`, {
            method: "DELETE"
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
            announcement.innerHTML = successPop;
            setTimeout(() => {announcement.innerHTML = ''}, 5000);
            document.getElementById(`${deleteNoteId}`).remove();
        })
        .catch(error => {
            console.error("save fail: ", error);
            announcement.innerHTML = failPop(error);
            setTimeout(() => {announcement.innerHTML = ''}, 10000);
        })
})