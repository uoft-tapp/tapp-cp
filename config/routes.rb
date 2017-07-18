Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "/hello_react", to: "hello_react#contracts"

  resources :applicants
  resources :offers
  resources :contracts
  get "offers/instructor/:instructor_id" => "offers#show_by_instructor"
end
