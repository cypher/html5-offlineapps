require 'rack'
require 'sinatra'

configure do
  Rack::Mime::MIME_TYPES[".manifest"] = "text/cache-manifest"
end

get '/' do
end

get '/notepad.manifest' do
  content_type ''
end
