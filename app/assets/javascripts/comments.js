$(document).ready(function(){
  getComments();
  compileNewCommentTemplate();
  compileEditCommentTemplate();
  newComment();
  editComment();
  updateComment();
});

function Comment(attributes) {
  this.id = attributes.id;
  this.content = attributes.content;
  this.created_at = attributes.created_at;
  this.task_id = attributes.task_id;
  this.user_id = attributes.user_id;
} 

  // Display a formatted date
Comment.prototype.friendlyDate = function() {
    var date = new Date(this.created_at);
    var friendlyDate = this.formatDate(date);
    return friendlyDate;
  }

  // Format JS standard date
Comment.prototype.formatDate = function(date)  {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + strTime;
  }

  // render the handlebars NewComment template
Comment.prototype.renderNewComment = function() {
    return newCommentTemplate({content: this.content, id: this.id, createdAt: this.friendlyDate()});
  }

  // render the handlebars EditComment template
Comment.prototype.renderEditComment = function() {
    return editCommentTemplate({content: this.content, id: this.id, createdAt: this.friendlyDate()});
  }


// Create a new comment and add it to the page
function getComments() {
  var url = window.location.pathname;
  $.get(url, function(data) {
    $.each(data.comments, function(index, comment){
      var comment = new Comment(comment);
      var commentRender = comment.renderNewComment();
      $(".comments").prepend(commentRender);
    });
  }, "json");
}

function newComment() {
  $('.new_comment').on('submit', function(event) {
    event.preventDefault();
    var values = $(this).serialize();
    var url = $(this).attr('action');
    $.post(url, values, function(data) {
      var comment = new Comment(data);
      var commentRender = comment.renderNewComment();
      $(".comments").prepend(commentRender);
      $("#comment_content").val("");
    }, "json");
  });
}

// GET Request the edit form for a comment
function editComment() {
  $(document).on("click", ".edit-comment", function(event){
    event.preventDefault();
    var url = $(this).attr('href');
    $.get(url, function(data) {
      var comment = new Comment(data);
      var commentRender = comment.renderEditComment();
      var id = '#' + data.id;
      $(id + ' .comment-content').html(commentRender);
      $(id + ' textarea').val(comment.content);
    }, "json");
  });
}

// Update the comment on the page via AJAX post request
function updateComment() {
  $(document).on("submit", ".save-comment", function(event) {
    event.preventDefault();
    var values = $(this).serialize();
    var url =  $(this).attr('action');
    $.post(url, values, function(data) {
      var comment = new Comment(data);
      var id = "#" + comment.id;
      $(id + ' .comment-content').html(comment.content);
    }, "json");
  }); 
}

// compile the handlebars NewComment template on load
function compileNewCommentTemplate(){
  var newCommentSource = $("#newCommentTemplate").html();
  if ( newCommentSource !== undefined ) {
    newCommentTemplate = Handlebars.compile(newCommentSource); 
  }
}

// compile the handlebars EditComment template on load
function compileEditCommentTemplate(){
  var editCommentSource = $("#editCommentTemplate").html();
  if ( editCommentSource !== undefined ) {
    editCommentTemplate = Handlebars.compile(editCommentSource); 
  }
}
