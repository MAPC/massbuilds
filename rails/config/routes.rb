Rails.application.routes.draw do
  resources :edits
  devise_for :users, controllers: { sessions: 'sessions' }, path_prefix: 'my'
  resources :users
  resources :developments
  resources :password_resets, only: [:create]
  root 'developments#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
