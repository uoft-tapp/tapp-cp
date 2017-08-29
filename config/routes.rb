Rails.application.routes.draw do
  get '/tapp/(*z)', to: "app#tapp"
  get '/cp/(*z)', to: "app#cp"

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

  # CP resources
  resources :offers do
    post "decision/:status" => "offers#set_status"
    get "pdf" => "offers#get_contract"
  end

  # shared resources
  resources :sessions

  # TAPP routes
  get "/export/chass/:round_id", to: "export#chass"
  get "/export/cdf-info", to: "export#cdf"
  get "/export/transcript-access", to: "export#transcript_access"
  get "/export/offers", to: "export#offers"
  post "/import/chass", to: "import#chass"
  post "/import/enrollment", to: "import#enrollment"

  # CP routes
  post "offers/send-contracts" => "offers#send_contracts"
  post "offers/print" => "offers#combine_contracts_print"
  post "offers/nag" => "offers#batch_email_nags"
  post "import/offers" => "import#import_offers"
  post "import/locked-assignments" => "import#import_locked_assignments"

  # shared routes
  post "/login", to: "roles#login"
  post "/logout", to: "roles#logout"

  #temp-testing views
  get "test" => "app#test"
  get "/test", to: "roles#test"

  '''
    The following routes are mangled urls, so that attacker can`t mess with the
    status of another student.
  '''
  get "pb/:mangled" => "app#student_view"
  get "pb/:mangled/pdf" => "offers#get_contract_mangled"
  post "pb/:mangled/:status" => "offers#set_status_mangled"
end
