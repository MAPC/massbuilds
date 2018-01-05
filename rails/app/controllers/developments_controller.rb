class DevelopmentsController < ApplicationController
  before_action :set_development, only: [:show, :edit, :update, :destroy]
  skip_before_action :authenticate_user!, only: [:index, :show]

  # GET /developments
  def index
    authorize Development
    @developments = if params[:term]
                      Development.search_by_name_and_location(params[:term])
                    elsif params[:minLat] && params[:minLng] && params[:maxLat] && params[:maxLng]
                      Development.where("point && ST_MakeEnvelope(?, ?, ?, ?, 4326) ", params[:minLng], params[:minLat], params[:maxLng], params[:maxLat])
                    elsif params[:filter]
                      filtered_developments(params[:filter])
                    else
                      Development.where(filtered_params)
                    end

    respond_to do |format|
      format.jsonapi do
        scope = 'trunc' if params[:trunc]
        render jsonapi: @developments, scope: scope
      end
      format.csv { send_data @developments.to_csv, filename: "massbuild-developments-#{Date.today}.csv" }
      format.zip do
        file_name = @developments.to_shp(@developments.to_sql)
        send_file Rails.root.join('public', "#{file_name}.zip")
        # FileUtils.rm Rails.root.join('public', "#{file_name}.zip")
        FileUtils.rm Rails.root.join('public', "#{file_name}.shp")
        FileUtils.rm Rails.root.join('public', "#{file_name}.shx")
        FileUtils.rm Rails.root.join('public', "#{file_name}.dbf")
        FileUtils.rm Rails.root.join('public', "#{file_name}.cpg")
        FileUtils.rm Rails.root.join('public', "#{file_name}.prj")
      end
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
      render jsonapi: @development.errors.full_messages, status: :bad_request
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
      params.permit(:user_id, :rdv, :asofright, :ovr55, :clusteros, :phased, :stalled, :name, :status,
                    :desc, :prj_url, :mapc_notes, :tagline, :address, :state, :zip_code, :height,
                    :stories, :year_compl, :prjarea, :singfamhu, :smmultifam, :lgmultifam, :hu, :gqpop,
                    :rptdemp, :emploss, :estemp, :commsf, :hotelrms, :onsitepark, :total_cost,
                    :team_membership_count, :cancelled, :private, :ret_sqft, :ofcmd_sqft, :indmf_sqft,
                    :whs_sqft, :rnd_sqft, :ei_sqft, :other_sqft, :hotel_sqft, :other_rate, :affordable,
                    :latitude, :longitude, :parcel_id, :mixed_use, :point, :programs, :forty_b, :residential,
                    :commercial, :municipality, :devlper, :yrcomp_est, :units_1bd, :units_2bd, :units_3bd,
                    :affrd_unit, :aff_u30, :aff_30_50, :aff_50_80, :aff_80p, :headqtrs, :park_type, :publicsqft)
    end

    # Only allow a trusted parameter "white list" through.
    def development_params
      respond_to do |format|
        format.jsonapi { ActiveModelSerializers::Deserialization.jsonapi_parse(params,
                         only: %i[user_id rdv asofright ovr55 clusteros phased stalled name status
                                  desc prj_url mapc_notes tagline address state zip_code height
                                  stories year_compl prjarea singfamhu smmultifam lgmultifam hu gqpop
                                  rptdemp emploss estemp commsf hotelrms onsitepark total_cost
                                  team_membership_count cancelled private ret_sqft ofcmd_sqft indmf_sqft
                                  whs_sqft rnd_sqft ei_sqft other_sqft hotel_sqft other_rate affordable
                                  latitude longitude parcel_id mixed_use point programs forty_b residential
                                  commercial municipality devlper yrcomp_est units_1bd units_2bd units_3bd
                                  affrd_unit aff_u30 aff_30_50 aff_50_80 aff_80p headqtrs park_type publicsqft])
                        }
      end
    end

    # Builds a SQL query to filter developments by query parameters
    def filtered_developments(filter_hash)
      sql = []
      values = []

      if filter_hash.is_a? String
        filter_hash = JSON.parse(filter_hash)
      end

      filter_hash.values.each do |filter|
        column = filter['col']

        if filter['filter'] == 'discrete'
          sql << '(' + filter['value'].map { |_| "#{column} = ?" }.join(' OR ') + ')'
          values = [*values, *filter['value']]

        else # metric
          type = filter['type']
          value = filter['value']
          inflector = (type == 'boolean' || type == 'string') ? '=' : filter['inflector']

          unless (
            (['=', '<', '>'].include?(inflector)) &&
            (
             (type == 'string') ||
             (type == 'number' && (/\A[-+]?\d+\z/ === value)) ||
             (type == 'boolean' && (value == 'true' || value == 'false'))
            )
          )
            next
          end

          sql << "#{column} #{inflector} ?"
          values << value
        end
      end

      return Development.where(sql.join(' AND '), *values)
    end
end
