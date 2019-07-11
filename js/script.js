
function createAlert(divParent) {
  const alertBox = document.createElement('div');
  alertBox.classList.add('alert');
  alertBox.id = 1;
  alertBox.innerText = 'Save Changes';
  alertBox.style.color = '#ffffff';
  divParent.append(alertBox);
}

function addTask(text, id, storageDate) {
  //create main div todo
  const todo = document.createElement('div');
  todo.classList.add('todo-element');
  todo.id = id;
  //create upper bar
  const todoBar = document.createElement('div');
  todoBar.classList.add('todo-element-bar');
  //create div for date form Date()
  const todoDate = document.createElement('div');
  todoDate.classList.add('todo-element-bar');
  const date = new Date();
  const dateText = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' godz.: ' + date.getHours() + ':' + date.getMinutes();
  localStorage.getItem('session')
  //use Date() or use storageDate when loading data - optional param storageDate
  todoDate.innerText = storageDate || dateText;
  //create delete button
  const todoDelete = document.createElement('button');
  todoDelete.classList.add('todo-element-delete');
  todoDelete.classList.add('button');
  todoDelete.innerHTML = '<i class="fas fa-times-circle"></i>';
  //create edit button
  const todoEdit = document.createElement('button');
  todoEdit.classList.add('todo-element-edit');
  todoEdit.classList.add('button');
  todoEdit.innerHTML = '<i class="far fa-edit"></i>';
  //append date and delete
  todoBar.appendChild(todoDate);
  todoBar.appendChild(todoEdit);
  todoBar.appendChild(todoDelete);
  //create div with our task
  const todoText = document.createElement('div');
  todoText.classList.add('todo-element-text');
  todoText.innerText = text;
  //append everything
  todo.appendChild(todoBar);
  todo.appendChild(todoText);
  //and add to list
  todoList.append(todo);

};
//funcja dodoaj text notatki do localStorage i wyjmowanie(parametr - text jak w fincji task)
function saveTextNote(notes, id) {
  let a = [];
  const date = new Date();
  let taskDateAdd = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' godz.: ' + date.getHours() + ':' + date.getMinutes();
  // Parse the serialized data back into an aray of objects
  a = JSON.parse(localStorage.getItem('session'));

  // Push the new data (whether it be an object or anything else) onto the array
  a ? a.push({
    id: id,
    notes: notes,
    date: taskDateAdd
  }) : a = [{
    id: id,
    notes: notes,
    date: taskDateAdd
  }];
  // Alert the array value
  //alert(a);
  // Re-serialize the array back into a string and store it in localStorage
  localStorage.setItem('session', JSON.stringify(a));
}

function exportEndedTodoTask(noteToSave) {

}

function loadTextNotes() {
  let notes = JSON.parse(localStorage.getItem('session'));
  return notes;
}

function displayTextNotesFromLS() {
  let localStorageTaskList = loadTextNotes();
  for (task in localStorageTaskList) {
    addTask(localStorageTaskList[task].notes, localStorageTaskList[task].id, localStorageTaskList[task].date)
  };
}

function removeTextNotes(textNote) {
  let notes = JSON.parse(localStorage.getItem('session'));
  localStorage.clear();
  for (let i = 0; i < notes.length; i++) {
    if(notes[i].id == textNote) {
        //exportEndedTodoTask(notes[i].notes);
        notes[i] = null;
      }
    notes[i] != null ? saveTextNote(notes[i].notes, notes[i].id) : console.log('');

  }
}

function saveEditedTextNotes(textNote,editedText) {
    let notes = JSON.parse(localStorage.getItem('session'));
    localStorage.clear();
    for (let i = 0; i < notes.length; i++) {
      notes[i].id == textNote ? notes[i].notes = editedText : console.log('');
      saveTextNote(notes[i].notes, notes[i].id);
      }
}

document.addEventListener('DOMContentLoaded', function() {
  let todoList = document.querySelector('#todoList');
  let todoForm = document.querySelector('#todoForm');
  let todoSearch = document.querySelector('#todoSearch');
  let id = Math.floor((Math.random() * 49) + 1);
  let clickCount = 0;
  displayTextNotesFromLS();
  todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const textarea = this.querySelector('textarea');
    if (textarea.value !== '') {
      id++;
      addTask(textarea.value, id);
      saveTextNote(textarea.value, id);
      textarea.value = '';
    }
  });

  todoList.addEventListener('click', function(e) {

    if (e.target.closest('.todo-element-delete') !== null) {
      let tempTaskToDelete = e.target.closest('.todo-element').id;
      //function to delete div dynamically from task list
      e.target.closest('.todo-element').remove();
      //function to delete from localStorage
      removeTextNotes(tempTaskToDelete);
    }
  });

  // code if you want to cross task without removing it instead changing text of task
  /*todoList.addEventListener('click', function(e) {
    if (e.target.closest('.todo-element').style.textDecoration !== "line-through")
      e.target.closest('.todo-element').style.textDecoration = "line-through";
    else e.target.closest('.todo-element').style.textDecoration = "none";
  });*/

  todoList.addEventListener('click', function(e) {
  clickCount++;
  if (e.target.closest('.todo-element-edit') !== null &&  e.target.closest('.todo-element-edit').style.color == 'red') {
    console.log('zapisz' + ' ' + e.target.closest('.todo-element-edit').style.color);
    e.target.closest('.todo-element-edit').style.color = '#E39695';
    e.target.closest('.todo-element').children[1].style.border = null;
    let editedText = e.target.closest('.todo-element').children[1].innerText;
    let textNote =  e.target.closest('.todo-element').id;
    saveEditedTextNotes(textNote,editedText);
    document.getElementById('1').parentNode.removeChild(document.getElementById('1'));
    }
    if( (clickCount == 0 || e.target.closest('.todo-element-edit').style.color != 'red' ) && e.target.closest('.todo-element-edit') !== null){
      console.log('zmień' + ' ' + e.target.closest('.todo-element-edit').style.color);
      createAlert(e.target);
      e.target.closest('.todo-element-edit').style.color = 'red';
      e.target.closest('.todo-element').children[1].style.border = '0.5px dotted white';
      e.target.closest('.todo-element').children[1].setAttribute("contenteditable", "true");
    }
});


  todoSearch.addEventListener('input', function() {
    const val = this.value;
    const elems = todoList.querySelectorAll('.todo-element');
    [].forEach.call(elems, function(el) {
      const text = el.querySelector('.todo-element-text').innerText;
      if (text.indexOf(val) !== -1) {
        el.style.setProperty('display', '');
      } else {
        el.style.setProperty('display', 'none');
      }
    });
  });

});
