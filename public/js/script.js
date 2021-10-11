// If on the post creation page, toggle form visibility
if (window.location.pathname == '/posts/create') {
    $('select').on('change', () => {
        $('.switch-container').css('display', 'none')
        const opt = $('option:selected').val()
        switch(opt) {
            case 'general':
                $('#gen-layout').toggle()
                break
            case 'item':
                $('#item-layout').toggle()
                break
        }
    })
}