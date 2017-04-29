require "slim"

# load File.join(".", "why_turbolinks.rb")
require_relative "why_turbolinks"


# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :livereload

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

activate :external_pipeline,
           name: :webpack,
           command: build? ? "yarn run build" : "yarn run start",
           source: ".tmp/dist",
           latency: 1

set :js_dir, 'assets/javascripts'
set :build_dir, 'public'

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

SECTION_PAGE_TEMPLATE = "/templates/section_page.html"

begin
  # Proxy pages
  # https://middlemanapp.com/advanced/dynamic-pages/

  WhyTurbolinks::Sections.map(@app.data).each do |page_model|
    proxy page_model.resource_name, SECTION_PAGE_TEMPLATE, locals: { section_page: page_model }
  end
end

ignore SECTION_PAGE_TEMPLATE

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

helpers do
  def page_resource
    current_page.locals[:section_page].presence || current_page
  end

  def page_resource_data
    page_resource.data
  end

  def page_section_resource?
    page_resource.is_a? WhyTurbolinks::Sections::Page
  end

  def show_fab?
    page_section_resource? || page_resource_data.show_fab.present?
  end

  def page_resource_title
    "#{ data.app.name } | #{ page_resource_data.page_title }"
  end

  def page_resource_description
    page_resource_data.page_description
  end

  def page_resource_meta_description
    strip_tags page_resource_description
  end

  def icon_path(path)
    "#{data.icons.folder}#{path}"
  end

  def image_icon_path(path)
    image_path icon_path(path)
  end

  def icon_with_sizes_path(icon, image_sizes)
    icon_path("#{icon.name}#{image_sizes}.png")
  end

  def image_icon_with_sizes_path(*args)
    image_path icon_with_sizes_path(*args)
  end

  def social_image_icon_url
    image = image_icon_with_sizes_path(data.icons.manifest_json, '512x512')

    "#{config[:host]}#{image}"
  end

  def page_resource_url
    "#{config[:host]}#{current_resource.url}"
  end
end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

configure :development do
  config[:host] = @app.data.app.hosts.my
end

configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :gzip
  activate :minify_html

  # Append a hash to asset urls (make sure to use the url helpers)
  activate :asset_hash, ignore: [/^service-worker/, /^firebase-messaging-sw/]

  config[:host] = @app.data.app.hosts.my
end
