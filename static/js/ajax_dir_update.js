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
                'path':$(this).attr('data-v'),
                'self':$(this).attr('data-v')
            },
            dataType: "json",
            cache: false,
            success: function(data){
                var ul = document.createElement('ul');
                ul.className = "nav nav-list collapse in";
                var key = data['key'];
                for (var folder in data[key]['folders']){

                    var button = document.createElement('button');
                    button.className = "view";
                    // button.setAttribute('data-toggle', 'collapse');
                    // button.setAttribute('data-target', '#' + key);
                    button.setAttribute('data-v', data[key]['path'] + '/' + data[key]['folders'][folder]);
                    button.innerHTML = data[key]['folders'][folder];
                    // button.setAttribute('id', data[key]['path'] + '/' + data[key]['folders'][folder]);

                    var li = document.createElement('li');
                    li.setAttribute('id', data[key]['path'] + '/' + data[key]['folders'][folder]);
                    li.appendChild(button);
                    ul.appendChild(li);

                }
                document.getElementById(data['self']).appendChild(ul);

            }
       });
    }
});