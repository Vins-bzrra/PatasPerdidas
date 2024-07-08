document.addEventListener('DOMContentLoaded', function () {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let updateForm = document.getElementById("updateForm");
    
    function updateData() {
        const data = {};
        if (email !== null) {
            data.email = email.value;
        }
        if (password !== null) {
            data.password = password.value;
        }

        const token = sessionStorage.getItem("token");
        axios.put("http://localhost:8080/api/users/update/data", data, {
            headers: {
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
                    window.location.href = 'PagProfile.html';
                });
            })
            .catch(function (error) {
                console.log(error);
                if (error.response) {
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

    updateForm.addEventListener('submit', function (event) {
        event.preventDefault();
        updateData();
    });

});