$(document).ready(function(){
  compileNoteTemplate();
  compileEditNoteTemplate();
  getNote();
  editNote();
  updateNote();
});

function Note(attributes) {
  this.id = attributes.id;
  this.title = attributes.title;
  this.content = attributes.content;
  this.createdAt = attributes.created_at;
  this.user = attributes.user.name;
  this.project = attributes.project.name;
}

  // Display a formatted date
Note.prototype.friendlyDate = function() {
  var date = new Date(this.createdAt);
  var friendlyDate = this.formatDate(date);
  return friendlyDate;
}

  // Format JS standard date
Note.prototype.formatDate = function(date) {
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
Note.prototype.renderNote = function() {
  return noteTemplate({title: this.title, content: this.content, user: this.user, id: this.id, createdAt: this.friendlyDate()});
}

Note.prototype.renderEditNote = function() {
  return editNoteTemplate(this);
}

function getNote() {
  $(document).on("click", '.js-get-note', function(event) {
    event.preventDefault();
    var url = $(event.target).attr('href');
    $.get(url, function(data) {
      var note = new Note(data);
      var noteRender = note.renderNote();
      $(".notes #note-" + note.id).html("");
      $(".notes #note-" + note.id).append(noteRender);
    }, "json");
  });
}

// GET Request the edit form for a Note
function editNote() {
  $(document).on("click", ".edit-note", function(event){
    event.preventDefault();
    var url = $(this).attr('href');
    $.get(url).success(function(data) {
      var note = new Note(data);
      var noteRender = note.renderEditNote();
      var id = '#' + data.id;
      $(".notes #note-" + note.id).html(noteRender);
      $(".notes #note-" + note.id + ' #note_title').val(note.title);
      $(".notes #note-" + note.id + ' textarea').val(note.content);
    }, "json");
  });
}

// Update the Note on the page via AJAX post request
function updateNote() {
  $(document).on("submit", ".save-note", function(event) {
    event.preventDefault();
    var values = $(this).serialize();
    var url = $(event.target).attr('action');
    $.post(url, values, function(data) {
      var note = new Note(data);
      var noteRender = note.renderNote();
      $(".notes #note-" + note.id).html("");
      $(".notes #note-" + note.id).append(noteRender);
    }, "json");
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
