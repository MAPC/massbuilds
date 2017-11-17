require 'rails_helper'

RSpec.describe "developments/index", type: :view do
  before(:each) do
    assign(:developments, [
      Development.create!(
        :creator_id => 2,
        :rdv => false,
        :asofright => false,
        :ovr55 => false,
        :clusteros => false,
        :phased => false,
        :stalled => false,
        :name => "Name",
        :status => "Status",
        :desc => "MyText",
        :project_url => "Project Url",
        :mapc_notes => "MyText",
        :tagline => "Tagline",
        :address => "Address",
        :state => "State",
        :zip_code => "Zip Code",
        :height => 3,
        :stories => 4,
        :year_compl => 5,
        :prjarea => 6,
        :singfamhu => 7,
        :twnhsmmult => 8,
        :lgmultifam => 9,
        :tothu => 10,
        :gqpop => 11,
        :rptdemp => 12,
        :emploss => 13,
        :estemp => 14,
        :commsf => 15,
        :hotelrms => 16,
        :onsitepark => 17,
        :total_cost => 18,
        :team_membership_count => 19,
        :cancelled => false,
        :private => false,
        :fa_ret => 20.5,
        :fa_ofcmd => 21.5,
        :fa_indmf => 22.5,
        :fa_whs => 23.5,
        :fa_rnd => 24.5,
        :fa_edinst => 25.5,
        :fa_other => 26.5,
        :fa_hotel => 27.5,
        :other_rate => 28.5,
        :affordable => 29.5,
        :latitude => "9.99",
        :longitude => "9.99",
        :parcel_id => "Parcel",
        :mixed_use => false,
        :point => "",
        :programs => "Programs",
        :forty_b => false,
        :residential => false,
        :commercial => false
      ),
      Development.create!(
        :creator_id => 2,
        :rdv => false,
        :asofright => false,
        :ovr55 => false,
        :clusteros => false,
        :phased => false,
        :stalled => false,
        :name => "Name",
        :status => "Status",
        :desc => "MyText",
        :project_url => "Project Url",
        :mapc_notes => "MyText",
        :tagline => "Tagline",
        :address => "Address",
        :state => "State",
        :zip_code => "Zip Code",
        :height => 3,
        :stories => 4,
        :year_compl => 5,
        :prjarea => 6,
        :singfamhu => 7,
        :twnhsmmult => 8,
        :lgmultifam => 9,
        :tothu => 10,
        :gqpop => 11,
        :rptdemp => 12,
        :emploss => 13,
        :estemp => 14,
        :commsf => 15,
        :hotelrms => 16,
        :onsitepark => 17,
        :total_cost => 18,
        :team_membership_count => 19,
        :cancelled => false,
        :private => false,
        :fa_ret => 20.5,
        :fa_ofcmd => 21.5,
        :fa_indmf => 22.5,
        :fa_whs => 23.5,
        :fa_rnd => 24.5,
        :fa_edinst => 25.5,
        :fa_other => 26.5,
        :fa_hotel => 27.5,
        :other_rate => 28.5,
        :affordable => 29.5,
        :latitude => "9.99",
        :longitude => "9.99",
        :parcel_id => "Parcel",
        :mixed_use => false,
        :point => "",
        :programs => "Programs",
        :forty_b => false,
        :residential => false,
        :commercial => false
      )
    ])
  end

  it "renders a list of developments" do
    render
    assert_select "tr>td", :text => 2.to_s, :count => 2
    assert_select "tr>td", :text => false.to_s, :count => 24
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "Status".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 4
    assert_select "tr>td", :text => "Project Url".to_s, :count => 2
    assert_select "tr>td", :text => "Tagline".to_s, :count => 2
    assert_select "tr>td", :text => "Address".to_s, :count => 2
    assert_select "tr>td", :text => "State".to_s, :count => 2
    assert_select "tr>td", :text => "Zip Code".to_s, :count => 2
    assert_select "tr>td", :text => 3.to_s, :count => 2
    assert_select "tr>td", :text => 4.to_s, :count => 2
    assert_select "tr>td", :text => 5.to_s, :count => 2
    assert_select "tr>td", :text => 6.to_s, :count => 2
    assert_select "tr>td", :text => 7.to_s, :count => 2
    assert_select "tr>td", :text => 8.to_s, :count => 2
    assert_select "tr>td", :text => 9.to_s, :count => 2
    assert_select "tr>td", :text => 10.to_s, :count => 2
    assert_select "tr>td", :text => 11.to_s, :count => 2
    assert_select "tr>td", :text => 12.to_s, :count => 2
    assert_select "tr>td", :text => 13.to_s, :count => 2
    assert_select "tr>td", :text => 14.to_s, :count => 2
    assert_select "tr>td", :text => 15.to_s, :count => 2
    assert_select "tr>td", :text => 16.to_s, :count => 2
    assert_select "tr>td", :text => 17.to_s, :count => 2
    assert_select "tr>td", :text => 18.to_s, :count => 2
    assert_select "tr>td", :text => 19.to_s, :count => 2
    assert_select "tr>td", :text => 20.5.to_s, :count => 2
    assert_select "tr>td", :text => 21.5.to_s, :count => 2
    assert_select "tr>td", :text => 22.5.to_s, :count => 2
    assert_select "tr>td", :text => 23.5.to_s, :count => 2
    assert_select "tr>td", :text => 24.5.to_s, :count => 2
    assert_select "tr>td", :text => 25.5.to_s, :count => 2
    assert_select "tr>td", :text => 26.5.to_s, :count => 2
    assert_select "tr>td", :text => 27.5.to_s, :count => 2
    assert_select "tr>td", :text => 28.5.to_s, :count => 2
    assert_select "tr>td", :text => 29.5.to_s, :count => 2
    assert_select "tr>td", :text => "9.99".to_s, :count => 4
    assert_select "tr>td", :text => "Parcel".to_s, :count => 2
    assert_select "tr>td", :text => "".to_s, :count => 2
    assert_select "tr>td", :text => "Programs".to_s, :count => 2
  end
end
