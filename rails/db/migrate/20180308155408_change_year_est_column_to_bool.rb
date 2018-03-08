class ChangeYearEstColumnToBool < ActiveRecord::Migration[5.1]
  def change
    change_column :developments, :yrcomp_est, 'boolean USING CAST (yrcomp_est AS boolean)'
  end
end
