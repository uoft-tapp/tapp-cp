include Authorizer
Rails.application.routes.draw do
  get '/tapp/(*z)', to: "app#tapp"
  get '/cp/(*z)', to: "app#cp"
  get '/roles', to: "app#roles"

  post '/logout', to: "app#logout"
  post '/reenter-session', to: "app#reenter_session"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # TAPP resources
  resources :applicants do
    resources :assignments, except: [:show]
    resources :applications, only: [:index]
  end
  resources :assignments, only: [:index, :show]
  resources :applications, only: [:index, :show]
  resources :positions
  resources :instructors

  get 'instructors/utorid/:utorid' => "instructors#show_by_utorid"
  scope 'instructors/:utorid' do
    resources :offers, only: [:index, :show]
    resources :positions, only: [:index, :show]
    resources :ddahs, only: [:index, :show]
    resources :templates, only: [:index, :show]
  end
  scope 'ddahs/:ddah_id' do
    resources :allocations, only: [:index, :show]
  end
  scope 'templates/:template_id' do
    resources :allocations, only: [:index, :show]
  end

  # CP resources
  resources :offers do
    post "decision/:status" => "offers#set_status"
    get "pdf" => "offers#get_contract"
    post "accept" => "offers#accept_offer"
  end
  resources :duties, only: [:index, :show]
  resources :trainings, only: [:index, :show]
  resources :categories, only: [:index, :show]

  # shared resources
  resources :sessions, only: [:index, :show, :update]

  # TAPP routes
  get "/export/chass/:round_id", to: "export#chass"
  get "/export/cdf-info", to: "export#cdf"
  get "/export/transcript-access", to: "export#transcript_access"
  get "/export/offers", to: "export#offers"
  post "/import/chass", to: "import#chass"
  get "/export/cp-offers/:session_id", to: "export#cp_offers"
  post "/import/enrollment", to: "import#enrollment"

  # CP routes
  post "offers/can-send-contract" => "offers#can_send_contract"
  post "offers/can-print" => "offers#can_print"
  post "offers/can-nag" => "offers#can_nag"
  post "offers/can-hr-update" => "offers#can_hr_update"
  post "offers/can-ddah-update" => "offers#can_ddah_update"
  post "offers/send-contracts" => "offers#send_contracts"
  post "offers/print" => "offers#combine_contracts_print"
  post "offers/nag" => "offers#batch_email_nags"
  post "offers/can-clear-hris-status" => "offers#can_clear_hris_status"
  post "offers/clear-hris-status" => "offers#clear_hris_status"
  post "import/offers" => "import#import_offers"
  post "import/locked-assignments" => "import#import_locked_assignments"

  # student-facing
  get "/pb/:offer_id" => "app#student_view"
  get "/pb/:offer_id/pdf" => "offers#get_contract_student"
  post "/pb/:offer_id/:status" => "offers#set_status_student"

end
