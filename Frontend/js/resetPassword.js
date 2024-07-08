document.addEventListener('DOMContentLoaded', function () {
  var esqueceuSenhaLink = document.getElementById('esqueceuSenha');
  esqueceuSenhaLink.addEventListener('click', function (event) {
    event.preventDefault();

    Swal.fire({
      title: 'Recuperação de senha',
      html:
        '<input id="swal-email" class="swal2-input" placeholder="Digite seu e-mail">' +
        '<input id="swal-sobrenome" class="swal2-input" placeholder="Digite seu sobrenome">',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      showLoaderOnConfirm: true,
      preConfirm: function () {
        var email = document.getElementById('swal-email').value;
        var sobrenome = document.getElementById('swal-sobrenome').value;

        return axios.post('http://localhost:8080/api/users/reset', {
          email: email,
          lastName: sobrenome
        })
          .then(function (response) {
            var senha = response.data;
            console.log(senha);

            Swal.fire({
              title: 'Senha recuperada',
              html: 'A sua senha provisória é: <strong>' + senha + '</strong>.<br>Substitua a senha imediatamente.',
              icon: 'success'
            });
          })
          .catch(function (error) {
            Swal.fire({
              title: 'Erro',
              text: 'Ocorreu um erro ao processar a solicitação.',
              icon: 'error'
            });
          });
      },
      allowOutsideClick: false
    });
  });
});