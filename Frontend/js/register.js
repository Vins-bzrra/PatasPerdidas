function registerUser() {
  Swal.fire({
    title: 'Cadastrando usuário...',
    text: 'Aguarde enquanto o usuário está sendo cadastrado',
    icon: 'info',
    showConfirmButton: false,
    allowOutsideClick: false,
    timer: 1500
  });

  let nome = document.getElementById('nome').value;
  let sobrenome = document.getElementById('sobrenome').value;
  let email = document.getElementById('email').value;
  let senha = document.getElementById('senha').value;
  let username = document.getElementById('username').value;
  let arroba = document.getElementById('arroba').value;

  let profilePictureInput = document.getElementById('profile-picture');
  let profilePictureURL = profilePictureInput.querySelector('img').src;

  fetch(profilePictureURL)
    .then(response => response.blob())
    .then(blob => {
      let formData = new FormData();
      formData.append('name', nome);
      formData.append('lastName', sobrenome);
      formData.append('email', email);
      formData.append('password', senha);
      formData.append('nameUser', username);
      formData.append('arroba', arroba);
      formData.append('profileImage', blob, 'profile.jpg');

      axios
        .post('http://localhost:8080/api/users/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function (response) {
          console.log(response.data);
          sessionStorage.setItem('token', response.data);

          Swal.fire({
            title: 'Cadastro realizado!',
            text: 'O usuário foi cadastrado com sucesso.',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
          }).then(function () {
            window.location.href = 'PagFeed.html';
          });
          limparCampos();
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.data) {
            const errorMessage = error.response.data;
            Swal.fire({
              title: 'Cadastro não realizado!',
              text: errorMessage,
              icon: 'error',
              showConfirmButton: true,
            })
          } else {
            Swal.fire({
              title: 'Cadastro não realizado!',
              text: 'O cadastro do usuário falhou, tente novamente.',
              icon: 'error',
              showConfirmButton: true,
            }).then(function () {
              window.location.href = 'PagCadastro.html';
            });
          }
        });
    })
    .catch(function (error) {
      console.log(error);
      alert('Ocorreu um erro ao tentar obter a imagem.');
    });
}

function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("sobrenome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("senha").value = "";
  document.getElementById("profile-picture").value = "";
  document.getElementById("username").value = "";
  document.getElementById("arroba").value = "";
}

function check() {
  document.getElementById('confirmar-senha').addEventListener('input', function () {
    var senha = document.getElementById('senha').value;
    var confirmarSenha = document.getElementById('confirmar-senha').value;
    var senhaError = document.getElementById('senha-error');

    if (senha !== confirmarSenha) {
      senhaError.textContent = 'As senhas não são iguais';
      document.getElementById('confirmar-senha').classList.add('is-invalid');
    } else {
      senhaError.textContent = '';
      document.getElementById('confirmar-senha').classList.remove('is-invalid');
    }
  });
}
