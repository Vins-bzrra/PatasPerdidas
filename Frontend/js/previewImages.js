function previewProfile() {
  var profilePictureInput = document.getElementById("post-image");
  var imagePreview = document.getElementById("profile-picture");
  var cadastrarButton = document.getElementById("cadastrar-button");

  var imageCount = 0;
  var currentImage = null;

  cadastrarButton.disabled = true;

  profilePictureInput.addEventListener("change", function (event) {
    var file = event.target.files[0];

    if (currentImage) {
      currentImage.parentNode.remove();
      imageCount--;
    }

    addImageToPreview(file);

    event.target.value = null;
    checkFormFields();

  });

  var formFields = document.querySelectorAll(
    'input:not([type="file"]), textarea'
  );
  formFields.forEach(function (field) {
    field.addEventListener("input", checkFormFields);
  });

  var emailInput = document.getElementById('email');
  var emailError = document.getElementById('email-error');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  emailInput.addEventListener('input', function () {
    var email = emailInput.value;

    if (!emailPattern.test(email)) {
      emailError.textContent = 'Digite um endereço de e-mail válido';
      emailInput.classList.add('is-invalid');
    } else {
      emailError.textContent = '';
      emailInput.classList.remove('is-invalid');
    }
    checkFormFields();
  });

  function checkFormFields() {


    var allFieldsFilled = true;
    formFields.forEach(function (field) {
      if (field.value === '') {
        allFieldsFilled = false;
      }
    });

    var profilePictureFilled = imageCount > 0;
    var senha = document.getElementById('senha').value;
    var confirmarSenha = document.getElementById('confirmar-senha').value;

    var passwordsMatch = senha === confirmarSenha;
    var validEmail = emailPattern.test(emailInput.value);

    cadastrarButton.disabled = !(allFieldsFilled && profilePictureFilled && passwordsMatch && validEmail);
  }

  function addImageToPreview(file) {
    var img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.classList.add("img-fluid", "rounded-circle");
    img.style.width = "200px";
    img.style.height = "200px";

    var imageId = "image-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    img.id = imageId;

    var div = document.createElement("div");
    div.classList.add("preview-image", "d-flex");
    div.appendChild(img);

    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-image", "btn", "btn-danger", "btn-sm", "position-absolute");
    deleteButton.innerHTML = "x";
    deleteButton.addEventListener("click", function (event) {
      event.target.parentNode.remove();
      imageCount--;
      profilePictureInput.disabled = false;
      currentImage = null;
      checkFormFields();
    });

    div.appendChild(deleteButton);
    imagePreview.appendChild(div);
    imageCount++;
    profilePictureInput.disabled = true;

    currentImage = div;
  }
}

function previewImgPublication() {
  var imagePublicationInput = document.getElementById("post-image");
  var saveButton = document.getElementById("publish-button");

  saveButton.disabled = true;
  var imageCount = 0;
  var files = [];

  function addImageToGrid(file) {
      var imageGrid = document.getElementById("image-grid");

      var img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.classList.add("img-fluid");
      img.style.width = "220px";
      img.style.height = "220px";

      var imageId = "image-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
      img.id = imageId;

      var div = document.createElement("div");
      div.classList.add("gridPreview-item", "d-flex");
      div.appendChild(img);

      var deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-image", "btn", "btn-danger", "btn-sm", "position-absolute");
      deleteButton.innerHTML = "x";
      deleteButton.addEventListener("click", function (event) {
          var imageElement = event.target.parentNode.firstChild;
          var imageId = imageElement.id;
          imageElement.parentNode.remove();
          imageCount--;

          files = files.filter(function (f) {
              return f.name !== file.name;
          });

          updateImageGridClasses();
          if (imageCount < 4) {
              imagePublicationInput.disabled = false;
          }
      });
      div.appendChild(deleteButton);
      imageGrid.appendChild(div);
      imageCount++;
      console.log(imageCount);

      updateImageGridClasses();
  }

  function updateImageGridClasses() {
      var imageGrid = document.getElementById("image-grid");
      imageGrid.classList.remove("grid-empty", "grid-one", "grid-two", "grid-three", "grid-four");

      if (imageCount === 0) {
          imageGrid.classList.add("grid-empty");
      } else if (imageCount === 1) {
          imageGrid.classList.add("grid-one");
      } else if (imageCount === 2) {
          imageGrid.classList.add("grid-two");
      } else if (imageCount === 3) {
          imageGrid.classList.add("grid-three");
      } else if (imageCount >= 4) {
          imageGrid.classList.add("grid-four");
          imagePublicationInput.disabled = true;
      }
  }

  function handleFileSelection(event) {
      var selectedFiles = event.target.files;
      for (var i = 0; i < selectedFiles.length; i++) {
          var file = selectedFiles[i];
          files.push(file);
          addImageToGrid(file);
      }

      event.target.value = null;
  }

  imagePublicationInput.addEventListener("change", handleFileSelection);
}

function previewEdit() {
  var profilePictureInput = document.getElementById("post-image");
  var imagePreview = document.getElementById("profile-picture");

  var imageCount = 0;
  var currentImage = null;

  profilePictureInput.addEventListener("change", function (event) {
    var file = event.target.files[0];

    if (currentImage) {
      currentImage.parentNode.remove();
      imageCount--;
    }

    addImageToPreview(file);

    event.target.value = null;

  });

  function addImageToPreview(file) {
    var img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.classList.add("img-fluid", "rounded-circle");
    img.style.width = "200px";
    img.style.height = "200px";

    var imageId = "image-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    img.id = imageId;

    var div = document.createElement("div");
    div.classList.add("preview-image", "d-flex");
    div.appendChild(img);

    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-image", "btn", "btn-danger", "btn-sm", "position-absolute");
    deleteButton.innerHTML = "x";
    deleteButton.addEventListener("click", function (event) {
      event.target.parentNode.remove();
      imageCount--;
      profilePictureInput.disabled = false;
      currentImage = null;
    });

    div.appendChild(deleteButton);
    imagePreview.appendChild(div);
    imageCount++;
    profilePictureInput.disabled = true;

    currentImage = div;
  }
}

function enablePubliButton(){
  document.getElementById("post-text").addEventListener("input", function () {
    var publishButton = document.getElementById("publish-button");
    if (this.value.trim() === "") {
        publishButton.disabled = true;
    } else {
        publishButton.disabled = false;
    }
});
}