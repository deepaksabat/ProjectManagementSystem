module DateTimeConverter
  def friendly_created_at
    self.created_at.strftime(" %m/%d/%Y at %I:%M %p")
  end
end