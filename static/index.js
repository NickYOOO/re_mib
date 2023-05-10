$(function () {
    $(document).ready(function () {
        listing();
    });

    function listing() {
        fetch('/re_min').then((res) => res.json()).then((data) => {
            let rows = data['result']
            $('#colums').empty()
            rows.forEach((a) => {
                let image = a['image']
                let name = a['name']
                let star = a['star']
                let caption = a['caption']

                let star_repeat = '⭐'.repeat(star)

                let temp_html = `<figure>
                                    <img src=${image}/>

                                    <figcaption class="name">
                                         ${name}
                                     </figcaption>
                                     <figcaption class="star">
                                         ${star}
                                     </figcaption>
                                     <figcaption class="caption">
                                          ${caption}
                                      </figcaption>
                                 </figure>`
                $('#colums').prepend(temp_html)
            });
        })

    }

    function save_remin() {
        let name = $('#name').val()
        let star = $('#star').val()
        let caption = $('#caption').val()
        let img = $('#img').val()

        let formData = new FormData();
        formData.append("name_give", name);
        formData.append("star_give", star);
        formData.append("caption_give", caption);
        formData.append("img_give", img);


        fetch('/re_min', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
            alert(data['msg'])
            window.location.reload()
        })
    }

    let share_modal = $('.share-overlay');

    $('.share').click(function() {
        share_modal.css({
            'display' : 'block',
        });
    });

    $('.cancel').click(function() {
        share_modal.css({
            'display' : 'none'
        });
    });

    $('.submit').click(save_remin)

})
