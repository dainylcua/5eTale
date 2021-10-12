// If on the post creation page, toggle form visibility
if (window.location.pathname == '/posts/create') {
    $('select#content-type').on('change', () => {
        $('.switch-container').css('display', 'none')
        const opt = $('#content-type>option:selected').val()
        switch(opt) {
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
        switch(opt) {
            case 'off':
                $('#off-layout').toggle()
                break
            case 'def':
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
