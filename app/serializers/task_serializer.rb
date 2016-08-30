class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :due_date, :status, :created_at, :updated_at, :owner, :comments, :assigned_users
  has_one :project
end
