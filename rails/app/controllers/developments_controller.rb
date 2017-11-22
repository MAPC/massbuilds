class DevelopmentsController < ApplicationController
  before_action :set_development, only: [:show, :edit, :update, :destroy]

  # GET /developments
  def index
    @developments = Development.all
    authorize @developments
  end

  # GET /developments/1
  def show
    authorize @development
  end

  # GET /developments/new
  def new
    @development = Development.new
    authorize @development
  end

  # GET /developments/1/edit
  def edit
    authorize @development
  end

  # POST /developments
  def create
    @development = Development.new(development_params)
    authorize @development

    if @development.save
      redirect_to @development, notice: 'Development was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /developments/1
  def update
    authorize @development
    if @development.update(development_params)
      redirect_to @development, notice: 'Development was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /developments/1
  def destroy
    authorize @development
    @development.destroy
    redirect_to developments_url, notice: 'Development was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_development
      @development = Development.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def development_params
      params.require(:development).permit(:creator_id, :rdv, :asofright, :ovr55, :clusteros, :phased, :stalled, :name, :status, :desc, :project_url, :mapc_notes, :tagline, :address, :state, :zip_code, :height, :stories, :year_compl, :prjarea, :singfamhu, :twnhsmmult, :lgmultifam, :tothu, :gqpop, :rptdemp, :emploss, :estemp, :commsf, :hotelrms, :onsitepark, :total_cost, :team_membership_count, :cancelled, :private, :fa_ret, :fa_ofcmd, :fa_indmf, :fa_whs, :fa_rnd, :fa_edinst, :fa_other, :fa_hotel, :other_rate, :affordable, :latitude, :longitude, :parcel_id, :mixed_use, :point, :programs, :forty_b, :residential, :commercial)
    end
end
