require 'csv'
class Development < ApplicationRecord
  has_many :edits
  belongs_to :user
  include PgSearch
  pg_search_scope :search_by_name_and_location, against: [:name, :municipality, :address], using: { tsearch: { any_word: true } }
  validates :name, presence: true

  def self.to_csv
    attributes = self.column_names
    CSV.generate(headers: true) do |csv|
      csv << self.column_names
      all.each do |development|
        csv << attributes.map{ |attr| development.send(attr) }
      end
    end
  end

  def self.to_shp(sql)
    database = Rails.configuration.database_configuration[Rails.env]
    file_name = "export-#{Time.now.to_i}.shp"
    arguments = []
    arguments << "-f #{Rails.root.join('public', file_name)}"
    arguments << "-h #{database['host']}" if database['host']
    arguments << "-u #{database['username']}" if database['username']
    arguments << "-P #{database['password']}" if database['password']
    arguments << database['database']
    arguments << %("#{sql}") # %Q["SELECT * FROM developments;"]

    `pgsql2shp #{arguments.join(" ")}`

    return File.read(Rails.root.join('public', file_name))
  end

  # private

  # def zip(file_name, arguments)
  #   #Attachment name
  #   filename = 'basket_images-'+params[:delivery_date].gsub(/[^0-9]/,'')+'.zip'
  #   temp_file = Tempfile.new(filename)

  #   begin
  #     #This is the tricky part
  #     #Initialize the temp file as a zip file
  #     Zip::OutputStream.open(temp_file) { |zos| }

  #     #Add files to the zip file as usual
  #     Zip::File.open(temp_file.path, Zip::File::CREATE) do |zip|
  #       #Put files in here
  #     end

  #     #Read the binary data from the file
  #     zip_data = File.read(temp_file.path)

  #     #Send the data to the browser as an attachment
  #     #We do not send the file directly because it will
  #     #get deleted before rails actually starts sending it
  #     send_data(zip_data, :type => 'application/zip', :filename => filename)
  #   ensure
  #     #Close and delete the temp file
  #     temp_file.close
  #     temp_file.unlink
  #   end
end
