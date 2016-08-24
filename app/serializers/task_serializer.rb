class TaskSerializer < ActiveModel::Serializer
  attributes :id, :owner_id, :name, :description, :due_date, :status, :created_at, :updated_at
  has_one :project
end
