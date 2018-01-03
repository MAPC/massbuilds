class AddCalculatedRpaField < ActiveRecord::Migration[5.1]
  def change
    reversible do |dir|
      dir.up do
        execute "IMPORT FOREIGN SCHEMA editor LIMIT TO (rpa_poly) FROM SERVER dblive95 INTO public;"
      end

      dir.down do
        execute "DROP FOREIGN TABLE IF EXISTS rpa_poly"
      end

      add_reference :developments, :rpa_poly, index: true
    end
  end
end
