function updateInfo() {
    let profilePictureInput = document.getElementById("post-image");
    let username = document.getElementById("username").value;
    let arroba = document.getElementById("arroba").value;
    let bio = document.getElementById("bio").value;

    let profilePicture = profilePictureInput.files[0];

    let formData = new FormData();
    if (username !== null) {
        formData.append("nameUser", username);
    }
    if (arroba !== null) {
        formData.append("arroba", arroba);
    }
    if (bio !== null) {
        formData.append("bio", bio);
    }
    if (profilePicture !== null) {
        formData.append("profileImage", profilePicture);
    }

    const token = sessionStorage.getItem('token');
    axios.put("http://localhost:8080/api/users/update", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        }
    })
        .then(function (response) {
            console.log(response.data);
            Swal.fire({
                title: 'Atualização de dados realizada!',
                text: 'Os dados foram atualizados com sucesso.',
                icon: 'success',
                showConfirmButton: true,
                timer: 4000
            }).then(function () {
                window.location.href = 'PagFeed.html';
            });
        })
        .catch(function (error) {
            console.log(error);
            if (error.response.status === 403) {
                Swal.fire({
                    title: 'Sessão Finalizada!!',
                    text: 'Por favor, faça Login 🙏🙏',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 3000
                }).then(function () {
                    window.location.href = 'PagLogin.html';
                });
            }else if (error.response) {
                let errorMessage = error.response.data; 
                console.log(errorMessage);
                Swal.fire({
                    title: 'Atualização de dados não realizada!',
                    text: errorMessage,
                    icon: 'error',
                    showConfirmButton: true
                })
              } else {
                console.log("Ocorreu um erro na requisição:", error.message);
              }
            
        });
}