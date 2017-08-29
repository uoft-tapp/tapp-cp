module Mangler
  '''
    crypt makes data into a salted hash that represents the :mangled part of
    the /pb routes
  '''
  def crypt(data, salt)
    crypt = make_key(salt)
    crypt.encrypt_and_sign(data.to_json)
  end

  '''
    decrypt the mangled data into the original data
    salt is the same salt used to make the data into a hash
  '''
  def decrypt(mangled, salt)
    crypt = make_key(salt)
    JSON.parse(crypt.decrypt_and_verify(mangled), symbolize_names: true)
  end

  def get_offer_id(mangled)
    offer = Offer.find_by(link: mangled)
    if offer
      return offer[:id]
    else
      return nil
    end
  end

  def get_route(mangled, type=nil)
    if !type
      "#{ENV["domain"]}/pb/#{mangled}"
    else
      "#{ENV["domain"]}/pb/#{mangled}/#{type}"
    end
  end

  private
  def make_key(salt)
    key = make_password(salt).generate_key(salt.to_s, 32)
    ActiveSupport::MessageEncryptor.new(key)
  end

  '''
  create a password to create/decrypt the hash
  '''
  def make_password(salt)
    password = Rails.application.secrets.secret_key_base
    index = salt
    while salt > password.length - 10
      index-= (password.length-10)
    end
    ActiveSupport::KeyGenerator.new(password[index..password.length])
  end

end
