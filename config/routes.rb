Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :applicants
  resources :offers do
    post "send-contract" => "offers#send_contract"
    post "decision/:code" => "offers#set_status"
    post "hr-status/:code" => "offers#update_hr_status"
  end
  resources :sessions

  post "offers/print" => "offers#combine_contracts_print"
  post "offers/nag" => "offers#batch_email_nags"
  post "import/offers" => "import#import_offers"

  #temp-testing views
  get "test" => "app#test"
  get "decision/:utorid/:position_id" => "app#decision"
end
