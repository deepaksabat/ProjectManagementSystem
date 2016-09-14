Rails.application.routes.draw do
  
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  root to: 'home#index'

  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks", registrations: 'users/registrations' }, skip: [:sessions] 
    as :user do
      get 'login' => 'devise/sessions#new', :as => :new_user_session
      post 'login' => 'devise/sessions#create', :as => :user_session
      delete 'logout' => 'devise/sessions#destroy', :as => :destroy_user_session
    end

  devise_scope :user do
    get "/signup" => "users/registrations#new"
    get "/profile" => 'users/registrations#edit'
  end

  resources :tags

  scope "/tasks" do
    get'/new', to: 'tasks#quick_new_task', as: "quick_new_task"
    post'/', to: 'tasks#create', as: "post_quick_new_task"
    get'/all', to: 'tasks#all', as: "get_all_tasks"
  end

  resources :projects do
    post '/delete_collaborator', to: 'projects#delete_collaborator'
    resources :comments, :notes, shallow: true
    resources :tasks, shallow: true
  end

  patch '/edit_user_project_permission', to: 'user_projects#edit_user_project_permission'
end
