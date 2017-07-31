class AppController < ActionController::Base
  def test
    @contracts = Contract.all.map { |c| c.format }
    @offers = Offer.all.map {|o| o.format }
    render :test, layout: false
  end
end
