Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :applicants
  resources :offers do
    post "send-contract" => "offers#send_contract"
    post "accept" => "offers#accept"
    post "reject" => "offers#reject"
  end
  resources :contracts
  get "offers/instructor/:instructor_id" => "offers#show_by_instructor"
  post "contracts/print" => "contracts#print"
  post "contracts/nag" => "contracts#nag"
  post "contracts/withdraw" => "contracts#withdraw"
  get "test" => "app#test"
end
