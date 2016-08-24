function getActiveTasks() {
  $('#active-tasks').on("click", function(e) {
    $.ajax({
      url: '/tasks/all-active-tasks',
      method: "GET",
      dataType: 'JSON'
    }).success(function(data) {
        $.each(data, function(index, task){
          $(".row").append(task.description);
        })
      });
  });
}


$(document).ready(function(){
  getActiveTasks();
});