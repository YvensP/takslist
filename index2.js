const TaskListController = (function () {
    
    return {
        getTaskFromLocalStorage: function () {
            let tasks;
            if (localStorage.getItem('tasks') === null) {
                tasks = []
            } else {
                tasks = JSON.parse(localStorage.getItem('tasks'))
            }
            return tasks;
        },

        addTasktoLocalStorage: function (task) {
            if (task === "") {
                return;
            }
            let tasks = TaskListController.getTaskFromLocalStorage();
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },

        removeTasktoLocalStorage: function (taskItem) {
            let tasks = TaskListController.getTaskFromLocalStorage();
            tasks.forEach((task, index) => {
                if (taskItem.textContent === task) {
                    tasks.splice(index, 1);
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },

        removeAllTask: function () {
            localStorage.removeItem('tasks');
        }
    }
})();



const UIController = (function () {

    const DomEl = {
        form: document.querySelector('#task-form'),
        taskList: document.querySelector('.collection'),
        taskLists: document.querySelectorAll('.collection'),
        clearBtn: document.querySelector('.clear-tasks'),
        filter: document.querySelector('#filter'),
        taskInput: document.querySelector('#task')
    };

    return {
        getDomContents: function () {
            return DomEl;
        },
        addTasktoUI: function (taskName) {
            if (taskName === "") {
                return;
            }
            let task = `<li class="collection-item">${taskName}<a class="delete-item secondary-content"><i class="fas fa-trash"></i></a></li>`;
            DomEl.taskList.insertAdjacentHTML('beforeend', task);
        },
        removeTasktoUI: function (task) {
            task.remove();
        }
    }
})();




const controller = (function (taskCtrl, UICtrl) {
    let DomEl = UICtrl.getDomContents();

    let LoadEvents = function () {
        DomEl.form.addEventListener('submit', addTask);
        DomEl.taskList.addEventListener('click', removeTask);
        document.addEventListener('DOMContentLoaded', gettask);
        DomEl.clearBtn.addEventListener('click', clearTask);
    };

    let addTask = function (e) {
        UICtrl.addTasktoUI(DomEl.taskInput.value);
        taskCtrl.addTasktoLocalStorage(DomEl.taskInput.value);
        DomEl.taskInput.value = "";
        e.preventDefault();
    };

    let removeTask = function (e) {
        if (e.target.parentElement.classList.contains('delete-item')) {
            UICtrl.removeTasktoUI(e.target.parentElement.parentElement);
            taskCtrl.removeTasktoLocalStorage(e.target.parentElement.parentElement)
        }
    };

    let gettask = function (e) {
        let tasks = taskCtrl.getTaskFromLocalStorage();
        tasks.forEach(task => {
            UICtrl.addTasktoUI(task);
        })
    };

    let clearTask = function (e) {
        // DomEl.taskList.innerHTML ="";
        while (DomEl.taskList.firstChild) {
            DomEl.taskList.removeChild(DomEl.taskList.firstChild);
        }
        taskCtrl.removeAllTask();
    };

    return {
        init: function () {
            LoadEvents();
        }
    };
})(TaskListController, UIController);
controller.init();