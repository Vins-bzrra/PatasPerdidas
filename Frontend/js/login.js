function loginUser() {
  let email = document.getElementById('email').value;
  let senha = document.getElementById('senha').value;

  let usuario = {
    email: email,
    password: senha
  };

  axios.post('http://localhost:8080/api/users/login', usuario,)
    .then(response => { 
      console.log('Usuário logado');
      sessionStorage.setItem('token', response.data);
      window.location.href = 'PagFeed.html'; 
    })
    .catch(error => {
      alert('Email ou senha incorretos. Tente novamente.');
    });
}


