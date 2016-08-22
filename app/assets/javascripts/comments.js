function Comment(attributes) {
  this.id = attributes.id;
  this.content = attributes.content;
  this.created_at = attributes.created_at;
  this.task_id = attributes.task_id;
  this.user_id = attributes.user_id;
}

// Comment.prototype.friendly_created_at(){

// }

Comment.prototype.renderComment = function (){
  return Comment.template(this);
}


function newComment() {
  $('#new_comment').submit(function(event) {
    //prevent form from submitting the default way
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




// `<div class="<%= col %>" id="<%= comment.id%>">`
//   <p> Posted: <%= comment.friendly_created_at %> by <%= comment.user.name %></p>
//   <p>On <%= link_to comment.task.name, task_path(comment.task) %> in <%= link_to comment.task.project.name, project_path(comment.task.project) %></p>
//   <p> <%= comment.content %></p>
//   <div class="inline-button">
//     <%= link_to "Edit", edit_comment_path(comment), class: "btn btn-sm btn-primary" %> 
//   </div>
//   <div class="inline-button">    
//     <%= button_to "Delete", comment_path(comment), method: :delete, class: "btn btn-sm btn-danger" %>
//   </div>
//   <div class="line-light"></div>
// </div>