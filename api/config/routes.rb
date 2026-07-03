Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  devise_for :users,
             path: "auth",
             path_names: { sign_in: "login", sign_out: "logout", registration: "register" },
             controllers: { sessions: "users/sessions", registrations: "users/registrations" },
             defaults: { format: :json }

  get "me", to: "me#show"

  namespace :admin do
    resources :users, only: %i[index create update destroy]
    resources :exercises, only: %i[index create update destroy]
  end

  resources :exercises, only: %i[index show] do
    get :progress, on: :member
  end

  resources :workouts, only: %i[index show create update destroy] do
    post :exercises, on: :member, to: "workout_exercises#sync"
  end

  resources :sessions, controller: "workout_sessions", only: %i[index show create update] do
    member do
      post :exercises, to: "session_exercises#create"
      post :set_logs,  to: "set_logs#create"
    end
  end

  resources :set_logs, only: %i[update destroy]
end
