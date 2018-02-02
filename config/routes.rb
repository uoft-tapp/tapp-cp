include Authorizer
Rails.application.routes.draw do
  get '/tapp/(*z)', to: "app#tapp"
  get '/cp/(*z)', to: "app#cp"
  get '/roles', to: "app#roles"

  post '/logout', to: "app#logout"
  post '/reenter-session', to: "app#reenter_session"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # TAPP resources
  resources :sessions do
    resources :applicants, only: [:index]
    resources :applications, only: [:index]
    resources :assignments, only: [:index]
    resources :positions, only: [:index]
    resources :instructors, only: [:index]
    resources :offers, only: [:index]
    resources :ddahs, only: [:index]
  end
  scope '/sessions/:session_id/instructors/:utorid' do
    get "offers", to: "offers#index"
    get "positions", to: "positions#index"
    get "ddahs", to: "ddahs#index"
  end
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
    post "accept" => "offers#accept_offer"
    post "reset" => "offers#reset_offer"
  end
  resources :duties, only: [:index, :show]
  resources :trainings, only: [:index, :show]
  resources :categories, only: [:index, :show]

  # shared resources
  resources :sessions, only: [:index, :show, :update]

  # DDAH routes
  get 'instructors/utorid/:utorid' => "instructors#show_by_utorid"
  scope 'instructors/:utorid' do
    resources :offers, only: [:index, :show]
    resources :positions, only: [:index, :show]
    resources :ddahs, only: [:index, :show, :create, :destroy, :update]
    resources :templates, only: [:index, :show, :create, :destroy, :update]
  end
  resources :ddahs, only: [:index, :show, :create, :destroy, :update]
  scope 'ddahs/:ddah_id' do
    post "new-template" => "ddahs#new_template"
    get "pdf", to: "ddahs#pdf"
    post "accept", to: "ddahs#accept"
  end
  resources :templates, only: [:index, :show, :create, :destroy, :update]

  # TAPP routes
  get "/export/chass/:round_id", to: "export#chass"
  get "/export/cdf-info", to: "export#cdf"
  get "/export/transcript-access", to: "export#transcript_access"
  get "/export/offers", to: "export#offers"
  post "/import/chass", to: "import#chass"
  get "/export/cp-offers/:session_id", to: "export#cp_offers"
  post "/import/enrolment", to: "import#enrolment"
  post "/import/instructors", to: "import#instructors"
  post '/email-assignments', to: "assignments#email_assignments"

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
  post "/offers/can-nag-instructor" => "offers#can_nag_instructor"
  post "/offers/send-nag-instructor" => "offers#send_nag_instructor"
  post "import/offers" => "import#import_offers"
  post "import/locked-assignments" => "import#import_locked_assignments"
  post "/import/ddahs", to: "import#ddahs"
  post "/import/templates", to: "import#templates"
  get "/export/ddahs/:position_id", to: "export#ddahs"
  get "/export/session-ddahs/:session_id", to: "export#session_ddahs"

  post "/ddahs/preview" => "ddahs#preview"
  post "/ddahs/can-preview" => "ddahs#can_preview"
  post "/ddahs/can-send-ddahs" => "ddahs#can_send_ddahs"
  post "/ddahs/send-ddahs" => "ddahs#send_ddahs"
  post "/ddahs/can-nag-student" => "ddahs#can_nag_student"
  post "/ddahs/send-nag-student" => "ddahs#send_nag_student"
  post "/ddahs/status/can-finish" => "ddahs#can_finish_ddah"
  post "/ddahs/status/finish" => "ddahs#finish_ddah"
  post "/ddahs/status/can-approve" => "ddahs#can_approve_ddah"
  post "/ddahs/status/approve" => "ddahs#approve_ddah"
  get "/templates/:template_id/preview" => "templates#preview"

  # student-facing
  get "/pb/:offer_id" => "app#student_view"
  get "/pb/:offer_id/pdf" => "offers#get_contract_student"
  post "/pb/:offer_id/:status" => "offers#set_status_student"

  # student-facing for ddah
  get "/pb/ddah/:offer_id" => "app#ddah_view"
  get "/pb/ddah/:offer_id/pdf" => "ddahs#student_pdf"
  post "/pb/ddah/:offer_id/accept" => "ddahs#student_accept"

end
