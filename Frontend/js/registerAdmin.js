function registerOng() {
  Swal.fire({
    title: 'Cadastrando usuário...',
    text: 'Aguarde enquanto o usuário está sendo cadastrado',
    icon: 'info',
    showConfirmButton: false,
    allowOutsideClick: false,
    timer: 1500
  });

  let nome = document.getElementById('nome').value;
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
      formData.append('email', email);
      formData.append('password', senha);
      formData.append('nameUser', username);
      formData.append('arroba', arroba);
      formData.append('profileImage', blob, 'profile.jpg');

      const token = sessionStorage.getItem('token');

      axios
        .post('http://localhost:8080/api/users/admin/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        .then(function (response) {

          Swal.fire({
            title: 'Cadastro realizado!',
            text: 'O usuário foi cadastrado com sucesso.',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
          }).then(function () {
            window.location.href = 'PagAdminRegister.html';
          });
          limparCampos();
        })
        .catch(function (error) {
          console.log(error);

          Swal.fire({
            title: 'Cadastro não realizado!',
            text: 'O cadastro do usuário falhou, tente novamente.',
            icon: 'error',
            showConfirmButton: true,
            timer: 3000
          }).then(function () {
            window.location.href = 'PagAdminRegister.html';
          });
        });
    })
    .catch(function (error) {
      console.log(error);
      alert('Ocorreu um erro ao tentar obter a imagem.');
    });
}

function limparCampos() {
  document.getElementById("nome").value = "";
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

function logout() {
  const logoutButton = document.getElementById("exit-button");

  logoutButton.addEventListener("click", function (event) {
    event.preventDefault();

    Swal.fire({
      title: 'Logout',
      text: 'Tem certeza que deseja fazer logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = sessionStorage.getItem("token");

        axios.post("http://localhost:8080/api/users/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        })
          .then(response => {
            Swal.fire({
              title: 'Logout',
              text: 'Logout realizado com sucesso.',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              sessionStorage.removeItem('token');
              window.location.href = 'PagAdminLogin.html';
            });
          })
          .catch(error => {
            console.error("Erro ao fazer logout:", error);
          });

      }
    });
  });
}