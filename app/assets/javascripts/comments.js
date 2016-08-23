function Comment(attributes) {
  this.id = attributes.id;
  this.content = attributes.content;
  this.created_at = attributes.created_at;
  this.task_id = attributes.task_id;
  this.user_id = attributes.user_id;
}

Comment.prototype.friendlyDate = function (){
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  var date = new Date(this.created_at);
  var month = monthNames[date.getMonth()];
  var monthDate = date.getDate();
  var year = date.getFullYear();
  return month + " " + monthDate + ", " + year
}

Comment.prototype.friendlyTime = function (){
  var date = new Date(this.created_at);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var amPM = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 ; 
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + amPM;
  return strTime;
}

Comment.prototype.renderComment = function (){
  return Comment.template({content: this.content, id: this.id, friendlyDate: this.friendlyDate, friendlyTime: this.friendlyTime});
}

function newComment() {
  $('#new_comment').submit(function(event) {
    event.preventDefault();
    var values = $(this).serialize();
    $.post('/projects/1/comments',values).success(function(data) {
      console.log(data)
        var comment = new Comment(data);
        debugger
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