$(function () {
    listing()

function listing() {
    fetch('/re_min').then((res) => res.json()).then((data) => {
        let rows = data['result']
        $('#columns').empty()
        // console.log(rows)
        rows.forEach((a) => {
            console.log(a)
            let img = a['img']
            let name = a['name']
            let star = a['star']
            let comment = a['comment']

            let star_repeat = '⭐'.repeat(star)

            let temp_html = `<figure>
                                    <img src="${img}"/>
                                    <figcaption class="name">
                                         ${name}
                                     </figcaption>
                   
                                     <figcaption class="star">
                                         ${star_repeat}
                                     </figcaption>
                                     <figcaption class="caption">
                                          ${comment}
                                      </figcaption>
                                 </figure>`
            $('#columns').prepend(temp_html)
        });
    })

}

function save_remin() {
    let name = $('#aname').val()
    let star = $('#star').val()
    let comment = $('#comment').val()
    let img = $('#img').val()
    let pw = $('#pw').val()


    let formData = new FormData();
    formData.append("name_give", name);
    formData.append("star_give", star);
    formData.append("comment_give", comment);
    formData.append("img_give", img);
    formData.append("pw_give", pw);

    fetch('/re_min', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
        alert(data['msg'])
        window.location.reload()
    })
}

// share Modal
let share_modal = $('.share-overlay');

$('.share').click(function () {
    share_modal.css({
        'display': 'block',
    });
});

$('.cancel').click(function () {
    share_modal.css({
        'display': 'none'
    });
});

$('.submit').click(save_remin)

// info Modal
$('#columns figure').click(() => {
    let info_modal = $('.info-overlay');
    let click_dataNum = $(this).data('num');
    fetch('/reviews').then((res) => res.json()).then((data) => {
        let info = data['result'];
        let image = info[click_dataNum]['image'];
        let name = info[click_dataNum]['name'];
        let star = info[click_dataNum]['star'];
        let comment = info[click_dataNum]['comment'];
        let star_repeat = ':별:'.repeat(star);
        let temp_html = `
                        <div class="info-image">
                            <img src="${image}" alt="${name}">
                        </div>
                        <div class="info-text">
                            <p class="info-name">${name}</p>
                            <p class="info-star">${star_repeat}</p>
                            <p class="info-comment">${comment}</p>
                        </div>
                        `;
        $('.info-flex').html(temp_html);
    });
    info_modal.css({
        'display' : 'block'
    });
});

})