class Flag < ApplicationRecord
  acts_as_paranoid
  belongs_to :user
  belongs_to :development
end
