function Comment(attributes) {
  this.id = attributes.id;
  this.content = attributes.content;
  this.created_at = attributes.created_at;
  this.task_id = attributes.task_id;
  this.user_id = attributes.user_id;
}

Comment.prototype.friendlyDate = function (){
  var date = new Date(this.created_at);
  var friendlyDate = formatDate(date);
  return friendlyDate;
}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + strTime;
}

Comment.prototype.renderComment = function (){
  return Comment.template({content: this.content, id: this.id, createdAt: this.friendlyDate()});
}

function newComment() {
  $('#new_comment').submit(function(event) {
    event.preventDefault();
    var values = $(this).serialize();
    $.post('/projects/1/comments',values).success(function(data) {
        var comment = new Comment(data);
        var commentRender = comment.renderComment()
        $(".comments").prepend(commentRender);
        $("#comment_content").val("");
      });
  });
}


$(document).ready(function(){
  Comment.templateSource = $("#commentTemplate").html();
  Comment.template = Handlebars.compile(Comment.templateSource); 
  newComment();
});