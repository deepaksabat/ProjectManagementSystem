class CommentTaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :due_date, :status, :created_at, :updated_at, :owner, :project
end
