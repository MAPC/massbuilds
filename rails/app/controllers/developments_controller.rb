class DevelopmentsController < ApplicationController
  before_action :set_development, only: [:show, :edit, :update, :destroy]
  skip_before_action :authenticate_user!, only: [:index]

  # GET /developments
  def index
    authorize Development
    @developments = if params[:term]
                      Development.search_by_name_and_location(params[:term])
                    elsif params[:minLat] && params[:minLng] && params[:maxLat] && params[:maxLng]
                      Development.where("point && ST_MakeEnvelope(?, ?, ?, ?, 4326) ", params[:minLng], params[:minLat], params[:maxLng], params[:maxLat])
                    else
                      Development.where(filtered_params)
                    end
    respond_to do |format|
      format.jsonapi do
        scope = 'trunc' if params[:trunc]
        render jsonapi: @developments, scope: scope
      end
      format.csv { send_data @developments.to_csv, filename: "developments-#{Date.today}.csv" }
    end
  end

  # GET /developments/1
  def show
    authorize @development
    respond_to do |format|
      format.jsonapi { render jsonapi: @development }
    end
  end

  # POST /developments
  def create
    @development = Development.new(development_params)
    authorize @development
    @development.user = current_user

    if @development.save
      respond_to do |format|
        format.jsonapi { head :created }
      end
    else
      head :bad_request
    end
  end

  # PATCH/PUT /developments/1
  def update
    authorize @development
    if @development.update(development_params)
      redirect_to @development, notice: 'Development was successfully updated.'
    else
      respond_to do |format|
        format.jsonapi { head :bad_request }
      end
    end
  end

  # DELETE /developments/1
  def destroy
    authorize @development
    if @development.destroy
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
    def set_development
      @development = Development.find(params[:id])
    end

    def filtered_params
      params.permit(:user_id, :rdv, :asofright, :ovr55, :clusteros, :phased, :stalled, :name, :status, :desc, :project_url, :mapc_notes, :tagline, :address, :state, :zip_code, :height, :stories, :year_compl, :prjarea, :singfamhu, :twnhsmmult, :lgmultifam, :tothu, :gqpop, :rptdemp, :emploss, :estemp, :commsf, :hotelrms, :onsitepark, :total_cost, :team_membership_count, :cancelled, :private, :fa_ret, :fa_ofcmd, :fa_indmf, :fa_whs, :fa_rnd, :fa_edinst, :fa_other, :fa_hotel, :other_rate, :affordable, :latitude, :longitude, :parcel_id, :mixed_use, :point, :programs, :forty_b, :residential, :commercial, :developer_name, :municipality)
    end

    # Only allow a trusted parameter "white list" through.
    def development_params
      respond_to do |format|
        format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params, only: [:user_id, :rdv, :asofright, :ovr55, :clusteros, :phased, :stalled, :name, :status, :desc, :project_url, :mapc_notes, :tagline, :address, :state, :zip_code, :height, :stories, :year_compl, :prjarea, :singfamhu, :twnhsmmult, :lgmultifam, :tothu, :gqpop, :rptdemp, :emploss, :estemp, :commsf, :hotelrms, :onsitepark, :total_cost, :team_membership_count, :cancelled, :private, :fa_ret, :fa_ofcmd, :fa_indmf, :fa_whs, :fa_rnd, :fa_edinst, :fa_other, :fa_hotel, :other_rate, :affordable, :latitude, :longitude, :parcel_id, :mixed_use, :point, :programs, :forty_b, :residential, :commercial, :developer_name, :municipality]) }
      end
    end
end
