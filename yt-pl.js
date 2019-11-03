var input = document.createElement("input");
input.id = "file-input";
input.type = "file";
input.accept = "text/plain";
if (!document.getElementById('file-input')) {
    document.getElementById('body').appendChild(input);
    document.querySelector("#file-input").addEventListener('change', function(e) {
        // list of selected files
        var all_files = this.files;
        if (all_files.length == 0) {
            alert('Error : No file selected');
            return;
        }
        // first file selected by user
        var file = all_files[0];
        // files types allowed
        // we are reading text file in this example
        var allowed_types = ['text/plain'];
        if (allowed_types.indexOf(file.type) == -1) {
            alert('Error : Incorrect file type');
            return;
        }
        // Max 2 MB allowed
        var max_size_allowed = 2 * 1024 * 1024
        if (file.size > max_size_allowed) {
            alert('Error : Exceeded size 2MB');
            return;
        }
        // file validation is successful
        // we will now read the file
        const reader = new FileReader();
        reader.onload = function fileReadCompleted() {
            // when the reader is done, the content is in reader.result.
            var list = reader.result.split('\n');
            var session_token = document.getElementsByName("session_token")[0].value;
            var source_playlist_id = new URL(location.href).searchParams.get("list");
            for (var i = 0, length = list.length; i < length; i++) {
                var data = encodeURI("source_playlist_id=" + source_playlist_id + "&n=" + list[i] + "&p=public&session_token=" + session_token);
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.responseText);
                    }
                };
                xhttp.open("POST", "https://www.youtube.com/playlist_ajax?action_create_playlist=1", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(data);
            }
        };
        reader.readAsText(this.files[0]);
        this.value = null;
    });
}
document.getElementById('file-input').click();
