class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  enum role: [:admin, :verified, :municipal, :user, :disabled]
  before_save :ensure_authentication_token
  has_many :edits
  has_many :developments
  has_many :flags
  after_initialize :set_default_role, if: :new_record?
  after_create :new_user_email

  private
  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).first
    end
  end

  def new_user_email
    UserMailer.new_user_email(self).deliver_later if User.first.created_at > Date.today.beginning_of_day
  end

  def set_default_role
    self.role ||= :user
  end
end
