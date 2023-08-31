// Находим элементы на странице
const form = document.querySelector('#form'); // Форма для добавления задачи
const taskInput = document.querySelector('#taskInput'); // Поле ввода задачи
const tasksList = document.querySelector('#tasksList'); // Список задач
const emptyList = document.querySelector('#emptyList'); // Сообщение о пустом списке

// Слушатели событий для кнопок
highlightEvenBtn.addEventListener('click', highlightEven); // Выделить четные
highlightOddBtn.addEventListener('click', highlightOdd); // Выделить нечетные
deleteLastBtn.addEventListener('click', deleteLast); // Удалить последний
deleteFirstBtn.addEventListener('click', deleteFirst); // Удалить первый

// Массив задач
let tasks = [];

// Восстановление задач из localStorage
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

// Проверка и отображение сообщения о пустом списке
checkEmptyList();

// Слушатели событий для формы и списка задач
form.addEventListener('submit', addTask); // Добавление задачи
tasksList.addEventListener('click', deleteTask); // Удаление задачи
tasksList.addEventListener('click', doneTask); // Отметка задачи как выполненной
highlightEvenBtn.addEventListener('click', highlightEven); // Выделить четные
highlightOddBtn.addEventListener('click', highlightOdd); // Выделить нечетные
deleteLastBtn.addEventListener('click', deleteLast); // Удалить последний
deleteFirstBtn.addEventListener('click', deleteFirst); // Удалить первый

// Функция добавления задачи
function addTask(event) {
	event.preventDefault(); // Отменяем отправку формы

	const taskText = taskInput.value; // Получаем текст задачи

	// Создаем объект задачи
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	tasks.push(newTask); // Добавляем задачу в массив
	saveToLocalStorage(); // Сохраняем в localStorage
	renderTask(newTask); // Отображаем задачу на странице

	taskInput.value = ''; // Очищаем поле ввода
	taskInput.focus(); // Возвращаем фокус на поле ввода

	checkEmptyList(); // Проверяем, пуст ли список задач
}

// Функция удаления задачи
function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return; // Проверяем, был ли клик по кнопке "удалить"

	const parentNode = event.target.closest('.list-group-item'); // Находим родительский элемент задачи
	const id = Number(parentNode.id); // Получаем ID задачи
	tasks = tasks.filter((task) => task.id !== id); // Удаляем задачу из массива
	saveToLocalStorage(); // Сохраняем изменения
	parentNode.remove(); // Удаляем задачу из разметки

	checkEmptyList(); // Проверяем, пуст ли список задач
}

// Функция отметки задачи как выполненной или невыполненной
function doneTask(event) {
	if (event.target.dataset.action !== 'done') return; // Проверяем, был ли клик по кнопке "задача выполнена"

	const parentNode = event.target.closest('.list-group-item'); // Находим родительский элемент задачи
	const id = Number(parentNode.id); // Получаем ID задачи
	const taskIndex = tasks.findIndex((task) => task.id === id); // Находим индекс задачи в массиве

	// Изменяем статус задачи
	tasks[taskIndex].done = !tasks[taskIndex].done;

	// Если задача выполнена, перемещаем её в конец списка
	if (tasks[taskIndex].done) {
		const completedTask = tasks.splice(taskIndex, 1)[0];
		tasks.push(completedTask);
	}

	saveToLocalStorage(); // Сохраняем изменения
	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done'); // Обновляем стиль задачи

	// Переупорядочиваем задачи в списке
	const taskItems = document.querySelectorAll('.list-group-item');
	taskItems.forEach((item, index) => {
		item.remove();
	});

	tasks.forEach((task) => {
		renderTask(task);
	});
}

// Функция выделения четных элементов
function highlightEven() {
	const taskItems = document.querySelectorAll('.list-group-item');
	taskItems.forEach((item, index) => {
		if (index % 2 === 0) {
			item.classList.add('even-highlighted');
		} else {
			item.classList.remove('even-highlighted');
		}
	});
}

// Функция выделения нечетных элементов
function highlightOdd() {
	const taskItems = document.querySelectorAll('.list-group-item');
	taskItems.forEach((item, index) => {
		if (index % 2 === 1) {
			item.classList.add('odd-highlighted');
		} else {
			item.classList.remove('odd-highlighted');
		}
	});
}

// Функция удаления последней задачи
function deleteLast() {
	const taskItems = document.querySelectorAll('.list-group-item');
	const lastItem = taskItems[taskItems.length - 1];
	if (lastItem) {
		lastItem.remove();
		tasks.pop(); // Удаляем последнюю задачу из массива
		saveToLocalStorage(); // Сохраняем изменения
		highlightEven(); // Вызываем функцию выделения четных элементов
		highlightOdd(); // Вызываем функцию выделения нечетных элементов
		checkEmptyList(); // Проверяем, пуст ли список
	}
}

// Функция удаления первой задачи
function deleteFirst() {
	const taskItems = document.querySelectorAll('.list-group-item');
	const firstItem = taskItems[0];
	if (firstItem) {
		firstItem.remove();
		tasks.shift(); // Удаляем первую задачу из массива
		saveToLocalStorage(); // Сохраняем изменения
		highlightEven(); // Вызываем функцию выделения четных элементов
		highlightOdd(); // Вызываем функцию выделения нечетных элементов
		checkEmptyList(); // Проверяем, пуст ли список
	}
}

// Проверка и отображение сообщения о пустом списке
function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="empty-list__img">
            <div class="empty-list__title">Список дел пуст</div>
        </li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		if (emptyListEl) {
			emptyListEl.remove();
		}
	}
}

// Сохранение текущего списка задач в localStorage
function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция для отображения задачи на странице
function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'; // Формируем CSS класс

	const taskHTML = `
        <li id="${task.id}" class="list-group-item ">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;

	tasksList.insertAdjacentHTML('beforeend', taskHTML); // Добавляем задачу на страницу
}
