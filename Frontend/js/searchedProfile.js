let userId;

function getPublicationIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}
function getProfile() {
    userId = getPublicationIdFromURL();
    const token = sessionStorage.getItem("token");
    axios.get(`http://localhost:8080/api/users/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
        .then(response => {
            const { user, publications } = response.data;
            createProfile(user);
            getLikedPublis(publications);
            if (response.headers.get("Novo-Token")) {
                const novoToken = response.headers.get("Novo-Token");
                sessionStorage.setItem("token", novoToken);
            }
        })
        .catch(error => {
            console.error(error);
            if (error.response.headers.get("Novo-Token")) {
                const novoToken = response.headers.get("Novo-Token");
                sessionStorage.setItem("token", novoToken);
            }
            if (error.response.status === 403) {
                Swal.fire({
                    title: 'Sessão Finalizada!!',
                    text: 'Por favor, faça Login 🙏🙏',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 3000
                }).then(function () {
                    window.location.href = 'testLog.html';
                });
            }
        });
}

function createProfile(user) {
    var divUsuario = document.getElementById("userInfos");

    var divCardUsuario = document.createElement("div");
    divCardUsuario.className = "card border-right-0";

    var divCardBody = document.createElement("div");
    divCardBody.className = "card-body";

    var imgUsuario = document.createElement("img");
    imgUsuario.className = "rounded-circle mx-auto d-block img-fluid";
    imgUsuario.alt = "Imagem do usuário";
    imgUsuario.style.maxWidth = "200px";
    imgUsuario.style.height = "200px";
    const profileImageUrl = `http://localhost:8080/imagens/profile/${user.profileImage}`;
    const cleanProfileImageUrl = profileImageUrl.replace("uploads\\", "");
    const cleanProfileImageUrl2 = cleanProfileImageUrl.replace("Profiles\\", "");
    axios.get(cleanProfileImageUrl2, { responseType: "blob" })
        .then(response => {
            if (response.status === 200) {
                const objectUrl = URL.createObjectURL(response.data);
                imgUsuario.src = objectUrl;
            } else {
                throw new Error("Erro ao recuperar a imagem de perfil.");
            }
        })
        .catch(error => {
            console.error(error);
        });

    var h4Nome = document.createElement("h4");
    h4Nome.className = "card-title mt-3 text-center";
    h4Nome.textContent = user.nameUser;

    var verificationIcon = document.createElement("i");
    verificationIcon.className = "bi bi-patch-check-fill text-primary ml-1";
    verificationIcon.setAttribute("aria-label", "Usuário verificado");
    verificationIcon.setAttribute("data-toggle", "tooltip");
    verificationIcon.setAttribute("data-placement", "top");

    if (user.verified) {
        h4Nome.appendChild(verificationIcon);
    }

    var h6Usuario = document.createElement("h6");
    h6Usuario.className = "card-subtitle mb-2 text-muted text-center";
    h6Usuario.textContent = "@" + user.arroba;

    var divBio = document.createElement("div");
    divBio.id = "bio";

    var pBio = document.createElement("p");
    pBio.className = "card-text mt-3";
    pBio.textContent = user.bio;

    divCardBody.appendChild(imgUsuario);
    divCardBody.appendChild(h4Nome);
    divCardBody.appendChild(h6Usuario);
    divBio.appendChild(pBio);
    divCardBody.appendChild(divBio);
    divCardUsuario.appendChild(divCardBody);

    divUsuario.appendChild(divCardUsuario);
}

function getLikedPublis(publications) {
    let likedPublications = [];
    const token = sessionStorage.getItem("token");
    axios.get("http://localhost:8080/api/posts/liked", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            likedPublications = response.data;
            createPubli(publications, likedPublications);
        })
        .catch(error => {
            console.error(error);
            likedPublications[0] = 0;
            createPubli(publications, likedPublications);
        })
}

function createPubli(publications, likedPublications) {
    var divPublicacoes = document.getElementById("listPublications");
    divPublicacoes.innerHTML = "";
    publications.forEach(publication => {
        const publicationElement = document.createElement("div");
        publicationElement.classList.add("flex-column", "mb-3");

        const rowElement = document.createElement("div");
        rowElement.classList.add("row", "mb-3");

        const profileImageElement = document.createElement("div");
        profileImageElement.classList.add("col-2", "col-md-1");

        const profileImage = document.createElement("img");
        profileImage.classList.add("img-fluid", "rounded-circle");
        profileImage.style.maxWidth = "50px";
        profileImage.style.height = "50px";
        profileImage.alt = "User Profile Picture";

        const profileImageUrl = `http://localhost:8080/imagens/profile/${publication.user.profileImage}`;
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

        profileImageElement.appendChild(profileImage);

        const publicationInfoElement = document.createElement("div");
        publicationInfoElement.classList.add("col-9", "col-md-10");

        const usernameElement = document.createElement("h5");
        usernameElement.classList.add("mb-0");

        const nameUserElement = document.createElement("span");
        nameUserElement.innerHTML = publication.user.nameUser;

        const arrobaElement = document.createElement("small");
        arrobaElement.innerHTML = ` @${publication.user.arroba}`;

        if (publication.user.verified) {
            const verificationIcon = document.createElement("i");
            verificationIcon.classList.add("bi", "bi-patch-check-fill", "text-primary", "ml-1");
            verificationIcon.title = "Usuário verificado";
            verificationIcon.setAttribute("aria-label", "Usuário verificado");
            verificationIcon.setAttribute("data-toggle", "tooltip");
            verificationIcon.setAttribute("data-placement", "top");


            usernameElement.appendChild(nameUserElement);
            usernameElement.appendChild(verificationIcon);
            usernameElement.appendChild(arrobaElement);
        } else {
            usernameElement.innerHTML = `${nameUserElement.innerHTML} ${arrobaElement.outerHTML}`;
        }

        const textElement = document.createElement("p");
        textElement.classList.add("mb-0");
        textElement.innerHTML = publication.text;

        publicationInfoElement.appendChild(usernameElement);
        publicationInfoElement.appendChild(textElement);

        if (publication.img && publication.img.length > 0) {
            const imagesContainer = document.createElement("div");
            imagesContainer.classList.add("grid");

            let numColumns = Math.min(publication.img.length, 2);
            let numRows = Math.ceil(publication.img.length / numColumns);

            imagesContainer.style.gridTemplateColumns = `repeat(${numColumns}, 220px)`;
            imagesContainer.style.gridTemplateRows = `repeat(${numRows}, 220px)`;

            for (let i = 0; i < publication.img.length; i++) {
                const imageElement = document.createElement("img");
                imageElement.classList.add("img-fluid", "fixed-size", "grid-item");
                imageElement.style.width = "220px";
                imageElement.style.height = "220px";

                const imageUrl = `http://localhost:8080/imagens/${publication.img[i]}`;
                const cleanImageUrl = imageUrl.replace("uploads\\", "");
                axios
                    .get(cleanImageUrl, { responseType: "blob" })
                    .then(response => {
                        if (response.status === 200) {
                            const objectUrl = URL.createObjectURL(response.data);
                            imageElement.src = objectUrl;
                        } else {
                            throw new Error("Erro ao recuperar a imagem.");
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });

                imageElement.alt = `Image ${i + 1}`;
                imageElement.id = "image-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
                imageElement.addEventListener("click", openImage);

                const imageGroup = document.createElement("div");
                imageGroup.classList.add("grid-itens");

                imageGroup.appendChild(imageElement);
                imagesContainer.appendChild(imageGroup);
            }

            publicationInfoElement.appendChild(imagesContainer);

        }

        const timeElement = document.createElement("small");
        timeElement.classList.add("text-muted");
        const formattedDate = moment(publication.date).format("H:mm · D [/] MM [/] YYYY");
        timeElement.innerHTML = formattedDate;

        const divEditButton = document.createElement("div");
        divEditButton.classList.add("row", "d-flex", "align-items-start");

        publicationInfoElement.appendChild(timeElement);

        rowElement.appendChild(profileImageElement);
        rowElement.appendChild(publicationInfoElement);
        rowElement.appendChild(divEditButton);

        const actionButtonsElement = document.createElement("div");
        actionButtonsElement.classList.add("d-flex", "justify-content-around");

        const commentButton = document.createElement("button");
        commentButton.type = "button";
        commentButton.classList.add("btn", "btn-outline-primary", "btn-sm");
        commentButton.id = "btn_Comment";
        commentButton.innerHTML = '<i class="bi bi-chat"></i> Comentar';
        commentButton.dataset.publicationId = publication.id;
        commentButton.onclick = function () {
            redirectToCommentsPage(this.dataset.publicationId);
        };

        const likeButton = document.createElement("button");
        likeButton.type = "button";
        likeButton.classList.add("btn", "btn-outline-primary", "btn-sm");
        likeButton.dataset.publicationId = publication.id;
        likeButton.id = `likeButton-${publication.id}`;

        const hasLiked = likedPublications.some(likedPublication => likedPublication.id === publication.id);
        if (hasLiked) {
            likeButton.classList.add("btn-primary");
            likeButton.classList.remove("btn-outline-primary");
        }
        if (likedPublications[0] === 0) {
            likeButton.disabled = true;
        }
        likeButton.onclick = function () {
            const publicationId = this.dataset.publicationId;
            const token = sessionStorage.getItem("token");

            axios
                .post(
                    `http://localhost:8080/api/posts/${publicationId}/like`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                )
                .then((response) => {
                    const likes = response.data;
                    const likeCountElement = document.getElementById(`likeCount-${publicationId}`);
                    likeCountElement.innerHTML = likes;
                    const button = document.getElementById(`likeButton-${publicationId}`);
                    if (button.classList.contains("btn-primary")) {
                        button.classList.remove("btn-primary");
                        button.classList.add("btn-outline-primary");
                    } else {
                        button.classList.add("btn-primary");
                        likeButton.classList.remove("btn-outline-primary");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        const likeIcon = document.createElement("i");
        likeIcon.classList.add("fa-solid", "fa-paw");

        const likeCount = document.createElement("span");
        likeCount.classList.add("ml-1");
        likeCount.id = `likeCount-${publication.id}`;
        likeCount.innerHTML = publication.likesCount;

        likeButton.appendChild(likeIcon);
        likeButton.innerHTML += " Curtir";
        likeButton.appendChild(likeCount);

        actionButtonsElement.appendChild(commentButton);
        actionButtonsElement.appendChild(likeButton);

        publicationElement.appendChild(rowElement);
        publicationElement.appendChild(actionButtonsElement);

        divPublicacoes.appendChild(publicationElement);
    });
}
function redirectToCommentsPage(publicationId) {
    window.location.href = `test3.html?id=${publicationId}`;
}

function openImage(event) {
    const publicationElement = event.target.closest(".grid");
    const images = Array.from(publicationElement.querySelectorAll(".grid-item"));
    const totalImages = images.length;
    const imageId = event.target.id;
    const imageElement = document.getElementById(imageId);

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const originalImage = document.createElement("img");
    originalImage.src = imageElement.src;
    originalImage.alt = imageElement.alt;

    imageContainer.appendChild(originalImage);

    const prevButton = document.createElement("button");
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.classList.add("prev-button");
    prevButton.addEventListener("click", navigateImages.bind(null, -1));
    modal.appendChild(prevButton);

    const nextButton = document.createElement("button");
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.classList.add("next-button");
    nextButton.addEventListener("click", navigateImages.bind(null, 1));
    modal.appendChild(nextButton);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(prevButton);
    buttonContainer.appendChild(nextButton);

    imageContainer.appendChild(buttonContainer);

    modal.appendChild(imageContainer);

    const closeButton = document.createElement("button");
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.classList.add("close-button");
    closeButton.addEventListener("click", () => {
        document.body.removeChild(modal);
    });
    modal.appendChild(closeButton);

    document.body.appendChild(modal);

    let currentIndex = Array.prototype.indexOf.call(images, imageElement);

    function navigateImages(direction) {
        currentIndex += direction;

        if (currentIndex < 0) {
            currentIndex = totalImages - 1;
        } else if (currentIndex >= totalImages) {
            currentIndex = 0;
        }

        originalImage.src = images[currentIndex].src;
        originalImage.alt = images[currentIndex].alt;
    }

}