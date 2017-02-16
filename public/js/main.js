var files;
$('input[type=file]').on('change', function(event){
  files = event.target.files;
  console.log(files);
});
$('#uplodaFile').on('click', function(event){
    event.stopPropagation();
    event.preventDefault();
    console.log("Submiting");
    var data = new FormData();
    var files = $("#logfile")[0].files;
    $.each(files, function(key, value){
        console.log(value);
        data.append(key, value);
    });
    $.ajax({
        url: 'fileUpload',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data) {
            $(".successMsg").html(data);
        },
        error: function(error) {
            $(".errorMsg").html(error);  
        }
    });
});

$('#getReport').on('click', function(event){
    var data = {
        logPattern: $("#logPattern").val(),
        dashboardInput: $("#dashboardInput").val(),
        logFileName: $("#logFileName").val()
    };
    $.ajax({
        url: 'getHackReport',
        data: data,
        type: 'GET',
        success: function(data) {
            console.log(data);
            var dataLines = data.split("\n");
            $("#reportOutput").html("");
            $.each(dataLines, function(index,dataLine){
                $("#reportOutput").append("<div>"+ dataLine +"</div><br/>");
            });
        },
        error: function() {

        }
    });
});