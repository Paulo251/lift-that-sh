class UserSerializer
  def self.render(user, detail: false)
    base = { id: user.id, name: user.name, email: user.email, admin: user.admin }
    base[:created_at] = user.created_at if detail
    base
  end
end
