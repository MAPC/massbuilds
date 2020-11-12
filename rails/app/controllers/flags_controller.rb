# frozen_string_literal: true

class FlagsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]

  def index
    authorize Flag
    @flags = if params[:filter]
               Flag.where(is_resolved: params[:filter][:is_resolved])
             else
               Flag.all
             end
    respond_to do |format|
      format.jsonapi { render jsonapi: @flags }
    end
  end

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
