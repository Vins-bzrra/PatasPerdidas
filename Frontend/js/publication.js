document.addEventListener('DOMContentLoaded', function () {
    const publishButton = document.getElementById('publish-button');
    const postText = document.getElementById('post-text');
    const imagePreview = document.getElementById('image-grid');
    const publishForm = document.getElementById('publish-form');

    let inputLocation = document.getElementById('post-location');
    let autocomplete = new google.maps.places.Autocomplete(inputLocation);
    let latitude = '';
    let longitude = '';
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (place.geometry) {
            console.log("latPlace: " + latitude);
            console.log("lonPlace: " + longitude);
            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();
        }
    });

    function publication() {
        console.log("latPubli: " + latitude);
        console.log("lonPubli: " + longitude);
        var formData = new FormData();
        formData.append('text', postText.value);

        if (latitude && longitude) {
            formData.append('latitude', latitude);
            formData.append('longitude', longitude);
        }

        if (!(latitude || longitude)) {
            formData.append('latitude', 0);
            formData.append('longitude', 0);
        }


        const previewImages = imagePreview.querySelectorAll("img");
        const imagePromises = Array.from(previewImages).map(function (imgElement) {
            const imageId = imgElement.id;

            return fetch(imgElement.src)
                .then(response => response.blob())
                .then(blob => {
                    const file = new File([blob], imageId, { type: blob.type });
                    formData.append('images', file, imageId);
                });
        });

        Promise.all(imagePromises)
            .then(() => {
                const token = sessionStorage.getItem('token');

                axios.post('http://localhost:8080/api/posts/new', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}` 
                    },
                    withCredentials: true
                })
                    .then(response => {
                        console.log(response);
                        postText.value = '';
                        imagePreview.innerHTML = '';
                        inputLocation.value = '';
                        latitude = '';
                        longitude = '';
                        publishButton.disabled = true;
                        let message = response.data;
                        getLatestPublications();
                        if (response.headers.get("NewToken")) {
                            const novoToken = response.headers.get("NewToken");
                            sessionStorage.setItem("token", novoToken);
                        }
                        Swal.fire({
                            title: 'Publicação realizada!!',
                            text: message,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                    .catch(error => {
                        if (error.response.headers.get("NewToken")) {
                            const novoToken = response.headers.get("NewToken");
                            sessionStorage.setItem("token", novoToken);
                        }
                        if (error.response.status === 403) {
                            Swal.fire({
                                title: 'Sessão Finalizada!!',
                                text: 'Por favor, faça login 🙏🙏',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 3000
                            }).then(function () {
                                window.location.href = 'PagLogin.html';
                            }); 
                        }
                        console.error(error);
                        alert('Ocorreu um erro ao tentar publicar.');
                        Swal.fire({
                            title: 'Falha ao realizar publicação!!',
                            text: 'Ocorreu um erro ao criar a publicação, tente novamente 😅😅',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 3000
                        })
                    });
            })
            .catch(error => {
                console.error(error);
                alert('Ocorreu um erro ao tentar obter as imagens.');
            });
    }

    
    publishForm.addEventListener('submit', function (event) {
        event.preventDefault();
        publication();
    });
});

function getLatestPublications() {
    console.log("Entrou no latestPubli")
    const token = sessionStorage.getItem("token");
    axios.get('http://localhost:8080/api/posts/latest', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            console.log(response.data);
            const publications = response.data;
            getLikedPublis(publications);
            const newTokenHeader = response.headers['newtoken'];
            if (newTokenHeader) {
                const novoToken = newTokenHeader;
                sessionStorage.setItem('token', novoToken);
            }
        })
        .catch(error => {
            console.error('Erro ao obter as publicações:', error);
            const headers = error.response.headers;
            const newTokenHeader = error.response.headers['newtoken'];
            if (newTokenHeader) {
                const novoToken = newTokenHeader;
                sessionStorage.setItem('token', novoToken);
            }
            if (error.response.status === 403) {
                Swal.fire({
                    title: 'Sessão Finalizada!!',
                    text: 'Por favor, faça Login 🙏🙏',
                    icon: 'success',
                    showConfirmButton: true,
                }).then(function () {
                    window.location.href = 'PagLogin.html';
                });
            }
        });
}

function getLikedPublis(publications) {
    let likedPublications = [];
    const token = sessionStorage.getItem("token");
    axios.get("http://localhost:8080/api/posts/liked", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then(response => {
            likedPublications = response.data;
            updateFeed(publications, likedPublications);

            if (response.headers.get("NewToken")) {
                const novoToken = response.headers.get("NewToken");
                sessionStorage.setItem("token", novoToken);
            }
        })
        .catch(error => {
            console.error(error);
            if (error.response.headers.get("NewToken")) {
                const novoToken = response.headers.get("NewToken");
                sessionStorage.setItem("token", novoToken);
            }
            likedPublications[0] = 0;
            updateFeed(publications, likedPublications);
        })
}

function updateFeed(publications, likedPublications) {
    const feedContainer = document.getElementById("feed");
    feedContainer.innerHTML = ""; 

    publications.forEach(publication => {
        const publicationElement = document.createElement("div");
        publicationElement.classList.add("flex-column", "mb-4", "ml-3", "mt-3");

        const rowElement = document.createElement("div");
        rowElement.classList.add("row", "mb-3");

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

        const publicationInfoElement = document.createElement("div");
        publicationInfoElement.classList.add("col-10", "col-md-11");

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

        console.log("Adress: " + address);
        const timeElement = document.createElement("small");
        timeElement.classList.add("text-muted");
        const formattedDate = moment(publication.date).format("H:mm · D [/] MM [/] YYYY");
        timeElement.innerHTML = formattedDate;


        publicationInfoElement.appendChild(timeElement);

        rowElement.appendChild(profileImageElement);
        rowElement.appendChild(publicationInfoElement);

        const actionButtonsElement = document.createElement("div");
        actionButtonsElement.classList.add("d-flex", "justify-content-around", "mr-5");

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
        likeButton.classList.add("btn", "btn-outline-primary", "btn-sm", "mr-5", "publicationButtons");
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

            axios.post(`http://localhost:8080/api/posts/${publicationId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
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
                        button.classList.remove("btn-outline-primary");
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

        feedContainer.appendChild(publicationElement);
    });
}
function startPeriodicRequest() {
    getLatestPublications();

    setInterval(getLatestPublications, 300000);
}
function redirectToCommentsPage(publicationId) {
    window.location.href = `PagComentarios.html?id=${publicationId}`;
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


function handlePostSuccess(response) {
    console.log(response);
    postText.value = '';
    imagePreview.innerHTML = '';
    publishButton.disabled = true;
    let message = response.data;
    getLatestPublications();
    if (response.headers.get("NewToken")) {
        const novoToken = response.headers.get("NewToken");
        sessionStorage.setItem("token", novoToken);
    }
    Swal.fire({
        title: 'Publicação realizada!!',
        text: message,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
    });
}

function handlePostError(error) {
    if (error.response.headers.get("NewToken")) {
        const novoToken = response.headers.get("NewToken");
        sessionStorage.setItem("token", novoToken);
    }
    if (error.response.status === 403) {
        Swal.fire({
            title: 'Sessão Finalizada!!',
            text: 'Por favor, faça login 🙏🙏',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000
        }).then(function () {
            window.location.href = 'PagLogin.html';
        });
    }
    console.error(error);
    alert('Ocorreu um erro ao tentar publicar.');
    Swal.fire({
        title: 'Falha ao realizar publicação!!',
        text: 'Ocorreu um erro ao criar a publicação, tente novamente 😅😅',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000
    });
}

window.addEventListener('load', startPeriodicRequest);