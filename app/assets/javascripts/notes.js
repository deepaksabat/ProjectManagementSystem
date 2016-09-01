$(document).ready(function(){
  compileNoteTemplate();
  compileEditNoteTemplate();
  getNote();
  editNote();
  updateNote();
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

  renderEditNote(){
    return editNoteTemplate(this);
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
      var note = new Note(data);
      var noteRender = note.renderNote();
      $(".note-template-js").html("");
      $(".notes #note-" + note.id).append(noteRender);
    });
  });
}

// GET Request the edit form for a Note
function editNote() {
  $(document).on("click", ".edit-note", function(event){
    event.preventDefault();
    var href = $(this).attr('href');
    $.ajax({
      url: href,
      method: "GET",
      dataType: 'JSON'
    }).success(function(data) {
      var note = new Note(data);
      var noteRender = note.renderEditNote();
      var id = '#' + data.id;
      $(".notes #note-" + note.id + ' .note-content').html(noteRender);
      $(".notes #note-" + note.id + ' textarea').val(note.content);
    });
  });
}

// Update the Note on the page via AJAX post request
function updateNote() {
  $(document).on("submit", ".save-note", function(event) {
    event.preventDefault();
    var values = $(this).serialize();
    var url = $(event.target).attr('action');
    $.ajax({
      url:  url,
      method: "POST",
      dataType: 'JSON',
      data: values
    }).success(function(data) {
      var note = new Note(data);
      var noteRender = note.renderNote();
      $(".note-template-js").html("");
      $(".notes #note-" + note.id).append(noteRender);
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

// compile the handlebars EditComment template on load
function compileEditNoteTemplate(){
  var editNoteSource = $("#editNoteTemplate").html();
  if ( editNoteSource !== undefined ) {
    editNoteTemplate = Handlebars.compile(editNoteSource); 
  }
}
