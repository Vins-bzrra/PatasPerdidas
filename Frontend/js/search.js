document.addEventListener('DOMContentLoaded', function () {
  function searchUsers(event) {
    event.preventDefault();

    const input = document.getElementById('searchUser');
    const searchText = input.value;

    const token = sessionStorage.getItem("token");
    axios.get(`http://localhost:8080/api/users/search/${searchText}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
      .then(function (response) {
        const searchResult = document.getElementById('searchResult');
        const userList = document.getElementById("listUser");
        userList.innerHTML = "";

        const users = response.data;

        users.forEach(user => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item", "mb-2");

          const divUser = document.createElement("div");
          divUser.classList.add("d-flex", "align-items-center");

          const profileImage = document.createElement("img");
          profileImage.alt = "User Profile";
          profileImage.classList.add("img-fluid", "rounded-circle");
          profileImage.style.width = "50px";
          profileImage.style.height = "50px";
          const profileImageUrl = `http://localhost:8080/imagens/profile/${user.profileImage}`;
          const cleanProfileImageUrl = profileImageUrl.replace("uploads\\", "");
          const cleanProfileImageUrl2 = cleanProfileImageUrl.replace("Profiles\\", "");

          axios.get(cleanProfileImageUrl2, { responseType: "blob" })
            .then(response => {
              if (response.status === 200) {
                const objectUrl = URL.createObjectURL(response.data);
                profileImage.src = objectUrl;
              } else {
                throw new Error("Erro ao recuperar a imagem de perfil.");
              }
            })
            .catch(error => {
              console.error(error);
            });

          profileImage.addEventListener("click", function () {
            const userId = user.id;
            window.location.href = `PagProfileSearched.html?id=${userId}`;
          });

          const userInfo = document.createElement("div");
          userInfo.classList.add("profile-info");

          const usernameElement = document.createElement("h5");
          usernameElement.classList.add("mb-0");

          const userName = document.createElement("span");
          userName.textContent = user.nameUser;

          const userHandle = document.createElement("small");
          userHandle.classList.add("ml-1");
          userHandle.textContent = "@" + user.arroba;
          if (user.verified) {
            const verificationIcon = document.createElement("i");
            verificationIcon.classList.add("bi", "bi-patch-check-fill", "text-primary", "ml-1");
            verificationIcon.title = "Usuário verificado";
            verificationIcon.setAttribute("aria-label", "Usuário verificado");
            verificationIcon.setAttribute("data-toggle", "tooltip");
            verificationIcon.setAttribute("data-placement", "top");

            usernameElement.appendChild(userName);
            usernameElement.appendChild(verificationIcon);
            usernameElement.appendChild(userHandle);
          } else {
            usernameElement.innerHTML = `${userName.innerHTML} ${userHandle.outerHTML}`;
          }
          const userBio = document.createElement("p");
          userBio.classList.add("user-bio");

          if (user.bio && user.bio.length > 0) {
            const truncatedBio = user.bio.substring(0, 100);
            userBio.textContent = truncatedBio + (user.bio.length > 100 ? "..." : "");
          } else {
            userBio.textContent = "";
          }
          userInfo.appendChild(usernameElement);
          userInfo.appendChild(userBio);

          divUser.appendChild(profileImage);
          divUser.appendChild(userInfo);
          listItem.appendChild(divUser);
          userList.appendChild(listItem);
          searchResult.appendChild(userList);
        });
      })
      .catch(function (error) {
        console.error(error);
        if (error.response.headers.get("Novo-Token")) {
          const novoToken = response.headers.get("Novo-Token");
          sessionStorage.setItem("token", novoToken);
        }
        if (error.response && error.response.status === 403) {
          Swal.fire({
            title: 'Sessão Finalizada!!',
            text: 'Por favor, faça Login 🙏🙏',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000
          }).then(function () {
            window.location.href = 'PagLogin.html';
          });
        }
      });
  }

  const form = document.getElementById('searchForm');
  form.addEventListener('submit', searchUsers);
});
