# Image & Video Tools Backend

This is the Sinatra + Mongoid + JWT backend for the Image & Video Tools app:
https://image-video-tools.onrender.com/

## Setup

1. `cd ruby`
2. Copy `.env.example` to `.env` and fill in your `MONGODB_URI` and `JWT_SECRET`.
3. `bundle install`
4. `bundle exec sidekiq -C config/sidekiq.yml &`
5. `rackup -p 4567`

Your API will be live at `http://localhost:4567`.

