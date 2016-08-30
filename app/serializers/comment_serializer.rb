class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :created_at, :user_id
  has_one :task, serializer: CommentTaskSerializer
end
