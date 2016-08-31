class Task < ActiveRecord::Base
  include DateTimeConverter
  include IndexCheck

  belongs_to :project
  has_many :comments
  has_many :task_tags
  has_many :tags, through: :task_tags

  has_many :user_tasks, foreign_key: "assigned_task_id"
  has_many :assigned_users, through: :user_tasks
  belongs_to :owner, class_name: "User"

  enum status: [:active, :complete]

  validates :name, :description, :due_date, :status, :project_id, presence: true

  scope :complete, -> { where(status: 1) }
  scope :active, -> { where(status: 0)}
  scope :overdue, -> { where("due_date < ? AND status = ?", Date.today, 0)}

  #Custom writer and readers for Task for creating nested attributes

  def tag_names=(tags)
    tag_array = tags.split(",").map{|tag| tag.strip}
    tag_array.each do |tag|
      new_tag = Tag.find_or_create_by(name: tag)
      if self.tags.include?(new_tag)
        next
      end
      self.tags << new_tag
      self.owner.tags << new_tag
    end
  end

  def tag_names
    tags = self.tags.collect {|tag| tag.name}
    tags.join(", ")
  end

  def overdue?
    self.due_date < Date.today ? true : false
  end

  def self.project_tasks_filter(user, project, params)
    if params[:due] == "All" && params[:status] == "All" && params[:assigned] == "All"
      tasks = project.tasks
      return tasks
    end
    if params[:status] == "All"
      tasks = Task.where(project_id: project.id)
    else
      tasks = Task.where(status: params[:status], project_id: project.id)
    end
    if params[:assigned] == "To You"
      tasks = tasks.map {|t| t.assigned_users.include?(user) ? t : nil}.compact
    elsif params[:assigned] == "To Others"
      tasks = tasks.map {|t| !t.assigned_users.include?(user) ? t : nil}.compact
    else
      tasks.compact
    end
    if params[:due] == "Overdue"
      tasks = tasks.map {|t| t.due_date < Date.today && t.complete? == false ? t : nil}.compact
    end
    return tasks
  end

end 