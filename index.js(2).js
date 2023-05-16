$(function() {
    $(document).ready(function () {
        listing();
    });

    function listing() {

        fetch('/reviews').then((res) => res.json()).then((data) => {
            let rows = data['result'];
            $('#columns').empty();

            rows.forEach((a) => {
                let image = a['img'];
                let name = a['name'];
                let star = a['star'];
                let comment = a['comment'];
                let _id = a['_id'];
    
                let star_repeat = '⭐'.repeat(star);

                let temp_html = `<figure class="content" data-num="${_id}">
                                    <img src="${image}">
                                    <h3 class="name">${name}</h3>
                                    <p class="star">${star_repeat}</p>
                                    <figcaption class="caption">${comment}</figcaption>
                                </figure>`;
                $('#columns').prepend(temp_html);
            });

            //  게시글 모달
            $('.content').click(function() {
                let info_modal = $('.info-overlay');

                let $image = $(this).children('img').attr('src');
                let $name = $(this).children('h3').text();
                let $star = $(this).children('p').text();
                let $comment = $(this).children('figcaption').text();
                let _id = $(this).data('num');

                $('.info-image img').attr('src',`${$image}`);
                $('.info-name').text($name);
                $('.info-star').text($star);
                $('.info-comment').text($comment);

                $('.info-overlay').attr('data-num', _id);

                info_modal.css({
                    'display' : 'block'
                });
            });

        });

        //  아이콘 호버
        $('.edit-icons .edit').hover(function() {
            $(this).attr('src','../static/icon/pencil-filled.svg');
        }, function() {
            $(this).attr('src','../static/icon/pencil-lined.svg');
        });

        $('.edit-icons .del').hover(function() {
            $(this).attr('src','../static/icon/trash-can-filled.svg');
        }, function() {
            $(this).attr('src','../static/icon/trash-can-lined.svg');
        });

    }

    function save_remin() {
        let name = $('#aname').val();
        let star = $('#star').val();
        let comment = $('#comment').val();
        let img = $('#img').val();
        let pw = $('#pw').val();

        let formData = new FormData();
        formData.append("name_give", name);
        formData.append("star_give", star);
        formData.append("comment_give", comment);
        formData.append("img_give", img);
        formData.append("pw_give", pw);

        fetch('/reviews', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
            alert(data['msg']);
            window.location.reload();
        });
    }

    
    $('.edit-submit').click(update);
    
    function info_load() {   //  게시글 정보 input에 불러오기
        let this_data = $('.info-overlay').data('num');
        console.log(this_data)
        let $img = $('.info-image img').attr('src');
        let $name = $('.info-name').text();
        let $comment = $('.info-comment').text();

        $('#edit-name').attr('value', $name);
        $('#edit-comment').text($comment);
        $('#edit-img').attr('value', $img);
    }

    function update() {     //  미완
        let check_info = new Array();
        fetch('/reviews').then((res) => res.json()).then((data) => {
            let review = data['result'];

            for(let i in review) {
                let $pw = review[i]['pw'];
                check_info[i] = {
                    'id' : $id, 
                    'pw': $pw
                };
            }
        });

        let info = $('.info-overlay');
        let share = $('.edit-overlay');

        info.css('display', 'none');
        share.css('display', 'block');

        // let check_pw = 1;
        let $check_pw = $('#edit-pw').val();
        let $id = $('.info-overlay').data('num');

        if( 1 == $check_pw ) {
            let name = $('#edit-name').val();
            let star = $('#edit-star').val();
            let comment = $('#edit-comment').val();
            let img = $('#edit-img').val();
            let pw = $('#edit-pw').val();
            console.log(star.length)

            let id = $id;

            let formData = new FormData();
            formData.append("name_give", name);
            formData.append("star_give", star);
            formData.append("comment_give", comment);
            formData.append("img_give", img);
            formData.append("pw_give", pw);
            formData.append("_id_give", id);
            
            fetch(`/reviews/update`, { method: "POST", 
                body: formData
            })
            .then((res) => res.json())
            .then((data) => {
                alert(data['msg']);
                window.location.reload();
            });
        }
        
    }

    $('.info-flex .edit').click(function() {    //  수정버튼 클릭 시
        let info = $('.info-overlay');
        let share = $('.edit-overlay');
        let _id = $('.info-overlay').data('id');

        $('.edit-overlay').attr('data-id', _id);

        info.css('display', 'none');
        share.css('display', 'block');

        info_load();
    });


    
    //  게시글 모달 영역 밖 클릭 시 모달창 닫기
    $(document).click(function(e) {
        if( $('#info').is(e.target) ) {
            $('.info-overlay').css({
                'display' : 'none'
            });
        }
    });

    //  공유하기 모달

    $('.share').click(function() {
        let share_modal = $('.share-overlay');

        share_modal.css({
            'display' : 'block'
        });
    });

    $('.cancel').click(function() {
        let $modal = $('.share-overlay');
        
        $modal.css({
            'display' : 'none'
        });
    });

    $('.edit-cancel').click(function() {    //  수정 취소하기 버튼
        let $modal = $('.edit-overlay');
        
        $modal.css({
            'display' : 'none'
        });
    });

    //  공유하기 유효성 검사
    $('.submit').click(share_check);
    $('.edit-submit').click(edit_check);    


    function share_check() {
        const checkName = $('#overlay #aname');
        const checkStar = $('#overlay #star');
        const checkComment = $('#overlay #comment');
        const checkImg = $('#overlay #img');
        const checkPw = $('#overlay #pw');

        if ( !checkName.val() ) {      //  frn의 product의 value값이 없을 때 = input에 입력한 값이 없을 때
            alert('상호명을 입력해 주세요');
            checkName.focus();
            return false;   //  경고창을 확인한 후 페이지가 넘어가지 않고 그대로 유지하기 위함, method빼면 못넘어감.
        } else if ( checkStar.val() == 0 ) {
            alert('별점을 선택해 주세요');
            checkStar.focus();
            return false;
        } else if ( !checkComment.val() ) {
            alert('코멘트를 입력해 주세요');
            checkComment.focus();
            return false;
        } else if ( !checkImg.val() ) {
            alert('이미지 URL을 입력해 주세요');
            checkImg.focus();
            return false;
        } else if ( !checkPw.val() ) {
            alert('비밀번호 입력해 주세요');
            checkPw.focus();
            return false;
        } else {
            save_remin();
        }
    }

    function edit_check() {
        const checkName = $('#overlay #edit-name');
        const checkStar = $('#overlay #edit-star');
        const checkComment = $('#overlay #edit-comment');
        const checkImg = $('#overlay #edit-img');
        const checkPw = $('#overlay #edit-pw');

        if ( !checkName.val() ) {
            alert('상호명을 입력해 주세요');
            checkName.focus();
            return false;
        } else if ( checkStar.val() == 0 ) {
            alert('별점을 선택해 주세요');
            checkStar.focus();
            return false;
        } else if ( !checkComment.val() ) {
            alert('코멘트를 입력해 주세요');
            checkComment.focus();
            return false;
        } else if ( !checkImg.val() ) {
            alert('이미지 URL을 입력해 주세요');
            checkImg.focus();
            return false;
        } else if ( !checkPw.val() ) {
            alert('비밀번호 입력해 주세요');
            checkPw.focus();
            return false;
        } else {
            update();
        }
    }
})