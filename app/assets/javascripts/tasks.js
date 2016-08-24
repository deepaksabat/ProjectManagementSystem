function getActiveTasks() {
  $('#active-tasks').on("click", function(e) {
    $.post('tasks/all-active-tasks',values).success(function(data) {
        $(".Tasks").prepend(TaskRender);
        $("#Task_content").val("");
      });
  });
}


$(document).ready(function(){
  Task.templateSource = $("#TaskTemplate").html();
  Task.template = Handlebars.compile(Task.templateSource); 
  newTask();
});