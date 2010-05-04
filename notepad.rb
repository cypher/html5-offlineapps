require 'rack'
require 'sinatra'

configure do
  Rack::Mime::MIME_TYPES['.manifest'] = 'text/cache-manifest'
  disable :logging
end

get '/' do
  redirect '/index.html'
end

get '/clock' do
  redirect '/clock/clock.html'
end

get '/notepad' do
  redirect '/notepad/notepad.html'
end
