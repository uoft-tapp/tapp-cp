Rails.application.routes.draw do
  # for user facing side of CP
  get '/index.html/(*z)', to: "cp#index"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :applicants
  resources :offers do
    post "send-contract" => "offers#send_contract"
  end
  resources :contracts do
    post "decision/:code" => "contracts#set_status"
  end
  resources :sessions

  get "offers/instructor/:instructor_id" => "offers#show_by_instructor"
  post "contracts/print" => "contracts#combine_contracts_print"
  post "contracts/nag" => "contracts#batch_email_nags"
  post "import/offers" => "import#import_offers"

  #temp-testing views
  get "test" => "app#test"
  get "decision/:utorid/:position_id" => "app#decision"
end
