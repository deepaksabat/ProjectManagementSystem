class NoteSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :created_at
  has_one :user
  has_one :project
end
