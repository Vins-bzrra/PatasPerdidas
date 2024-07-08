let publicationId;

function getPublicationIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

function getPublication() {
    publicationId = getPublicationIdFromURL();
    const token = sessionStorage.getItem("token");
    axios.get(`http://localhost:8080/api/posts/id/${publicationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            const { publication, comments, user } = response.data;

            createCommentPage(publication);
            createFormComment(user);
            createCommmets(comments);

            if (response.headers.get("Novo-Token")) {
                console.log(response.headers.get("Novo-Token"));
                const novoToken = response.headers.get("Novo-Token");
                sessionStorage.setItem("token", novoToken);
            }
        })
        .catch(error => {
            console.error(error);
            if (error.response.headers.get("Novo-Token")) {
                console.log(error.response.headers.get("Novo-Token"));
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
                    window.location.href = 'PagLogin.html';
                });
            }
        });
}

function createCommentPage(publication) {

    const publicationElement = document.createElement("div");
    publicationElement.classList.add("flex-column", "mb-3", "mb-4", "ml-5", "mt-3");

    const publicationRowElement = document.createElement("div");
    publicationRowElement.classList.add("row", "mb-3");

    const profileImageElement = document.createElement("div");
    profileImageElement.classList.add("col-2", "col-md-1");

    const profileImage = document.createElement("img");
    profileImage.classList.add("img-fluid", "rounded-circle");
    profileImage.style.width = "50px";
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

    const publicationContentElement = document.createElement("div");
    publicationContentElement.classList.add("col-10", "col-md-11");

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
    textElement.classList.add("mb-1");
    textElement.innerHTML = publication.text;

    publicationContentElement.appendChild(usernameElement);
    publicationContentElement.appendChild(textElement);

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

        publicationContentElement.appendChild(imagesContainer);

    }

    let address = '';

        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${publication.location.latitude}&lon=${publication.location.longitude}`)
            .then(response => response.json())
            .then(data => {
                const road = data.address.road || data.address.street; 
                const neighbourhood = data.address.neighbourhood || data.address.suburb || data.address.village; 
                const postalCode = data.address.postcode; 

                if (road) {
                    address += road;
                }
                if (neighbourhood) {
                    if (address) {
                        address += `, ${neighbourhood}`;
                    } else {
                        address += neighbourhood;
                    }
                }
                if (postalCode) {
                    if (address) {
                        address += `, ${postalCode}`;
                    } else {
                        address += postalCode;
                    }
                }

                const mapsLink = document.createElement("a");
                const encodedAddress = encodeURIComponent(address); 
                mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                mapsLink.target = "_blank"; 
                mapsLink.innerText = address;

                const location = document.createElement("span");
                location.classList.add("ml-3");
                
                location.appendChild(mapsLink);

                timeElement.appendChild(location);

            })
            .catch(error => {
                console.error('Erro ao obter endereço:', error);
            });

    const timeElement = document.createElement("small");
    timeElement.classList.add("text-muted");
    const formattedDate = moment(publication.date).format("H:mm · D [/] MM [/] YYYY");
    timeElement.innerHTML = formattedDate;

    publicationContentElement.appendChild(timeElement);

    publicationRowElement.appendChild(profileImageElement);
    publicationRowElement.appendChild(publicationContentElement);

    publicationElement.appendChild(publicationRowElement);

    const publicationContainerElement = document.getElementById("publicationContainer");
    publicationContainerElement.appendChild(publicationElement);

}

function createFormComment(user) {

    const separatorElement = document.createElement("hr");
    separatorElement.classList.add("comment-separator");

    const commentAreaElement = document.createElement("div");
    commentAreaElement.classList.add("comment-area", "mt-5");

    const profileImage = document.createElement("img");
    profileImage.classList.add("img-fluid", "rounded-circle");
    profileImage.style.width = "50px";
    profileImage.style.height = "50px";
    profileImage.alt = "User Profile Picture";
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

    const commentFormElement = document.createElement("form");
    commentFormElement.classList.add("comment-form", "ml-3");
    commentFormElement.method = "POST";

    const commentInputWrapperElement = document.createElement("div");
    commentInputWrapperElement.classList.add("comment-input-wrapper", "mb-2");

    const commentTextareaElement = document.createElement("textarea");
    commentTextareaElement.classList.add("comment-input");
    commentTextareaElement.id = "comment";
    commentTextareaElement.placeholder = "Digite seu comentário...";
    commentTextareaElement.rows = 3;

    commentInputWrapperElement.appendChild(commentTextareaElement);

    const commentButtonElement = document.createElement("button");
    commentButtonElement.classList.add("comment-button");
    commentButtonElement.type = "submit";
    commentButtonElement.textContent = "Comentar";

    commentFormElement.appendChild(commentInputWrapperElement);
    commentFormElement.appendChild(commentButtonElement);

    commentAreaElement.appendChild(profileImage);
    commentAreaElement.appendChild(commentFormElement);

    const containerElement = document.querySelector("#formComment");
    containerElement.appendChild(separatorElement);
    containerElement.appendChild(commentAreaElement);
    containerElement.appendChild(separatorElement.cloneNode(true));

    commentFormElement.addEventListener("submit", function (event) {
        event.preventDefault();
        enviarComentario();
    });
}

function createCommmets(comments) {
    const commentsContainerElement = document.getElementById("commentsContainer");
    comments.forEach((comment) => {

        const commentElement = document.createElement("div");
        commentElement.classList.add("flex-column", "mt-2", "ml-2", "mb-5");

        const commentRowElement = document.createElement("div");
        commentRowElement.classList.add("row", "mb-3");

        const commentImageElement = document.createElement("div");
        commentImageElement.classList.add("col-2", "col-md-1");

        const profileImage = document.createElement("img");
        profileImage.classList.add("img-fluid", "rounded-circle");
        profileImage.style.width = "50px";
        profileImage.style.height = "50px";
        profileImage.alt = "Imagem do usuário";

        const profileImageUrl = `http://localhost:8080/imagens/profile/${comment.user.profileImage}`;
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
        commentImageElement.appendChild(profileImage);

        const commentBodyElement = document.createElement("div");
        commentBodyElement.classList.add("col-10", "col-md-11");

        const commentUserElement = document.createElement("h5");
        commentUserElement.classList.add("mt-0");

        const nameUserElement = document.createElement("span");
        nameUserElement.innerHTML = comment.user.nameUser;

        const arrobaElement = document.createElement("small");
        arrobaElement.innerHTML = ` @${comment.user.arroba}`;

        if (comment.user.verified) {
            const verificationIcon = document.createElement("i");
            verificationIcon.classList.add("bi", "bi-patch-check-fill", "text-primary", "ml-1");
            verificationIcon.title = "Usuário verificado";
            verificationIcon.setAttribute("aria-label", "Usuário verificado");
            verificationIcon.setAttribute("data-toggle", "tooltip");
            verificationIcon.setAttribute("data-placement", "top");

            commentUserElement.appendChild(nameUserElement);
            commentUserElement.appendChild(verificationIcon);
            commentUserElement.appendChild(arrobaElement);
        } else {
            commentUserElement.innerHTML = `${nameUserElement.innerHTML} ${arrobaElement.outerHTML}`;
        }

        const commentContentElement = document.createElement("p");
        commentContentElement.classList.add("mb-0");
        commentContentElement.innerText = comment.text;

        const commentDateElement = document.createElement("small");
        commentDateElement.classList.add("text-muted");
        const formattedDate = moment(comment.date).format("H:mm · D [/] MM [/] YYYY");
        commentDateElement.innerHTML = formattedDate;


        commentBodyElement.appendChild(commentUserElement);
        commentBodyElement.appendChild(commentContentElement);
        commentBodyElement.appendChild(commentDateElement);

        commentRowElement.appendChild(commentImageElement);
        commentRowElement.appendChild(commentBodyElement);

        commentElement.appendChild(commentRowElement);

        commentsContainerElement.appendChild(commentElement);
    });
}

function enviarComentario() {
    const comentarioTextarea = document.getElementById("comment");
    const text = comentarioTextarea.value;

    if (text.trim() === "") {
        alert("Por favor, digite um comentário.");
        return;
    }

    const token = sessionStorage.getItem("token");

    console.log(publicationId);

    console.log(text);

    axios.post("http://localhost:8080/api/posts/comment", { text }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Publication-Id': publicationId
        }
    })
        .then(response => {
            console.log("Comentário enviado com sucesso!");
            comentarioTextarea.value = "";
            if (response.headers.get("Novo-Token")) {
                console.log(response.headers.get("Novo-Token"));
                const novoToken = response.headers.get("Novo-Token");
                sessionStorage.setItem("token", novoToken);
            }

            atualizarListaComentarios();
        })
        .catch(error => {
            console.error("Erro ao enviar o comentário:", error);
            if (error.response.headers.get("Novo-Token")) {
                console.log(error.response.headers.get("Novo-Token"));
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
                    window.location.href = 'PagLogin.html';
                });
            }
        });
}

function atualizarListaComentarios() {
    const token = sessionStorage.getItem("token");
    axios.get(`http://localhost:8080/api/posts/id/${publicationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then(response => {
            const { comments } = response.data;

            const commentsContainerElement = document.getElementById("commentsContainer");
            commentsContainerElement.innerHTML = "";

            if (response.headers.get("Novo-Token")) {
                console.log(response.headers.get("Novo-Token"));
                const novoToken = response.headers.get("Novo-Token");
                sessionStorage.setItem("token", novoToken);
            }
            createCommmets(comments);
        })
        .catch(error => {
            console.error(error);
            if (error.response.headers.get("Novo-Token")) {
                console.log(error.response.headers.get("Novo-Token"));
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
                    window.location.href = 'PagLogin.html';
                });
            }
        });
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