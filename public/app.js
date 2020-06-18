
//#save-btn will transfer article to display on the savedarticles.html and save it within the articlesdb

//modal
document.getElementById('scrape-button').addEventListener('click', function(){
  document.querySelector('#articles').style.display = 'inherit';

$.get("/scrape", function(data, status){
  console.log(status);
  $.getJSON("/articles", function(data){
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<div id=article class=container-fluid article container>" + "<div class=card>" + 
        "<div class=card-body text-center>" + 
        "<p data-id=" + data[i].id + "'>" + "<a href=" + data[i].link + "'>" + data[i].title + "</a>" + "</p>" + 
        "<p data-id=" + data[i].id + "'>" + "<a>" + data[i].description +"'</a>" + "</p>" +
        "<button id=save-btn>Save Article</button>" + 
        "</div>" + "</div>" + "</div>");
    };
  });

});

  console.log("click worked");
  document.querySelector('.bg-modal').style.display = 'flex';
});

document.querySelector('.close').addEventListener('click', function(){
  document.querySelector('.bg-modal').style.display = 'none';
});
//modal

//modal close button
document.querySelector('.btnClose').addEventListener('click', function(){
  document.querySelector('.bg-modal').style.display = 'none';
})

//save article
//we want to grab the app.post from the server side
document.getElementById("save-btn").addEventListener('click', function(){
  $.get("/save", function(data, status){
    console.log(status);
  });
});

//clearing all scraped articles from the index.html and in the db
document.getElementById("clear-btn").addEventListener('click', function(){
  $.get("/clear", function(data, status){
    console.log(status);

    $.getJSON("/saved-articles", function(data){
      for (var i = 0; i < data.length; i++) {
          $("#articles").append("<div id=article class=container-fluid article container>" + "<div class=card>" + 
          "<div class=card-body text-center>" + 
          "<p data-id=" + data[i].id + "'>" + "<a href=" + data[i].link + "'>" + data[i].title + "</a>" + "</p>" + 
          "<p data-id=" + data[i].id + "'>" + "<a>" + data[i].description +"'</a>" + "</p>" +
          "<button id=note-btn>Add note</button>" + 
          "</div>" + "</div>" + "</div>");
      };
    });
  });
  $("#articles").empty();
});

//create a second clear-btn for the savedarticles.html with same function

// document.getElementById('#clear-save').addEventListener('click', function(){
//   $.get("/clear", function(data, status){
  //   console.log(status);

  //   $.getJSON("/saved-articles", function(data){
  //     for (var i = 0; i < data.length; i++) {
  //         $("#saved-articles").append("<div id=article class=container-fluid article container>" + "<div class=card>" + 
  //         "<div class=card-body text-center>" + 
  //         "<p data-id=" + data[i].id + "'>" + "<a href=" + data[i].link + "'>" + data[i].title + "</a>" + "</p>" + 
  //         "<p data-id=" + data[i].id + "'>" + "<a>" + data[i].description +"'</a>" + "</p>" +
  //         "<button id=note-btn>Add note</button>" + 
  //         "</div>" + "</div>" + "</div>");
  //     };
  //   });
  // });
  // $("#articles").empty();
// });


$(document).on("click", "p", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })

      .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  