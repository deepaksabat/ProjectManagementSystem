class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :due_date, :status, :created_at, :updated_at
  has_one :owner
  has_many :collaborators
  has_many :notes
  has_many :tasks
end
