// Bulma provided JS
$(document).ready(function () {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");

    });
});

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

if (!!$('#delete').length) {
    const id = $('#delete').attr('data-id')
    $('#delete').on('click', () => {
        $.ajax({
            url: `/posts/${id}`,
            type: 'DELETE',
        }).then(() => window.location.href = '/posts')
    })
}

if (!!$('#delete-all').length) {
    $('#delete-all').on('click', () => {
        $.ajax({
            url: `/posts/all`,
            type: 'DELETE',
            success: () => { window.location.href = '/posts' }
        }).then(() => window.location.href = '/posts')
    })
}

if (!!$('#seed').length) {
    $('#seed').on('click', () => {
        $.ajax({
            url: `/posts/seed`,
            type: 'POST',
        }).then(() => window.location.href = '/posts')
    })
}