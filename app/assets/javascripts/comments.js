function newComment() {
  $('#new_comment').submit(function(event) {
    //prevent form from submitting the default way
    event.preventDefault();

    var values = $(this).serialize();

    $.post('/projects/1/comments',values).success(function(data) {
      debugger
      console.log(data)
        $(".comments").prepend('<div id="' + data.id + '">' + data.content + '</div>');
        $("#test").html(data.content);
      });
  });
}


$(document).ready(function(){
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