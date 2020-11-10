class CreateFlags < ActiveRecord::Migration[5.1]
  def change
    create_table :flags do |t|
      t.string :reason
      t.boolean :is_resolved
      t.belongs_to :development, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.datetime :deleted_at
      
      t.timestamps
    end
    add_index :flags, :deleted_at
  end
end
