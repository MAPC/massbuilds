class FlagsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]


  def create
    @flag = Flag.new(flag_params)
    authorize @flag
    @flag.user = current_user

    if @flag.save
      respond_to do |format|
        format.jsonapi { render jsonapi: @flag }
      end
    else
      respond_to do |format|
        format.jsonapi { render jsonapi: @flag.errors.full_messages, status: :bad_request }
      end
    end
  end
  
  private
  def flag_params
    # TODO: Figure out how to permit filter params when calling index.
    # Typical rails approach: params.permit(filter: [:approved])
    respond_to do |format|
      format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params) }
    end
  end
end
