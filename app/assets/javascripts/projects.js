$(document).ready(function(){
  compileProjectTemplate();
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
    this.overdue = "";
    this.complete = "";
    this.collaborators = attributes.collaborators;
  }

  // Display a formatted date
  friendlyDate() {
    var date = new Date(this.createdAt);
    var friendlyDate = this.formatDate(date);
    this.createdAt = friendlyDate;
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


  // Check if the Project is overdue
  overdueProjectCheck() {
    var createdDate = new Date(this.createdAt);
    var currentDate = new Date();
    if (createdDate < currentDate && this.status !== "complete") {
      this.overdue = "Overdue";
    }
  }

  // Check if the Project is complete
  completeProjectCheck() {
    if (this.status === "complete") {
      this.complete = "Complete";
    }
  }

  // Render the handlebars template
  renderProject() {
    return projectTemplate(this);
  }

  // Iterate over the assigned users array and create a string of users
  assignCollaborators(userArray) {
    var names = "";
    $.each(userArray, function(index, user){
      names = names + user.name + ", ";
    });
    this.collaborators = names;
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
    console.log(data);
    $(".row").html("");
    $('h2').text(data.length + " projects");
    renderProjectResponse(data);
  });
}

// render the AJAX response to the page
function renderProjectResponse(data) {
  $.each(data, function(index, project){
    var projectObject = new Project(project);
    projectObject.overdueProjectCheck();
    projectObject.completeProjectCheck();
    projectObject.friendlyDate();
    projectObject.assignCollaborators(projectObject.collaborators);
    var projectRender = projectObject.renderProject();
    $(".row").prepend(projectRender);
  })
}

// compile the handlebars template on document load
function compileProjectTemplate(){
  projectSource = $("#projectTemplate").html();
  if ( projectSource !== undefined ) {
    projectTemplate = Handlebars.compile(projectSource); 
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
