document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.querySelector('#input'),
        todoButton = document.querySelector('button'),
        todoFilter = document.querySelector(".filter-todo"),
        trashUl = document.querySelector('#ul'),
        todoList = document.querySelector(".ul-checked");

    const url = 'http://localhost:3000/user';

    todoButton.addEventListener('click', addTodolist);
    trashUl.addEventListener('click', deleteTodo);
    todoList.addEventListener('click', deleteTodo);
    todoFilter.addEventListener('change', filterTodo);
    window.addEventListener('load', upDateTrashUl, true);





    async function addTodolist(e) {
        e.preventDefault();

        let liTag = document.createElement('li');
        liTag.innerHTML = ` <p>${todoInput.value}</p>
                            <section>
                                <button class="complate-btn"><i class="fas  fa-check"></i></button>
                                <button class="trash-btn"><i class="fas  fa-trash"></i></button>
                            </section>
                            `
        console.log(typeof todoInput.value);

        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: todoInput.value
            })
        })
            .then(res => res.json())
            .then(data => todoAdd(liTag, data))
            .catch(err => alert(err));

        todoInput.value = '';
    }

    function todoAdd(liTag, data) {
        liTag.id = `${data._id}`;
        trashUl.appendChild(liTag);
    }

    async function deleteTodo(e) {
        const item = e.target;
        console.log(item);
        //* e.target.parentElement.parentElement.remove();
        const todo = item.parentElement.parentElement;
        if (item.classList[0] === "trash-btn") {

            //* delete from mongoDB
            await fetch(`${url}/` + todo.id, {
                method: 'DELETE',
            })
                .then(res => res.json())
                .then(res => {
                    //* upDate page
                    todo.classList.add("fall");

                    //*at the end
                    todo.addEventListener("transitionend", () => {
                        todo.remove();
                    });
                })
                .catch(err => alert(err))
            upDate(todo);

        } else if (item.classList[0] === "complate-btn") {
            await complateTodo(e)
        }

    }

    async function complateTodo(e) {
        //* add complate class 
        const todo = e.target.parentElement.parentElement;
        const id = todo.id;
        await fetch(`${url}/` + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(res => {
                todo.classList.toggle("completed");
            })
            .catch(err => console.log(err.message))

        if (todo.parentElement.classList.contains("ul-checked")) {
            trashUl.childNodes.forEach(function (element, index, arrayNode) {
                if (element.id === todo.id) {
                    element.classList.toggle("completed");
                }
            })
            todo.classList.add("fall");
            todo.addEventListener("transitionend", () => {
                todo.remove();
            });
        }
        if (todo.parentElement.classList.contains("ul-list")) {
            let todoBoolen = true;
            todoList.childNodes.forEach(function (element, index, arrayNode) {
                if (element.id === todo.id) {
                    // element.classList.toggle("completed");
                    element.classList.add("fall");
                    element.addEventListener("transitionend", () => {
                        element.remove();
                    });
                    todoBoolen = false;
                }
            })
            console.log(todoList.children > 0);

            if (todoBoolen && todoList.children.length > 0) {

                if (todo.classList.contains("completed")) {
                    todoList.innerHTML += `<li id="${todo.id}" class="completed">
                                                    <p>${todo.firstElementChild.textContent}</p>
                                                    <section>
                                                        <button class="complate-btn"><i class="fas  fa-check"></i></button>
                                                        <button class="trash-btn"><i class="fas  fa-trash"></i></button>
                                                    </section>
                                                </li>
                                                `
                } else {
                    todoList.innerHTML += `<li id="${todo.id}" >
                                                    <p>${todo.firstElementChild.textContent}</p>
                                                    <section>
                                                        <button class="complate-btn"><i class="fas  fa-check"></i></button>
                                                        <button class="trash-btn"><i class="fas  fa-trash"></i></button>
                                                    </section>
                                                </li>
                                                `
                }
            }
        }
    }


    async function filterTodo(e) {
        todoList.innerHTML = null;
        await fetch(url, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                setTimeout(() => {
                    data.forEach(function (element, index, array) {
                        if (e.target.value === 'completed' && element.completed === true) {
                            todoList.innerHTML += `<li id="${element._id}" class="completed">
                                                            <p>${element.title}</p>
                                                            <section>
                                                                <button class="complate-btn"><i class="fas  fa-check"></i></button>
                                                                <button class="trash-btn"><i class="fas  fa-trash"></i></button>
                                                            </section>
                                                        </li>
                                                        `
                        } else
                            if (e.target.value === 'uncompleted' && element.completed === false) {
                                todoList.innerHTML += `<li id="${element._id}" >
                                                            <p>${element.title}</p>
                                                            <section>
                                                                <button class="complate-btn"><i class="fas  fa-check"></i></button>
                                                                <button class="trash-btn"><i class="fas  fa-trash"></i></button>
                                                            </section>
                                                        </li>
                                                        `
                            }
                    })
                }, 500)
            })
            .catch(err => console.log(err))

    }

    function upDate(todo) {
        if (todo.parentElement.classList.contains("ul-list")) {
            todoList.childNodes.forEach(function (element, index, arrayNode) {
                if (element.id === todo.id) {
                    element.classList.add("fall");
                    element.addEventListener("transitionend", () => {
                        element.remove();
                    });

                }
            })
        } else {
            trashUl.childNodes.forEach(function (element, index, arrayNode) {
                if (element.id === todo.id) {
                    element.classList.add("fall");
                    element.addEventListener("transitionend", () => {
                        element.remove();
                    });
                }
            })
        }
    }

    async function upDateTrashUl(e) {
        await fetch(url, {
            method: 'GET',
        })
            .then(res => res.json())
            .then((data) => {

                data.forEach(function (element, index, arrayNode) {
                    if (element.completed === true) {
                        trashUl.innerHTML += `<li id="${element._id}" class="completed">
                                                            <p>${element.title}</p>
                                                            <section>
                                                                <button class="complate-btn"><i class="fas  fa-check"></i></button>
                                                                <button class="trash-btn"><i class="fas  fa-trash"></i></button>
                                                            </section>
                                                        </li>
                                                        `

                    } else {
                        trashUl.innerHTML += `<li id="${element._id}">
                                                                    <p>${element.title}</p>
                                                                    <section>
                                                                        <button class="complate-btn"><i class="fas  fa-check"></i></button>
                                                                        <button class="trash-btn"><i class="fas  fa-trash"></i></button>
                                                                    </section>
                                                                </li>
                                                                `
                    }
                })
            })
            .catch(err => console.log(err))
    }

});



