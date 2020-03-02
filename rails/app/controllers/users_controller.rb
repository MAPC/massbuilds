class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, only: [:index]

  # GET /users
  def index
    authorize User
    if params[:email]
      @users = User.where(email: params[:email]).first
    elsif params[:request_verified_status]
      @users = User.where(request_verified_status: true)
    else
      @users = User.all
    end

    respond_to do |format|
      format.jsonapi { render jsonapi: @users }
      format.all { render json: @users }
    end
  end

  # GET /users/1
  def show
    authorize @user
    respond_to do |format|
      format.jsonapi { render jsonapi: @user }
    end
  end

  # POST /users
  def create
    @user = User.new(user_params)
    authorize @user

    if @user.save
      respond_to do |format|
        format.jsonapi { render(status: :created, jsonapi: @user) }
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
        format.jsonapi { render jsonapi: @user }
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
      end
    else
      respond_to do |format|
        format.jsonapi { head :bad_request }
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
      format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params, only: [:email, :password, :role, :first_name, :last_name, :municipality, :request_verified_status]) }
    end
  end
end
