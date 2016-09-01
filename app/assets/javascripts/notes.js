$(document).ready(function(){
  compileTemplate();
  getNotes();
});

class Note {
  constructor(attributes){
    this.id = attributes.id;
    this.title = attributes.title;
    this.content = attributes.content;
    this.createdAt = attributes.created_at;
    this.user = attributes.user.name;
    this.project = attributes.project.name;
  }

  // Render the handlebars template
  renderNote() {
    return template(this);
  }
}

function getNotes() {
  $('#filter-Notes-js').on("submit", function(event) {
    event.preventDefault();
    var url = $(event.target).attr('action')
    var values = $(this).serialize();
    fetchNotes(url, values);
  });
}

function fetchNotes(url, values){
  $.ajax({
    url: url,
    method: "GET",
    data: values,
    dataType: 'JSON'
  }).success(function(data) {
    console.log(data);
    $(".row").html("");
    $('h2').text(data.length + " Notes");
    renderResponse(data);
  });
}

function filterData(data) {

}

// render the AJAX response to the page
function renderResponse(data) {
  $.each(data, function(index, Note){
    var NoteObject = new Note(Note);
    NoteObject.overdueCheck();
    NoteObject.completeCheck();
    NoteObject.assignUsers(Note.assigned_users);
    var NoteRender = NoteObject.renderNote();
    $(".row").prepend(NoteRender);
    if (NoteObject.selfAssignCheck(Note.assigned_users) === true){
      $("#self-assign").text("Assigned to you");
    }
  })
}

// compile the handlebars template on document load
function compileTemplate(){
  source = $("#template").html();
  if ( source !== undefined ) {
    template = Handlebars.compile(source); 
  }
}

// format the page title after an AJAX request
function formatTitle(str){
  var array = str.replace(/[-]/, " ").split(" ");
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    newArray[i] = array[i].charAt(0).toUpperCase() + array[i].substr(1);
  }
  return newArray.join(" ");
}
