document.addEventListener('DOMContentLoaded', function () {
    fetch('/admin/users') // URL
        .then(response => response.json())
        .then(data => {
            const users = data.users; // Доступ к users
            const roles = data.roles; // Доступ к ролям
            renderUsersTable(users, roles); //Таблицы
        })
        .catch(error => console.error('Error:', error));
});

function renderUsersTable(users, roles) {
    const tableBody = document.querySelector('#usersTable tbody'); // Находим таблицу
    tableBody.innerHTML = ''; // Очищаем содержимое таблицы

    users.forEach(user => {
        const row = tableBody.insertRow(); // Добавляем новую строку
        const cellFirstName = row.insertCell(0); // Ячейка имени
        const cellLastName = row.insertCell(1); // Ячейка фамилии
        const cellAge = row.insertCell(2); // Ячейка возраста
        const cellEmail = row.insertCell(3); // Ячейка email
        const cellRole = row.insertCell(4); // Ячейка роли
        const cellActions = row.insertCell(5); // Ячейка действий

        cellFirstName.textContent = user.firstName; // Заполняем имя
        cellLastName.textContent = user.lastName; // Заполняем фамилию
        cellAge.textContent = user.age; // Заполняем возраст
        cellEmail.textContent = user.email; // Заполняем email
        cellRole.textContent = user.roles.map(role => role.nameRole).join(', '); // Заполняем роль
        cellActions.innerHTML = `
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
        `; // Кнопки
    });
}

function editUser(userId) {
    fetch(`/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            const modal = document.getElementById('editModal'); // Модальное окно
            modal.style.display = 'block'; // Показываем модальное окно

            const firstNameInput = document.getElementById('firstNameInput');
            const lastNameInput = document.getElementById('lastNameInput');
            const ageInput = document.getElementById('ageInput');
            const emailInput = document.getElementById('emailInput');
            const roleSelect = document.getElementById('roleSelect');

            firstNameInput.value = user.firstName; // Заполняем поля формы
            lastNameInput.value = user.lastName;
            ageInput.value = user.age;
            emailInput.value = user.email;

            // Заполняем выпадающий список ролей
            const roles = document.querySelectorAll('#roleSelect option');
            roles.forEach(option => {
                if (option.value === user.roles[0].id.toString()) {
                    option.selected = true;
                }
            });

            // Сохраняем ID пользователя для последующего обновления
            document.getElementById('userId').value = user.id;
        })
        .catch(error => console.error('Error:', error));
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none'; // Скрываем модальное окно
}

function saveEditedUser() {
    const userId = document.getElementById('userId').value;
    const firstName = document.getElementById('firstNameInput').value;
    const lastName = document.getElementById('lastNameInput').value;
    const age = document.getElementById('ageInput').value;
    const email = document.getElementById('emailInput').value;
    const roleId = document.getElementById('roleSelect').value;

    const userData = {
        firstName: firstName,
        lastName: lastName,
        age: parseInt(age),
        email: email,
        roles: [{ id: parseInt(roleId) }]
    };

    fetch(`/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            alert('Пользователь успешно обновлен!');
            closeModal(); // Скрываем модальное окно
            //TODO
            window.location.reload(); // Перезагрузка страницы
        })
        .catch(error => console.error('Error:', error));
}

function deleteUser(userId) {
    if (confirm('Confirm')) {
        fetch(`/users/${userId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 204) {
                    alert('User removed');
                    //todo
                    window.location.reload(); // Перезагрузка страницы для обновления данных
                } else {
                    alert('Err.');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function openCreateUserModal() {
    const modal = document.getElementById('createUserModal');
    modal.style.display = 'block';
}

function closeCreateUserModal() {
    const modal = document.getElementById('createUserModal');
    modal.style.display = 'none';
}

function createNewUser() {
    const firstName = document.getElementById('newFirstNameInput').value;
    const lastName = document.getElementById('newLastNameInput').value;
    const age = document.getElementById('newAgeInput').value;
    const email = document.getElementById('newEmailInput').value;
    const roleId = document.getElementById('newRoleSelect').value;

    const userData = {
        firstName: firstName,
        lastName: lastName,
        age: parseInt(age),
        email: email,
        roles: [{ id: parseInt(roleId) }]
    };

    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            alert('Новый пользователь создан!');
            closeCreateUserModal(); // Скрываем модальное окно
            //todo
            window.location.reload(); // Перезагрузка страницы
        })
        .catch(error => console.error('Error:', error));
}