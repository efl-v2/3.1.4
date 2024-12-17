document.addEventListener('DOMContentLoaded', function () {
    fetch('/admin/users') // URL
        .then(response => response.json())
        .then(data => {
            const users = data.users; // Доступ к users
            const roles = data.roles; // Доступ к ролям
            const currentUser = data.currentUser;
            if (currentUser) {
                let emailLink = document.createElement('a');
                emailLink.className = 'navbar-brand text-strong';
                emailLink.textContent = currentUser.email;
                document.getElementById('navbarBrandContainer').appendChild(emailLink);

                let withRolesText = document.createElement('a');
                withRolesText.className = 'navbar-brand';
                withRolesText.textContent = 'with roles: ';
                document.getElementById('navbarBrandContainer').appendChild(withRolesText);

                let roleSpan = document.createElement('span');
                if (currentUser.roles && Array.isArray(currentUser.roles)) {
                    roleSpan.textContent = currentUser.roles.map(role => role.authority.replace('ROLE_', '')).join(', ');
                }
                document.getElementById('navbarBrandContainer').appendChild(roleSpan);
            }

            renderUsersTable(users, roles); //Таблица
            showAddForm(roles);
        })
        .catch(error => console.error('Error:', error));
});

function showCurrentUserRoles(user) {
    document.g
}

// Функция для рендера таблицы пользователей
function renderUsersTable(users, roles) {
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = tableBody.insertRow();

        // ID
        const cellId = row.insertCell();
        cellId.textContent = user.id;

        // First Name
        const cellFirstName = row.insertCell();
        cellFirstName.textContent = user.firstName;

        // Last Name
        const cellLastName = row.insertCell();
        cellLastName.textContent = user.lastName;

        // Age
        const cellAge = row.insertCell();
        cellAge.textContent = user.age;

        // Email
        const cellEmail = row.insertCell();
        cellEmail.textContent = user.email;

        // Role
        const cellRole = row.insertCell();
        let rolesText = "";
        if (user.roles && Array.isArray(user.roles)) {
            rolesText = user.roles.map(role => role.authority.replace('ROLE_', '')).join(', ');
        }
        cellRole.textContent = rolesText;

        // Кнопки редактирования и удаления
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-info', 'text-white');
        editButton.dataset.toggle = 'modal';
        editButton.dataset.userid = user.id;
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'text-white');
        deleteButton.dataset.toggle = 'modal';
        deleteButton.dataset.userid = user.id;
        deleteButton.textContent = 'Delete';

        // Обработчик клика на кнопку редактирования
        editButton.addEventListener('click', function() {
            // Получаем id пользователя из data-атрибута кнопки
            const userId = this.dataset.userid;
            // Вызываем функцию открытия модального окна для редактирования
            showEditModal(userId, roles);
        });

        // Обработчик клика на кнопку удаления
        deleteButton.addEventListener('click', function() {
            // Получаем id пользователя из data-атрибута кнопки
            const userId = this.dataset.userid;
            // Вызываем функцию открытия модального окна для удаления
            showDeleteModal(userId);
        });

        const cellEdit = row.insertCell();
        cellEdit.appendChild(editButton);

        const cellDelete = row.insertCell();
        cellDelete.appendChild(deleteButton);
    });
}

function showEditModal(userId, roles) {
    fetch(`/admin/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            console.log("Функция showEditModal вызвана");
            const modal = new bootstrap.Modal(document.getElementById('editModal'));
            const firstNameInput = document.getElementById('edit-first-name');
            const lastNameInput = document.getElementById('edit-last-name');
            const ageInput = document.getElementById('edit-age');
            const emailInput = document.getElementById('edit-email');
            const roleSelect = document.getElementById('edit-roles');

            firstNameInput.value = user.firstName; // Заполняем поля формы
            lastNameInput.value = user.lastName;
            ageInput.value = user.age;
            emailInput.value = user.email;

            // Очищаем текущий список ролей
            roleSelect.innerHTML = '';
            // Создаем опции для каждого элемента массива roles
            roles.forEach(role => {
                let option = document.createElement('option');
                option.textContent = role.authority.replace('ROLE_', '')
                option.value = role.id;

                roleSelect.appendChild(option);
            });

            // Сохраняем ID пользователя для последующего обновления
            document.getElementById('userId').value = user.id;
            modal.show();
        })
        .catch(error => console.error('Error:', error));
}

function editUser(userId) {
    const firstName = document.getElementById('edit-first-name').value;
    const lastName = document.getElementById('edit-last-name').value;
    const age = document.getElementById('edit-age').value;
    const email = document.getElementById('edit-email').value;


    // Получение всех выбранных ролей
    const roleSelect = document.getElementById('edit-roles');
    const selectedRoles = Array.from(roleSelect.selectedOptions).map(option => ({
        id: parseInt(option.value), // Получаем id роли
        nameRole: `ROLE_${option.textContent.toUpperCase()}`, // Получаем название роли
        authority: `ROLE_${option.textContent.toUpperCase()}`
    }));

    const userData = {
        firstName: firstName,
        lastName: lastName,
        age: parseInt(age),
        email: email,
        roles: selectedRoles, // Массив объектов Role
    };

    fetch(`/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            const modal = new bootstrap.Modal(document.getElementById('editModal'));
            modal.hide();
            window.location.reload(); // Перезагрузка страницы
        })
        .catch(error => console.error('Error:', error));
}

// Редактируем юзера
function confirmEdit() {
    const userId = document.getElementById('userId').value; // Получаем значение из скрытого инпута
    editUser(userId);
}

// Заполняем данные в модальном окне
function fillModalData(userId) {
    fetch(`/admin/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('delete-modal-first-name').textContent = user.firstName;
            document.getElementById('delete-modal-last-name').textContent = user.lastName;
            document.getElementById('delete-modal-age').textContent = user.age;
            document.getElementById('delete-modal-email').textContent = user.email;
            document.getElementById('delete-modal-roles').textContent = user.roles
                .map(role => role.authority.replace('ROLE_', '')).join(', ');
        })
        .catch(error => console.error('Error:', error));
}

function deleteUser(userId) {
    if (confirm('Confirm')) {
        fetch(`/admin/users/${userId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 204) {
                    window.location.reload();
                } else {
                    alert('Error.');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// Показываем модальное окно удаления
function showDeleteModal(userId) {
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    fillModalData(userId);
    document.getElementById('confirmDeleteButton').dataset.userid = userId;
    modal.show();
}

// Удаляем пользователя
function confirmDelete() {
    const userId = document.querySelector('#deleteModal button[data-userid]').dataset.userid;
    deleteUser(userId);
}

function showAddForm(roles) {
    console.log("Функция showAddForm вызвана");

    // Очистка полей формы перед открытием
    const firstNameInput = document.getElementById('add-first-name');
    const lastNameInput = document.getElementById('add-last-name');
    const ageInput = document.getElementById('add-age');
    const emailInput = document.getElementById('add-email');
    const passwordInput = document.getElementById('new-password');
    const roleSelect = document.getElementById('add-roles');

    firstNameInput.value = ''; // Очищаем поля формы
    lastNameInput.value = '';
    ageInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';

    // Очищаем текущий список ролей
    roleSelect.innerHTML = '';

    // Создаем опции для каждого элемента массива roles
    roles.forEach(role => {
        let option = document.createElement('option');
        option.textContent = role.authority.replace('ROLE_', '');
        option.value = role.id;
        roleSelect.appendChild(option);
    });
}

function addUser() {
    const firstName = document.getElementById('add-first-name').value;
    const lastName = document.getElementById('add-last-name').value;
    const age = document.getElementById('add-age').value;
    const email = document.getElementById('add-email').value;
    const password = document.getElementById("new-password").value;

    // Получение всех выбранных ролей
    const roleSelect = document.getElementById('add-roles');
    const selectedRoles = Array.from(roleSelect.selectedOptions).map(option => ({
        id: parseInt(option.value), // Получаем id роли
        nameRole: `ROLE_${option.textContent.toUpperCase()}`, // Получаем название роли
        //authority: `ROLE_${option.textContent.toUpperCase()}`
    }));

    const userData = {
        firstName: firstName,
        lastName: lastName,
        age: parseInt(age),
        email: email,
        roles: selectedRoles, // Массив объектов Role
        password: password
    };

    fetch('/admin/users', { // Отправляем запрос на создание нового пользователя
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            window.location.reload(); // Перезагрузка страницы
        })
        .catch(error => {
            alert(`Произошла ошибка при добавлении пользователя: ${error.message}`);
            console.error('Error:', error);
        });
}