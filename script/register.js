const formulario = document.querySelector('#formulario');
const btnCorreo = document.querySelector('#btnCorreo');
const btnEditar = document.querySelector('#btnEditar');
const btnEliminar = document.querySelector('#btnEliminar');
const API_URL = 'http://localhost:4001/usuarios';


//* CREATE
formulario.addEventListener('submit', async e => {
    const name = document.querySelector('#name').value;
    const lastName = document.querySelector('#lastName').value;
    const email = document.querySelector('#email').value;
    await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            name,
            lastName,
            email
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
    e.preventDefault();
})

//* READ
btnCorreo.addEventListener('click', async e => {
    let correo = document.querySelector('#email').value;
    document.getElementById("email").readOnly = true;

    const datos = await fetch(API_URL);
    const data = await datos.json();
    const buscado = data.find(user => user.email === correo)
    const { id, name, lastName, email } = buscado;

    document.getElementById('id').value = id;
    document.querySelector('#name').value = name;
    document.querySelector('#lastName').value = lastName;
    document.querySelector('#email').value = email;
})

//* UPDATE
btnEditar.addEventListener('click', async e => {
    let name = document.querySelector('#name').value;
    let lastName = document.querySelector('#lastName').value;
    let email = document.querySelector('#email').value;
    let id = document.getElementById('id').value;

    await fetch(API_URL + "/" + id, {
        method: 'PUT',
        body: JSON.stringify({
            name,
            lastName,
            email
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
    e.preventDefault();
})

//* DELETE
btnEliminar.addEventListener('click', async e => {
    const id = document.getElementById('id').value;
    await fetch(API_URL + "/" + id, {
        method: 'DELETE'
    });
})