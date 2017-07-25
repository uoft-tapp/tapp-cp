Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :applicants
  resources :offers do
    post "send-contract" => "offers#send_contract"
  end
  resources :contracts do
    post "nag" => "contracts#nag"
  end
  get "offers/instructor/:instructor_id" => "offers#show_by_instructor"
end
