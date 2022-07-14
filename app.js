
///Open create note form///
const addNoteBTN = document.querySelector(".add-note")
const  stacked = document.querySelector(".stacked")
const createForm = document.querySelector(".create-form");
const input = document.querySelector(`.create-form input[type="text"]`);
const textArea = document.querySelector(`.create-form textarea`);

const updateForm = document.querySelector(".update-form")
const message = document.querySelector(".message");


addNoteBTN.addEventListener("click",(e)=>{
    stacked.style.display = "flex"
    if(createForm.style.display === "none"){
        createForm.style.display = "block"
        updateForm.style.display = "none"
    }
})

//////Close create  form/////////
const closeStacked = document.querySelectorAll(".close-stacked")

console.log(closeStacked);

closeStacked.forEach(function(span){
    span.addEventListener("click",(e)=>{
        stacked.style.display = "none"
    })
})


/// Date function 
function getDate(){
    let d = new Date();
    let months = ["Junuary","February","March","April","May","June","July","August","September","November","December"]
    let month = d.getMonth();
    let day = d.getDate();
    let yaer = d.getFullYear();

    return `${months[month]} ${day}, ${yaer}` 
}

createForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    if(input.value !== "" && textArea.value !== ""){
        let obj = {
            id:Date.now(),
            title:input.value,
            desc:textArea.value,
            date:getDate()
        }

        createNote(obj);
        storeNote(obj);
        input.value = ""
        textArea.value = ""
        stacked.style.display = "none"
    }
})

/*Create note logic (new note) (note from storage)*/

const notes = document.querySelector(".notes-container")

///Notes from storage
function drawStorageNotes(){
    let notesFromStorage = JSON.parse(localStorage.getItem("notes"));
    if(notesFromStorage !== null){
        notesFromStorage.forEach(function(note){
            createNote(note)
        })
    }
}
drawStorageNotes()


///Create new notes///

function createNote(obj){
    const note = document.createElement("div")
    note.classList.add("note");
    note.id = obj.id;
    //Note title and Desc
    const noteTitle = document.createElement("h3");
    noteTitle.classList.add("note-title");
    noteTitle.textContent = obj.title
    const noteDesc = document.createElement("p");
    noteDesc.classList.add("note-desc");
    noteDesc.textContent = obj.desc;
    //Note footer
    const noteFoot = document.createElement("div");
    noteFoot.classList.add("note-foot");
    //Date
    const date = document.createElement("span");
    date.classList.add("date")
    date.textContent = obj.date
    //Edit and delete dotes
    const dotes = document.createElement("div")
    dotes.classList.add("dotes")
    dotes.textContent = "..."

    //PopUp
    const ul = document.createElement("ul")
    ul.classList.add("hidden-list")
    const edit = document.createElement("li")
    edit.classList.add("edit","li")
    const remove = document.createElement("li")
    remove.classList.add("remove","li")

    edit.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i> Edit`
    remove.innerHTML = `<i class="fa fa-trash-o" aria-hidden="true"></i> Delete`
    ul.append(edit,remove)
    //Appending
    noteFoot.append(date,dotes,ul)
    note.append(noteTitle,noteDesc,noteFoot)
    notes.appendChild(note)

}



/*Store Notes*/

function storeNote(obj){
    let arr = [];

    if(localStorage.getItem("notes") !== null){
        arr = JSON.parse(localStorage.getItem("notes"))
    }
    arr.push(obj);
    localStorage.setItem("notes",JSON.stringify(arr))
}


/*Dotes Show and Hide*/
notes.addEventListener("click",(e)=>{
    if(e.target.classList.contains("dotes")){
        let noteFoot = e.target.parentElement.children;
        let popup = noteFoot[2]
        if(popup.classList.contains("hidden-list")){
            popup.classList.remove("hidden-list")
            popup.classList.add("showen-list")
        }else{
            popup.classList.remove("showen-list")
            popup.classList.add("hidden-list")
        }
    }else if(e.target.classList.contains("li")){
        let ul = e.target.parentElement;
        if(ul.classList.contains("showen-list")){
            ul.classList.remove("showen-list")
            ul.classList.add("hidden-list")
        }
    }
})


/*Delte Notes*/

notes.addEventListener("click",(e)=>{
    if(e.target.classList.contains("remove")){
        let note = e.target.parentElement.parentElement.parentElement;
        stacked.style.display = "flex";
        //hide create note form
        createForm.style.display = "none";
        updateForm.style.display = "none";
        //Show message popup
        message.style.display = "block";
    
        // create a message for this note
        message.innerHTML = `
        <p>Are you sure you want to delete this note?</p>
        <button class="ok" onclick ="removeNote(${note.id})">Ok</button>
        <button class="cancel" onclick="closeMessage()">Cancel</button>
        `
    }
})


function removeNote(id){
    let note = document.getElementById(`${id}`)
    notes.removeChild(note)

    //hide message popup
    stacked.style.display = "none";
    message.style.display = "none";
    //show create note form
    createForm.style.display = "block";

    // Remove from localStorage
    removeFromLocalStorage(id)
}


function closeMessage(){
     //hide message popup
    stacked.style.display = "none";
    message.style.display = "none";
     //show create note form
    createForm.style.display = "block";
}

function removeFromLocalStorage(id){
    let localSNotes = JSON.parse(localStorage.getItem("notes"))

    let filterdArr = localSNotes.filter((note)=>{
        return note.id !== id
    })

    localStorage.setItem("notes",JSON.stringify(filterdArr))
}



/**Edit Notes */

let UpdateObj = {}

notes.addEventListener("click",(e)=>{
    if(e.target.classList.contains("edit")){
        let note = e.target.parentElement.parentElement.parentElement;
        stacked.style.display = "flex";
        //show update form
        updateForm.style.display = "block";
        //hide create note form
        createForm.style.display = "none";
        message.style.display = "none";
        
        
        UpdateObj.id = note.id
    }
    
})


updateForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log(UpdateObj);
    let note = document.getElementById(UpdateObj.id)
    let updatedTitle = document.querySelector(".update-form input[type='text']")
    let updatedDesc = document.querySelector(".update-form textarea")

    if(updatedDesc.value !== "" || updatedTitle.value !== ""){
        //Edit title
        if(updatedTitle.value !== ""){
            note.children[0].textContent = updatedTitle.value
            UpdateObj.newTitle =  updatedTitle.value
        }
        
        //Edit Description
        if(updatedDesc.value !== ""){
            note.children[1].textContent = updatedDesc.value
            UpdateObj.newDesc =  updatedDesc.value
        }
        
        //Edit Date
        UpdateObj.date = getDate()
        note.children[2].children[0].textContent = UpdateObj.date
        console.log(note.children[2].children[0]);

        updatedDesc.value = ""
        updatedTitle.value = ""
        
        updateForm.style.display = "none"
        stacked.style.display = "none"
        udateNoteLocalST(UpdateObj)
    }
})

function udateNoteLocalST(UpdateObj){
    console.log(UpdateObj);
    let notesSt = JSON.parse(localStorage.getItem("notes"));

    let filterdNotes = notesSt.map(function(note){
        if(note.id === Number(UpdateObj.id)){
            note.title = UpdateObj.newTitle ? UpdateObj.newTitle : note.title
            note.desc = UpdateObj.newDesc ? UpdateObj.newDesc : note.desc
            note.date = UpdateObj.date
        }
        return note
    }) 
    console.log(filterdNotes,"filterd");
    localStorage.setItem("notes",JSON.stringify(filterdNotes))
}


/*Scroll to top*/

const toTop = document.querySelector(".toTop")
window.addEventListener("scroll",(e)=>{
    if(window.scrollY >= 350){
        console.log("ok");
        toTop.classList.add("show")
    }else{
        toTop.classList.remove("show")
    }
    // console.log(window.scrollY)
})

toTop.addEventListener("click",(e)=>{
    window.scrollTo({
        top:0,
        left:0,
        behavior:"smooth"
    })
})