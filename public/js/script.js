// Bulma provided JS
$(document).ready(function () {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active")
        $(".navbar-menu").toggleClass("is-active")

    })
})

// If on the post creation page, toggle form visibility
if (window.location.pathname == '/posts/create') {
    $('select#content-type').on('change', () => {
        $('.switch-container').css('display', 'none')
        const opt = $('#content-type>option:selected').val()
        switch (opt) {
            case 'general':
                $('#gen-layout').toggle()
                break
            case 'item':
                $('#item-layout').toggle()
                break
        }
    })
    $('select#item-type').on('change', () => {
        $('.item-container').css('display', 'none')
        const opt = $('#item-type>option:selected').val()
        switch (opt) {
            case 'offensive':
                $('#off-layout').toggle()
                break
            case 'defensive':
                $('#def-layout').toggle()
                break
            case 'misc':
                $('#misc-layout').toggle()
                break
        }
    })
}

// If on individual edit page, toggle form visibility
if (window.location.pathname.substr(-5) == '/edit') {
    $('select#item-type').on('change', () => {
        $('.item-container').css('display', 'none')
        const opt = $('#item-type>option:selected').val()
        switch (opt) {
            case 'offensive':
                $('#off-layout').toggle()
                break
            case 'defensive':
                $('#def-layout').toggle()
                break
            case 'misc':
                $('#misc-layout').toggle()
                break
        }
    })
}

// If there is a delete button, perform ajax request on click
if (!!$('#delete').length) {
    const id = $('#delete').attr('data-id')
    $('#delete').on('click', () => {
        $.ajax({
            url: `/posts/${id}`,
            type: 'DELETE',
        }).then(() => window.location.href = '/posts')
    })
}

// If there is a delete all button (dashboard only), perform ajax request on click
if (!!$('#delete-all').length) {
    $('#delete-all').on('click', () => {
        $.ajax({
            url: `/posts/all`,
            type: 'DELETE',
            success: () => {
                window.location.href = '/posts'
            }
        }).then(() => window.location.href = '/posts')
    })
}

// If there is a seed button (dashboard only), perform ajax request on click
if (!!$('#seed').length) {
    $('#seed').on('click', () => {
        $.ajax({
            url: `/posts/seed`,
            type: 'POST',
        }).then(() => window.location.href = '/posts')
    })
}

// If there are tabs (dashboard only), toggle visibility
if (!!$('.dashtab').length) {
    $('.dashtab').on('click', function (evt) {
        $(this).addClass('is-active')
        $(this).siblings().removeClass('is-active')
        $('.tab-container').css('display', 'none')
        const opt = $(this).attr('id')
        switch (opt) {
            case 'my-posts':
                $('#post-layout').toggle()
                break
            case 'my-favorites':
                $('#fav-layout').toggle()
                break
            case 'my-collections':
                $('#coll-layout').toggle()
                break
        }
    })
}
