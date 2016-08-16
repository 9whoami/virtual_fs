/**
 * Created by oem on 15.08.16.
 */
jQuery(document).ready(function ($) {
    $('.view').click(changeView);
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
                var counter = 0
                var ul = document.createElement('ul');
                ul.setAttribute('class', "collapse in");
                ul.setAttribute('id', 'col'+data['self']);

                var key = data['key'];
                for (var folder in data[key]['folders']){

                    if (document.getElementById(data[key]['path'] + '/' + data[key]['folders'][folder])){
                        break
                    }
                    counter ++;
                    var button = document.createElement('a');
                    button.className = "view folder";
                    button.setAttribute('data-v', data[key]['path'] + '/' + data[key]['folders'][folder]);
                    button.innerHTML = data[key]['folders'][folder];

                    var li = document.createElement('li');
                    li.setAttribute('id', data[key]['path'] + '/' + data[key]['folders'][folder]);

                    li.appendChild(button);
                    ul.appendChild(li);

                }

                for (var file in data[key]['files']){

                    if (document.getElementById(data[key]['path'] + '/' + data[key]['files'][file])){
                        break
                    }
                    counter ++;
                    var button = document.createElement('a');
                    button.className = "file";
                    button.setAttribute('data-v', data[key]['path'] + '/' + data[key]['files'][file]);
                    button.innerHTML = data[key]['files'][file];

                    var li = document.createElement('li');
                    li.setAttribute('id', data[key]['path'] + '/' + data[key]['files'][file]);
                    li.appendChild(button);
                    ul.appendChild(li);
                }
                if (counter){
                    document.getElementById(data['self']).appendChild(ul);
                    // $(".collapse").collapse({toggle:true})
                }


            }
       });
    }
});