$(document).ready(function(){
  compileTemplate();
  getProjects();
});

class Project {
  constructor(attributes){
    this.id = attributes.id;
    this.description = attributes.description;
    this.name = attributes.name;
    this.dueDate = attributes.due_date;
    this.status = attributes.status;
    this.createdAt = attributes.created_at;
    this.ownerName = attributes.owner.name;
    this.taskCount = attributes.tasks.length;
    this.commentCount = attributes.comments.length;
    this.overdue = "";
    this.complete = "";
    this.collaborators = "";
  }

  // Check if the Project is overdue
  overdueCheck() {
    var createdDate = new Date(this.createdAt);
    var currentDate = new Date();
    if (createdDate < currentDate && this.status !== "complete") {
      this.overdue = "Overdue";
    }
  }

  // Check if the Project is complete
  completeCheck() {
    if (this.status === "complete") {
      this.complete = "Complete";
    }
  }

  // Render the handlebars template
  renderProject() {
    return template(this);
  }

  // Iterate over the assigned users array and create a string of users
  assignUsers(userArray) {
    var names = "";
    $.each(userArray, function(index, user){
      names = names + user.name + ", ";
    });
    this.assignedUsers = names;
    return this.assignedUsers;
  }

  // Check if the current user is assigned to the Project
  selfAssignCheck(userArray){
    var email = $("#email").text().slice(0, this.length);
    var assignment 
    $.each(userArray, function(index, user){
      if (user.email === email){
        assignment = true;
      }
    });
    return assignment;
  }
}

function getProjects() {
  $('#filter-projects-js').on("submit", function(event) {
    event.preventDefault();
    var url = $(event.target).attr('action');
    var values = $(this).serialize();
    fetchProjects(url, values);

  });
}

function fetchProjects(url, values){
  $.ajax({
    url: url,
    method: "GET",
    data: values,
    dataType: 'JSON'
  }).success(function(data) {
    debugger
    console.log(data);
    $(".row").html("");
    $('h2').text(data.length + " projects");
    renderResponse(data);
  });
}

// render the AJAX response to the page
function renderResponse(data) {
  $.each(data, function(index, project){
    var projectObject = new Project(project);
    projectObject.overdueCheck();
    projectObject.completeCheck();
    projectObject.assignUsers(project.assigned_users);
    var projectRender = projectObject.renderProject();
    $(".row").prepend(projectRender);
    if (projectObject.selfAssignCheck(project.assigned_users) === true){
      $("#self-assign").text("Assigned to you");
    }
  })
}

// compile the handlebars template on document load
function compileTemplate(){
  source = $("#projectTemplate").html();
  if ( source !== undefined ) {
    template = Handlebars.compile(source); 
  }
}

// format the page title after an AJAX request
function formatTitle(str){
  var array = str.replace(/[-]/, " ").split(" ");
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    newArray[i] = array[i].charAt(0).toUpperCase() + array[i].substr(1);
  }
  return newArray.join(" ");
}
