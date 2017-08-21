Rails.application.routes.draw do
  # for user facing side of CP
  get '/cp/(*z)', to: "app#index"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :applicants
  resources :offers do
    post "decision/:code" => "offers#set_status"
    get "contract" => "offers#get_contract"
  end
  resources :sessions

  post "offers/send-contracts" => "offers#send_contracts"
  post "offers/print" => "offers#combine_contracts_print"
  post "offers/nag" => "offers#batch_email_nags"
  post "import/offers" => "import#import_offers"
  post "import/locked-assignments" => "import#import_locked_assignments"

  #temp-testing views
  get "test" => "app#test"
  get "decision/:utorid/:position_id" => "app#decision"

  #mangled links
  get "pb/:mangled" => "app#student_view"
end
