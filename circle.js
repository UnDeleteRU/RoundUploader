var element = document.getElementById('file');
var area = document.getElementById('upload');

element.addEventListener('change', function () {
    var file = this.files[0],
        type = file.type,
        name = file.name,
        lastModified = file.lastModified;

    if (!type.match(/^image/i)) {
        alert('You can upload only image');
        return;
    }

    area.setAttribute('class', 'pre-loaded');
    area.setAttribute('data-progress', '0');
    var reader = new FileReader;

    reader.addEventListener('load', function (event) {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function (event) {
            area.setAttribute('class', '');
            area.setAttribute('data-progress', Math.round(100 * event.loaded / event.total));
        });

        xhr.upload.addEventListener('load', function (event) {
            area.setAttribute('class', 'loaded');
        });

        xhr.open('POST', '/reciver.php');
        xhr.setRequestHeader('Content-Type', type);
        xhr.setRequestHeader('Content-Name', name);
        xhr.setRequestHeader('Content-Last-Modified', lastModified);
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);

                if (typeof response.thumb != 'undefinde') {
                    area.getElementsByTagName('img')[0].src = response.thumb;
                }
            }
        };
        xhr.send(file);
    });

    reader.readAsDataURL(file);
});

area.addEventListener('click', function () {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    element.dispatchEvent(event);
});
