module Mangler
  def crypt(data, salt)
    crypt = make_key(salt)
    crypt.encrypt_and_sign(data.to_json)
  end

  def decrypt(mangled, salt)
    crypt = make_key(salt)
    JSON.parse(crypt.decrypt_and_verify(mangled), symbolize_names: true)
  end

  def get_offer_id(mangled)
    Offer.all.each do |offer|
      if offer[:link]==mangled
        return offer[:id]
      end
    end
    return nil
  end

  def get_route(mangled, type=nil)
    if !type
      "#{request.base_url}/pb/#{mangled}"
    else
      "#{request.base_url}/pb/#{mangled}/#{type}"
    end
  end

  private
  def make_key(salt)
    key = make_password(salt).generate_key(salt.to_s, 32)
    ActiveSupport::MessageEncryptor.new(key)
  end

  def make_password(salt)
    password = Rails.application.secrets.secret_key_base
    index = salt
    while salt > password.length - 10
      index-= (password.length-10)
    end
    ActiveSupport::KeyGenerator.new(password[index..password.length])
  end

end
