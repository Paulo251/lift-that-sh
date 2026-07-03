class Admin::UsersController < Admin::BaseController
  def index
    users = User.order(:created_at)
    render json: users.map { |u| UserSerializer.render(u, detail: true) }
  end

  def create
    user = User.new(user_params)
    user.save!
    render json: UserSerializer.render(user, detail: true), status: :created
  end

  def update
    user = User.find(params[:id])
    attrs = user_params
    attrs.delete(:password) if attrs[:password].blank?
    user.update!(attrs)
    render json: UserSerializer.render(user, detail: true)
  end

  def destroy
    user = User.find(params[:id])

    if user == current_user
      return render json: { error: "Você não pode excluir a si mesmo" }, status: :unprocessable_entity
    end

    user.destroy!
    head :no_content
  end

  private

  def user_params
    params.permit(:name, :email, :password, :admin)
  end
end
