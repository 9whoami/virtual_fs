/**
 * Created by oem on 15.08.16.
 */
jQuery(document).ready(function ($) {
    $('.view').click(changeView);
    $('.create_folder').click(createPath);
    $('.create_file').click(createFile);

    function createFile(){
        var path_name = prompt('File name', '');
        if (path_name.length == 0){
            alert('Вы не указали имя файла')
        } else {
            $.ajax({
                type: "GET",
                url: "/create_file",
                data: {
                    'path': $(this).attr('data-v') +'/'+ path_name
                },
                dataType: "json",
                cache: false,
                success: function (data) {
                    alert(data['result']);
                }
            })
        }
    }

    function createPath(){
        var path_name = prompt('Path name', '');
        if (path_name.length == 0){
            alert('Вы не указали имя папки')
        } else {
            $.ajax({
                type: "GET",
                url: "/create_path",
                data: {
                    'path': $(this).attr('data-v') +'/'+ path_name
                },
                dataType: "json",
                cache: false,
                success: function (data) {
                    alert(data['result']);
                }
            })
        }
    }

    function changeView() {
        $.ajax({
            type: "GET",
            url: "/get_path",
            data:{
                'path':$(this).attr('data-v')
            },
            dataType: "json",
            cache: false,
            success: function(data){
                elements = document.getElementsByClassName('view');
                count = elements.length;
                for (var i=0; i < count; i++) {
                    elements[0].remove();
                }


                elements = document.getElementsByClassName('create_folder');
                count = elements.length;
                for (var i=0; i < count; i++) {
                    elements[0].remove();
                }

                elements = document.getElementsByClassName('create_file');
                count = elements.length;
                for (var i=0; i < count; i++) {
                    elements[0].remove();
                }


                var p = document.getElementById('emptyfolder');
                if (p){
                    p.remove();
                }

                var div = document.getElementById('container');
                var key = data['key'];

                var a = document.createElement('a');
                var full_path = data['cur_path'];
                a.setAttribute('class', 'view');
                a.setAttribute('href', '#update');
                a.setAttribute('data-v', full_path);
                a.innerHTML = 'UPDATE';
                div.appendChild(a);

                a = document.createElement('a');
                full_path = data['prev_path'];
                if (full_path.length) {
                    a.setAttribute('class', 'view');
                    a.setAttribute('href', '#back');
                    a.setAttribute('data-v', full_path);
                    a.innerHTML = 'BACK';
                    div.appendChild(a);
                }

                if (data[key]['is_folder']) {
                    a = document.createElement('a');
                    a.setAttribute('class', 'create_folder');
                    a.setAttribute('href', '#create_folder');
                    if (full_path.length == 0){
                        a.setAttribute('data-v', 'root');
                    } else {
                        a.setAttribute('data-v', full_path);
                    }
                    a.innerHTML = 'CREATE_FOLDER';
                    div.appendChild(a);

                    a = document.createElement('a');
                    a.setAttribute('class', 'create_file');
                    a.setAttribute('href', '#create_file');
                    if (full_path.length == 0){
                        a.setAttribute('data-v', 'root');
                    } else {
                        a.setAttribute('data-v', full_path);
                    }
                    a.innerHTML = 'CREATE_File';
                    div.appendChild(a);

                    if (data[key]['folders'].length == 0 && data[key]['files'].length == 0) {
                        p = document.createElement('h1');
                        p.setAttribute('id', 'emptyfolder');
                        p.innerHTML = 'Эта папка пуста';
                        div.appendChild(p);
                    } else {
                        for (var folder in data[key]['folders']) {
                            full_path = data[key]['path'] + '/' + data[key]['folders'][folder];
                            a = document.createElement('a');
                            a.setAttribute('class', 'view');
                            a.setAttribute('href', '#');
                            a.setAttribute('data-v', full_path);
                            a.innerHTML = data[key]['folders'][folder];
                            div.appendChild(a);
                        }

                        for (var file in data[key]['files']) {
                            full_path = data[key]['path'] + '/' + data[key]['files'][file];
                            a = document.createElement('a');
                            a.setAttribute('class', 'view');
                            a.setAttribute('href', '#');
                            a.setAttribute('data-v', full_path);
                            a.innerHTML = data[key]['files'][file];
                            div.appendChild(a);
                        }
                    }
                } else {
                    var pre = document.createElement('pre');
                    pre.setAttribute('id', 'emptyfolder');
                    p = document.createElement('p');
                    p.innerHTML = data[key]['source'];
                    pre.appendChild(p);
                    div.appendChild(pre);
                }

                $('.view').click(changeView);
                $('.create_folder').click(createPath);
                $('.create_file').click(createFile);
            }
       });
    }
});