class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :due_date, :status, :created_at, :updated_at, :assigned_users 
  has_one :owner
  has_many :comments
  has_one :project
end
