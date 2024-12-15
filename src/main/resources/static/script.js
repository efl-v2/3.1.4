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
            const passwordInput = document.getElementById('password');

            firstNameInput.value = user.firstName; // Заполняем поля формы
            lastNameInput.value = user.lastName;
            ageInput.value = user.age;
            emailInput.value = user.email;
            passwordInput.value = user.password;

            // Очищаем текущий список ролей
            roleSelect.innerHTML = '';
            // Создаем опции для каждого элемента массива roles
            roles.forEach(role => {
                let option = document.createElement('option');
                option.textContent = role.authority.replace('ROLE_', '')
                option.value = role.id;

                // Если роль совпадает с текущей ролью пользователя, устанавливаем её как выбранную
                if (role.id === user.roles[0].id) {
                    option.selected = true;
                }

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
    const roleId = document.getElementById('edit-roles').value;
    const password = document.getElementById('password').value;

    console.log(password)
    const userData = {
        firstName: firstName,
        lastName: lastName,
        age: parseInt(age),
        email: email,
        roles: [{ id: parseInt(roleId) }],
        password: password
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
            // const modal = new bootstrap.Modal(document.getElementById('editModal'));
            // modal.hide();
            // window.location.reload(); // Перезагрузка страницы
        })
        .catch(error => console.error('Error:', error));
}

// Редактируем юзера
function confirmEdit() {
    const userId = document.getElementById('userId').value; // Получаем значение из скрытого инпута
    console.log(userId);
    editUser(userId);
}

// Заполняем данные в модальном окне
function fillModalData(userId) {
    console.log(userId)
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

//
//
//
//todo
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

            window.location.reload(); // Перезагрузка страницы
        })
        .catch(error => console.error('Error:', error));
}