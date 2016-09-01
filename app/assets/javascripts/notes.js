$(document).ready(function(){
  compileTemplate();
  getNote();
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

  // Display a formatted date
  friendlyDate() {
    var date = new Date(this.created_at);
    var friendlyDate = this.formatDate(date);
    return friendlyDate;
  }

  // Format JS standard date
  formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + strTime;
  }

  // Render the handlebars template
  renderNote() {
    return template(this);
  }
}

function getNote() {
  $(document).on("click", '.js-get-note', function(event) {
    event.preventDefault();
    var url = $(event.target).attr('href');
    fetchNote(url);
  });
}

function fetchNote(url){
  $.ajax({
    url: url,
    method: "GET",
    dataType: 'JSON'
  }).success(function(data) {
    console.log(data);
    alert("hello");
    
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
