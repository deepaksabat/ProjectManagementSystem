$(document).ready(function(){
  compileNoteTemplate();
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
    var date = new Date(this.createdAt);
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
    return noteTemplate({content: this.content, user: this.user, id: this.id, createdAt: this.friendlyDate()});
  }
}

function getNote() {
  $(document).on("click", '.js-get-note', function(event) {
    event.preventDefault();
    $.ajax({
      url: $(event.target).attr('href'),
      method: "GET",
      dataType: 'JSON'
    }).success(function(data) {
      var noteObject = new Note(data);
      var noteRender = noteObject.renderNote();
      $(".note-template-js").html("");
      $(".notes #note-" + noteObject.id).append(noteRender);
    });
  });
}

// compile the handlebars template on document load
function compileNoteTemplate(){
  noteSource = $("#noteTemplate").html();
  if ( noteSource !== undefined ) {
    noteTemplate = Handlebars.compile(noteSource); 
  }
}
