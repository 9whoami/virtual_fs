/**
 * Created by oem on 15.08.16.
 */
jQuery(document).ready(function ($) {
    $('.view').click(changeView);
    $('.back_view').click(changeView);
    $('.update_view').click(changeView);

    $('.create_folder').click(createPath);
    $('.create_file').click(createFile);
    $('.remove').click(removePath);
    $('.remove_file').click(removeFile);
    $('.save_file').click(saveToFile);

    function saveToFile(){
        var file_name = document.getElementById('filename');
        file_name = file_name.value;

        var full_path = document.getElementById('fullpath');
        full_path = full_path.innerHTML;

        var source = $("#src").val();

        $.ajax({
            type: "GET",
            url: "/save_to_file",
            data: {
                'path': full_path,
                'new_name': file_name,
                'source': source
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                full_path = data['path'];

                var li = document.getElementById('update');
                li.setAttribute('class', '');

                var a = li.firstElementChild;
                a.setAttribute('data-v', full_path);
                a.click();
            }
        })

    }

    function formatSize(length){
        var i = 0, type = ['б','Кб','Мб','Гб','Тб','Пб'];
        while((length / 1000 | 0) && i < type.length - 1) {
            length /= 1024;
            i++;
        }
        return length.toFixed(2) + ' ' + type[i];
    }

    function removePath(){
        $.ajax({
            type: "GET",
            url: "/remove",
            data: {
                'path': $(this).attr('data-v')
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                var update = document.getElementById('update');
                update.firstElementChild.click();
            }
        })
    }

    function removeFile(){
        $.ajax({
            type: "GET",
            url: "/remove",
            data: {
                'path': $(this).attr('data-v')
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                var update = document.getElementById('back');
                update.firstElementChild.click();
            }
        })
    }

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
                    var update = document.getElementById('update');
                    update.firstElementChild.click();
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
                    var update = document.getElementById('update');
                    update.firstElementChild.click();
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

                var elements = document.getElementsByClassName('list');
                var count = elements.length;
                for (var i=0; i < count; i++) {
                    elements[0].remove();
                }

                var container = document.getElementById('container');
                var source = document.getElementById('source');
                var listing = document.getElementById('listing');

                var key = data['key'];

                var full_path = data['prev_path'];
                if (full_path.length) {
                    li = document.getElementById('back');
                    li.setAttribute('class', '');
                    var a = li.firstElementChild;
                    a.setAttribute('data-v', full_path);
                }

                var li = document.getElementById('update');
                full_path = data['cur_path'];

                li.setAttribute('class', '');
                var a = li.firstElementChild;
                a.setAttribute('data-v', full_path);

                var path = document.getElementById('fullpath');
                path.innerHTML = 'path: /' + full_path;

                if (data[key]['is_folder']) {
                    var li = document.getElementById('remove');
                    li.setAttribute('class', 'disabled');

                    var cnt_files = document.getElementById('files');
                    var cnt_folders = document.getElementById('folders');
                    var total_size = document.getElementById('size');

                    cnt_files.innerHTML = 'count files: ' + data[key]['files'].length;
                    cnt_folders.innerHTML = 'count folders: ' + data[key]['folders'].length;
                    total_size.innerHTML = 'total size: ' + formatSize(data[key]['size']);

                    source.style.display = 'none';
                    listing.style.display = 'inherit';
                    var l = ['create_file', 'create_folder'];
                    for (var id in l){
                        var li = document.getElementById(l[id]);
                        li.setAttribute('class', '');
                        var a = li.firstElementChild;
                        if (full_path.length == 0){
                            a.setAttribute('data-v', 'root');
                        } else {
                            a.setAttribute('data-v', full_path);
                        }
                    }

                    var empty = document.getElementById('empty');

                    if (data[key]['folders'].length == 0 && data[key]['files'].length == 0) {
                        empty.style.display = 'inherit';
                    } else {
                        empty.style.display = 'none';
                        for (var folder in data[key]['folders']) {
                            full_path = data[key]['path'] + '/' + data[key]['folders'][folder];
                            var base_name = data[key]['folders'][folder];

                            var li = document.createElement('li');
                            li.setAttribute('class', 'span2 list');

                            var div = document.createElement('div');
                            div.setAttribute('class', 'thumbnail');

                            var img = document.createElement('img');
                            img.setAttribute('src', '/static/img/folder.png');
                            img.setAttribute('class', 'view');
                            img.setAttribute('data-v', full_path);
                            img.setAttribute('alt', base_name);

                            var img_rm = document.createElement('img');
                            img_rm.setAttribute('src', '/static/img/trash.png');
                            img_rm.setAttribute('class', 'remove');
                            img_rm.setAttribute('data-v', full_path);
                            img_rm.innerHTML = 'rm';

                            var img_div = document.createElement('div');
                            img_div.setAttribute('class', 'badge badge-success');
                            img_div.innerHTML = base_name;

                            div.appendChild(img);
                            div.appendChild(img_div);
                            div.appendChild(img_rm);
                            li.appendChild(div);
                            container.appendChild(li);
                        }

                        for (var file in data[key]['files']) {
                            full_path = data[key]['path'] + '/' + data[key]['files'][file];
                            var base_name = data[key]['files'][file];

                            var li = document.createElement('li');
                            li.setAttribute('class', 'span2 list');

                            var div = document.createElement('div');
                            div.setAttribute('class', 'thumbnail');

                            var img = document.createElement('img');
                            img.setAttribute('src', '/static/img/file.png');
                            img.setAttribute('class', 'view');
                            img.setAttribute('data-v', full_path);
                            img.setAttribute('alt', base_name);

                            var img_rm = document.createElement('img');
                            img_rm.setAttribute('src', '/static/img/trash.png');
                            img_rm.setAttribute('class', 'remove');
                            img_rm.setAttribute('data-v', full_path);
                            img_rm.innerHTML = 'rm';

                            var img_div = document.createElement('div');
                            img_div.setAttribute('class', 'badge badge-success');
                            img_div.innerHTML = base_name;

                            div.appendChild(img);
                            div.appendChild(img_div);
                            div.appendChild(img_rm);
                            li.appendChild(div);
                            container.appendChild(li);

                        }
                    }
                } else {
                    var cnt_files = document.getElementById('files');
                    var cnt_folders = document.getElementById('folders');
                    var total_size = document.getElementById('size');

                    cnt_files.innerHTML = 'count files: -';
                    cnt_folders.innerHTML = 'count folders: -';
                    total_size.innerHTML = 'total size: ' + formatSize(data[key]['size']);

                    var li = document.getElementById('remove');
                    li.setAttribute('class', '');
                    var a = li.firstElementChild;
                    a.setAttribute('data-v', full_path);

                    var l = ['create_file', 'create_folder'];
                    for (var id in l){
                        var li = document.getElementById(l[id]);
                        li.setAttribute('class', 'disabled');
                    }
                    listing.style.display = 'none';
                    source.style.display = 'inherit';
                    var pre = document.getElementById('src');
                    pre.value = data[key]['source'];

                    var filename = document.getElementById('filename');
                    filename.value = key;
                }

                $('.view').click(changeView);
                $('.remove').click(removePath);

            }
       });
    }
});