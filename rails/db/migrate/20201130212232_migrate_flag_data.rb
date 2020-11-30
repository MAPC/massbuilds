class MigrateFlagData < ActiveRecord::Migration[5.1]
  def up
    Development.where(flag: true).each do |development|
      Flag.create(development: development, is_resolved: false)
    end
  end

  def down
    Development.where(flag: true).each do |development|
      Flag.find_by(development_id: development.id).destroy!
    end
  end
end
