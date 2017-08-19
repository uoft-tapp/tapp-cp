module Mangler
  SALT = SecureRandom.random_bytes(64)
  KEY = ActiveSupport::KeyGenerator.new(Rails.application.secrets.secret_key_base)

  def crypt(data, salt, type)
    crypt = make_key(salt)
    mangled = crypt.encrypt_and_sign(data.to_json)
    get_route(mangled, type)
  end

  def decrypt(mangled, salt)
    crypt = make_key(salt)
    JSON.parse(crypt.decrypt_and_verify(mangled), symbolize_names: true)
  end

  private
  def make_key(salt)
    key = KEY.generate_key(salt.to_s, 32)
    ActiveSupport::MessageEncryptor.new(key)
  end

  def get_route(mangled, type)
    "#{request.base_url}/pb/#{type}/#{mangled}"
  end

end
