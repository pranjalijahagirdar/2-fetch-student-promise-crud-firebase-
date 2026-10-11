const cl = console.log;

const studentForm = document.getElementById('studentForm')
const contactControl = document.getElementById('contactControl')
const emailControl = document.getElementById('emailControl')
const fnameControl = document.getElementById('fnameControl')
const lnameControl = document.getElementById('lnameControl')
const addstdbtn = document.getElementById('addstdbtn')
const updatestdbtn = document.getElementById('updatestdbtn')
const spinner = document.getElementById('spinner')
const stdList = document.getElementById('stdList')

const BASE_URL = `https://crud-6b7ce-default-rtdb.firebaseio.com`
const STUDENT_URL = `${BASE_URL}/students.json`;

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 30000
    })
}

function showSpinner() {
    spinner.classList.remove('d-none')
}
function hideSpinner() {
    spinner.classList.add('d-none')
}

const state={
    studentArr:[],
    editId:null,
}

//read

function onCreateStudentList(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += `<tr id="${ele.id}">
                        <td>${ele.contact}</td>
                        <td>${ele.email}</td>
                        <td>${ele.fname}</td>
                        <td>${ele.lname}</td>
                        <td class="text-center">
                            <i onclick="editStd(this)" class="fa-solid fa-pen-to-square fa-2x text-info" role="button"></i>
                        </td>
                        <td class="text-center">
                            <i onclick="deleteStd(this)" class="fa-solid fa-trash fa-2x text-danger" role="button"></i>
                        </td>
                    </tr>`
    })
    stdList.innerHTML = result;
}


function fetchStudent() {
    showSpinner()
    fetch(STUDENT_URL, {
        method: "GET",
        body: null,
        headers: {
            "Content-type": "application/json",
            "Authorization": "TOKEN JWT form LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error()
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key
                state.studentArr.unshift(data[key])
            }
            onCreateStudentList(state.studentArr)
        })
        .catch(err => {
            snackbar(err, 'error')
        })
        .finally(() => {
            hideSpinner()
        })
}
fetchStudent()

//create

function onAddStudent(eve) {
    eve.preventDefault()
    let studentObj = {
        contact: contactControl.value,
        email: emailControl.value,
        fname: fnameControl.value,
        lname: lnameControl.value,
    }
    showSpinner()
    fetch(STUDENT_URL, {
        method: "POST",
        body: JSON.stringify(studentObj),
        headers: {
            "Content-type": "application/json",
            "Authorization": "TOKEN JWT form LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error()
            }
            return res.json()
        })
        .then(data => {
            studentObj.id = data.name
            state.studentArr.unshift(studentObj)
            studentForm.reset()
            let tr = document.createElement('tr')
            tr.id = studentObj.id;
            tr.innerHTML = `
                        <td>${studentObj.contact}</td>
                        <td>${studentObj.email}</td>
                        <td>${studentObj.fname}</td>
                        <td>${studentObj.lname}</td>
                        <td class="text-center">
                            <i onclick="editStd(this)" class="fa-solid fa-pen-to-square fa-2x text-info" role="button"></i>
                        </td>
                        <td class="text-center">
                             <i onclick="deleteStd(this)" class="fa-solid fa-trash fa-2x text-danger" role="button"></i>
                        </td>`

           stdList.prepend(tr)
            snackbar('Student card added successfully !!!', 'success')
        })
        .catch(err => {
            snackbar('Failed to update card !!!', 'error')
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })
}

//edit

function editStd(ele) {
    let editId = ele.closest('tr').id;
    state.editId = editId;
    let EDIT_URL = `${BASE_URL}/students/${editId}.json`
    showSpinner()
    fetch(EDIT_URL, {
        method: "GET",
        body: null,
        headers: {
            "Content-type": "application/json",
            "Authorization": "TOKEN JWT form LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error()
            }
            return res.json()
        })
        .then(res => {
            contactControl.value = res.contact;
            emailControl.value = res.email;
            fnameControl.value = res.fname;
            lnameControl.value = res.lname;
            addstdbtn.classList.add('d-none')
            updatestdbtn.classList.remove('d-none')
        })
        .catch(err => {
            snackbar(err, 'error')
        })
        .finally(() => {
            hideSpinner()
        })
}

//update

function onUpdateStd() {
    let update_Id = state.editId;
    let UPDATE_URL = `${BASE_URL}/students/${update_Id}.json`;
    let updateObj = {
        contact: contactControl.value,
        email: emailControl.value,
        fname: fnameControl.value,
        lname: lnameControl.value,
        id: update_Id,
    }
    showSpinner()
    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(updateObj),
        headers: {
            "Content-type": "application/json",
            "Authorization": "TOKEN JWT form LS",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error()
            }
            return res.json()
        })
        .then(data => {
            cl(data)
            let getIndex = state.studentArr.findIndex(g => g.id === update_Id);
            state.studentArr[getIndex] = updateObj;
            let tr = document.getElementById(update_Id);
            tr.innerHTML = `<td>${updateObj.contact}</td>
                        <td>${updateObj.email}</td>
                        <td>${updateObj.fname}</td>
                        <td>${updateObj.lname}</td>
                        <td class="text-center">
                            <i onclick="editStd(this)" class="fa-solid fa-pen-to-square fa-2x text-info" role="button"></i>
                        </td>
                        <td class="text-center">
                            <i onclick="deleteStd(this)" class="fa-solid fa-trash fa-2x text-danger" role="button"></i>
                        </td>`
            studentForm.reset()
           addstdbtn.classList.remove('d-none')
            updatestdbtn.classList.add('d-none')
            snackbar(`The card with ${update_Id} is updated successfully !!!`, 'success')

        })
        .catch(err => {
            snackbar('Failed to update card !!!', 'error')
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })
}

//delete

function deleteStd(ele) {
    let removeId = ele.closest('tr').id;
    let REMOVE_URL = `${BASE_URL}/students/${removeId}.json`;
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        
    })
    .then((result) => {
        if (result.isConfirmed) {
                showSpinner()
                fetch(REMOVE_URL, {
                    method: "DELETE",
                    body: null,
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "TOKEN JWT form LS",
                    }
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error()
                        }
                    })
                    .then(data => {
                        //cl(data)
                        let getIndex = state.studentArr.findIndex(j => j.id === removeId)
                        state.studentArr.splice(getIndex, 1)
                        let tr = document.getElementById(removeId)
                        cl(tr)
                        ele.closest('tr').remove()
                        snackbar('card deleted successfully !!!', 'success')
                    })
                    .catch(err => {
                        snackbar(err, 'error')
                        cl(err)
                    })
                    .finally(() => {
                        hideSpinner()
                    })
            }
        })
}
studentForm.addEventListener('submit', onAddStudent)
updatestdbtn.addEventListener('click', onUpdateStd)