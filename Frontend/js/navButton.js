document.addEventListener('DOMContentLoaded', function(){
    $('.navbar-toggler').on('click', function () {
        var target = $(this).attr('data-target');
        $(target).toggleClass('show');
    });

    $('.dropdown a.dropdown-toggle').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });
})