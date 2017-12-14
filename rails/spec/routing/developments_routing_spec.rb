require "rails_helper"

RSpec.describe DevelopmentsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/developments").to route_to("developments#index")
    end

    it "routes to #show" do
      expect(:get => "/developments/1").to route_to("developments#show", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/developments").to route_to("developments#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/developments/1").to route_to("developments#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/developments/1").to route_to("developments#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/developments/1").to route_to("developments#destroy", :id => "1")
    end

  end
end
