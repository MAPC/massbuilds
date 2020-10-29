class EditsController < ApplicationController
  before_action :set_edit, only: [:show, :edit, :update, :destroy]

  # GET /edits
  def index
    authorize Edit
    @edits = if params[:filter]
               Edit.where(approved: params[:filter][:approved])
             else
               Edit.all
             end
    respond_to do |format|
      format.jsonapi { render jsonapi: @edits }
    end
  end

  # GET /edits/1
  def show
    authorize @edit
    respond_to do |format|
      format.jsonapi { render jsonapi: @edit }
    end
  end

  # GET /edits/new
  def new
    @edit = Edit.new
    authorize @edit
  end

  # GET /edits/1/edit
  def edit
    authorize @edit
  end

  # POST /edits
  def create
    @edit = Edit.new(edit_params)
    authorize @edit

    @edit.user = current_user

    if @edit.save
      respond_to do |format|
        format.jsonapi { render jsonapi: @edit }
      end
    else
      respond_to do |format|
        format.jsonapi { render jsonapi: @edit.errors.full_messages, status: :bad_request }
      end
    end
  end

  # PATCH/PUT /edits/1
  def update
    authorize @edit
    if @edit.update(edit_params)
      respond_to do |format|
        format.jsonapi { render jsonapi: @edit }
      end
    else
      head :bad_request
    end
  end

  # DELETE /edits/1
  def destroy
    authorize @edit
    if @edit.destroy
      respond_to do |format|
        format.jsonapi { head :no_content }
      end
    else
      respond_to do |format|
        format.jsonapi { head :bad_request }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_edit
      @edit = Edit.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def edit_params
      # TODO: Figure out how to permit filter params when calling index.
      # Typical rails approach: params.permit(filter: [:approved])
      respond_to do |format|
        format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params) }
      end
    end
end
