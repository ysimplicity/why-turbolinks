require "delegate"
require "forwardable"

module WhyTurbolinks

  module Sections
    DATA_FOLDER_NAME = :sections
    DATA_FOLDER_PATH = File.join(File.dirname(__FILE__), 'data', String(DATA_FOLDER_NAME))

    class Article < SimpleDelegator
      attr_reader :section

      def initialize(section, article)
        @section = section
        @article = article

        __setobj__(article)
      end

      %i(video body author).each do |attr_name|
        define_method "#{ attr_name }?" do
          attr_present? attr_name
        end
      end

      def id
        "#{section.name}-#{title}".parameterize
      end

      def title
        "<span class=\"article__title\">#{ @article.title }</span>"
      end

      def header
        author? ? "#{ title }<br><small>#{ author }</small>" : title
      end

      private

        def attr_present?(name)
          respond_to?(name) && public_send(name).present?
        end
    end

    Page = Struct.new(:data_name, :data) do
      extend Forwardable

      def_delegators :data, :page_title, :page_header, :page_description

      def name
        @name ||= String(data_name).sub(/\A\d*_/, '').dasherize
      end

      def resource_name
        @resource_name ||= "#{name}.html"
      end

      def resource_path
        @resource_path ||= "/#{resource_name}"
      end

      def articles
        @articles ||= data.articles.map { |article| Article.new(self, article) }
      end
    end

    def self.data_names
      Dir[File.join(DATA_FOLDER_PATH, "*")].map do |file|
        file.sub(DATA_FOLDER_PATH, '').gsub(/#{File::SEPARATOR}|\.yml/, '')
      end
    end

    def self.fetch_data(data, name)
      data[DATA_FOLDER_NAME][name]
    end

    def self.map(data)
      data_names.map do |data_name|
        Sections::Page.new data_name, fetch_data(data, data_name)
      end
    end

    def self.map_unique_articles(data)
       map(data)
        .map(&:articles)
        .flatten
        .uniq { |article| article.video? ? article.video : article.url }
    end

    def self.count_by_subject(data)
      articles    = map_unique_articles(data)
      data_names  = articles.map(&:section).map(&:data_name)
      pwa_pattern = /_pwa$/

      {
        pwa: data_names.count { |data_name| data_name =~ pwa_pattern },
        turbolinks: data_names.count { |data_name| data_name !~ pwa_pattern }
      }
    end

    def self.group_unique_articles_by_sections(data)
      articles = map_unique_articles(data)

      articles.group_by { |article| article.section }
    end
  end

end
