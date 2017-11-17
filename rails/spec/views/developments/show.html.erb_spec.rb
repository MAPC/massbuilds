require 'rails_helper'

RSpec.describe "developments/show", type: :view do
  before(:each) do
    @development = assign(:development, Development.create!(
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
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/2/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/Status/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/Project Url/)
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/Tagline/)
    expect(rendered).to match(/Address/)
    expect(rendered).to match(/State/)
    expect(rendered).to match(/Zip Code/)
    expect(rendered).to match(/3/)
    expect(rendered).to match(/4/)
    expect(rendered).to match(/5/)
    expect(rendered).to match(/6/)
    expect(rendered).to match(/7/)
    expect(rendered).to match(/8/)
    expect(rendered).to match(/9/)
    expect(rendered).to match(/10/)
    expect(rendered).to match(/11/)
    expect(rendered).to match(/12/)
    expect(rendered).to match(/13/)
    expect(rendered).to match(/14/)
    expect(rendered).to match(/15/)
    expect(rendered).to match(/16/)
    expect(rendered).to match(/17/)
    expect(rendered).to match(/18/)
    expect(rendered).to match(/19/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/20.5/)
    expect(rendered).to match(/21.5/)
    expect(rendered).to match(/22.5/)
    expect(rendered).to match(/23.5/)
    expect(rendered).to match(/24.5/)
    expect(rendered).to match(/25.5/)
    expect(rendered).to match(/26.5/)
    expect(rendered).to match(/27.5/)
    expect(rendered).to match(/28.5/)
    expect(rendered).to match(/29.5/)
    expect(rendered).to match(/9.99/)
    expect(rendered).to match(/9.99/)
    expect(rendered).to match(/Parcel/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(//)
    expect(rendered).to match(/Programs/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/false/)
    expect(rendered).to match(/false/)
  end
end
