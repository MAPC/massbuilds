class ParcelSerializer < ActiveModel::Serializer
  attributes :gid, :geojson, :muni, :poly_typ, :site_addr
end
