require "rails_helper"

RSpec.describe EditsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/edits").to route_to("edits#index")
    end

    it "routes to #show" do
      expect(:get => "/edits/1").to route_to("edits#show", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/edits").to route_to("edits#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/edits/1").to route_to("edits#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/edits/1").to route_to("edits#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/edits/1").to route_to("edits#destroy", :id => "1")
    end

  end
end
