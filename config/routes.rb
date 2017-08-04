Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :applicants
  resources :offers do
    post "send-contract" => "offers#send_contract"
  end
  resources :contracts do
    post "decision/:code" => "contracts#set_status"
  end
  get "offers/instructor/:instructor_id" => "offers#show_by_instructor"
  post "contracts/print" => "contracts#print"
  post "contracts/nag" => "contracts#nag"
  get "test" => "app#test"
  get "decision/:utorid/:position_id" => "app#decision"
end
