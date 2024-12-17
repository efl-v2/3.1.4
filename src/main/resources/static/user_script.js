document.addEventListener('DOMContentLoaded', function () {
    fetch('/user') // URL
        .then(response => response.json())
        .then(data => {

            const user = data;
            console.log(user.email)
            if (user) {
                let emailLink = document.createElement('a');
                emailLink.className = 'navbar-brand text-strong';
                emailLink.textContent = user.email;
                document.getElementById('navbarBrandContainer').appendChild(emailLink);

                let withRolesText = document.createElement('a');
                withRolesText.className = 'navbar-brand';
                withRolesText.textContent = 'with roles: ';
                document.getElementById('navbarBrandContainer').appendChild(withRolesText);

                let roleSpan = document.createElement('span');
                if (user.roles && Array.isArray(user.roles)) {
                    roleSpan.textContent = user.roles.map(role => role.authority.replace('ROLE_', '')).join(', ');
                }
                document.getElementById('navbarBrandContainer').appendChild(roleSpan);
            }

            renderUserTable(user); //Таблица
        })
        .catch(error => console.error('Error:', error));
});

// Функция для рендера таблицы пользователя
function renderUserTable(user) {
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = ''; // Очищаем содержимое таблицы перед добавлением новой строки

    const row = tableBody.insertRow(); // Создаем новую строку

    // Добавляем ячейки с информацией о пользователе
    const cellId = row.insertCell();
    cellId.textContent = user.id;

    const cellFirstName = row.insertCell();
    cellFirstName.textContent = user.firstName;

    const cellLastName = row.insertCell();
    cellLastName.textContent = user.lastName;

    const cellAge = row.insertCell();
    cellAge.textContent = user.age;

    const cellEmail = row.insertCell();
    cellEmail.textContent = user.email;

    const cellRole = row.insertCell();
    let rolesText = "";
    if (user.roles && Array.isArray(user.roles)) {
        rolesText = user.roles.map(role => role.authority.replace('ROLE_', '')).join(', ');
    }
    cellRole.textContent = rolesText;

}
