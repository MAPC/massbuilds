class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  skip_before_action :authenticate_user!, only: [:index]

  # GET /users
  def index
    authorize User
    @users = User.all
    respond_to do |format|
      format.jsonapi { render jsonapi: @users }
      format.html
    end
  end

  # GET /users/1
  def show
    authorize @user
    respond_to do |format|
      format.jsonapi { render jsonapi: @user }
      format.html
    end
  end

  # POST /users
  def create
    @user = User.new(user_params)
    authorize @user

    if @user.save
      respond_to do |format|
        format.jsonapi { head :created }
        format.html { redirect_to @user, notice: 'user was successfully created.' }
      end
    else
      head :bad_request
    end
  end

  # PATCH/PUT /users/1
  def update
    authorize @user
    filtered_params = (@user == current_user) ? user_params.except(:role) : user_params
    return head :unauthorized if filtered_params.empty?
    if @user.update(filtered_params)
      respond_to do |format|
        format.jsonapi { head :ok }
        format.html { redirect_to @user, notice: 'user was successfully created.' }
      end
    else
      head :bad_request
    end
  end

  # DELETE /users/1
  def destroy
    authorize @user
    if @user.destroy
      respond_to do |format|
        format.jsonapi { head :ok }
        format.html { redirect_to users_url, notice: 'user was successfully destroyed.' }
      end
    else
      respond_to do |format|
        format.jsonapi { head :bad_request }
        format.html { redirect_to users_url, notice: 'destroying user failed.' }
      end
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def user_params
    respond_to do |format|
      format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params, only: [:email, :password, :role, :first_name, :last_name]) }
      format.html { params.require(:user).permit(:email, :password, :role, :first_name, :last_name) }
    end
  end
end
