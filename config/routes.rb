Rails.application.routes.draw do
  # for the administration side of CP
  get 'admin/index'

  # for user facing side of CP
  get 'cp/index'

  # temporary contract pdf generator
  get "/hello_react", to: "hello_react#contracts"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :applicants
  resources :offers do
    post "send-contract" => "offers#send_contract"
  end
  resources :contracts do
    post "nag" => "contracts#nag"
  end
  get "offers/instructor/:instructor_id" => "offers#show_by_instructor"
  #post "offers/:id/send-contract" => "offers#send_contract"
  #post "contracts/:id/nag" => "contracts#nag"
end
