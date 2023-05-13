$(function() {
    $(document).ready(function () {
        listing();
    });

    function listing() {
        //Get listing
        fetch('/reviews').then((res) => res.json()).then((data) => {
            let rows = data['result'];
            $('#columns').empty();

            rows.forEach((a) => {
                let image = a['img'];
                let name = a['name'];
                let star = a['star'];
                let comment = a['comment'];
    
                let star_repeat = '⭐'.repeat(star);

                let temp_html = `<figure class="content">
                                    <img src="${image}">
                                    <h3 class="name">${name}</h3>
                                    <p class="star">${star_repeat}</p>
                                    <figcaption class="caption">${comment}</figcaption>
                                </figure>`;
                $('#columns').prepend(temp_html);
            });

            //  info Modal
            $('.content').click(function() {
                let info_modal = $('.info-overlay');

                let $image = $(this).children('img').attr('src');
                let $name = $(this).children('h3').text();
                let $star = $(this).children('p').text();
                let $comment = $(this).children('figcaption').text();

                $('.info-image img').attr('src',`${$image}`);
                $('.info-name').text($name);
                $('.info-star').text($star);
                $('.info-comment').text($comment);

                info_modal.css({
                    'display' : 'block'
                });
            });
        });
        
        //  icon hover
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

    function info_load() {   //  게시글 정보 input에 불러오기
        let $img = $('.info-image img').attr('src');
        let $name = $('.info-name').text();
        let $comment = $('.info-comment').text();

        $('#edit-name').attr('value', $name);
        $('#edit-comment').text($comment);
        $('#edit-img').attr('value', $img);
    }

    function update() {     //  미완
        let all_id = new Array();
        fetch('/reviews').then((res) => res.json()).then((data) => {
            let review = data['result'];

            for(let i in review) {
                let $id = review[i]['_id'];
                let $pw = review[i]['pw'];
                all_id[i] = {'id' : $id, 'pw': $pw};
            }
        });
        console.log(all_id);
        console.log($('.info-name').text())

        let info = $('.info-overlay');
        let share = $('.edit-overlay');

        info.css('display', 'none');
        share.css('display', 'block');       
    }

    $('.info-flex .edit').click(function() {    //  수정버튼 클릭 시
        let info = $('.info-overlay');
        let share = $('.edit-overlay');

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

    //   share Modal

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