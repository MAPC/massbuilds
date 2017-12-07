require 'rails_helper'

RSpec.describe "developments/new", type: :view do
  before(:each) do
    assign(:development, Development.new(
      :rdv => false,
      :asofright => false,
      :ovr55 => false,
      :clusteros => false,
      :phased => false,
      :stalled => false,
      :name => "MyString",
      :status => "MyString",
      :desc => "MyText",
      :project_url => "MyString",
      :mapc_notes => "MyText",
      :tagline => "MyString",
      :address => "MyString",
      :state => "MyString",
      :zip_code => "MyString",
      :height => 1,
      :stories => 1,
      :year_compl => 1,
      :prjarea => 1,
      :singfamhu => 1,
      :twnhsmmult => 1,
      :lgmultifam => 1,
      :tothu => 1,
      :gqpop => 1,
      :rptdemp => 1,
      :emploss => 1,
      :estemp => 1,
      :commsf => 1,
      :hotelrms => 1,
      :onsitepark => 1,
      :total_cost => 1,
      :team_membership_count => 1,
      :cancelled => false,
      :private => false,
      :fa_ret => 1.5,
      :fa_ofcmd => 1.5,
      :fa_indmf => 1.5,
      :fa_whs => 1.5,
      :fa_rnd => 1.5,
      :fa_edinst => 1.5,
      :fa_other => 1.5,
      :fa_hotel => 1.5,
      :other_rate => 1.5,
      :affordable => 1.5,
      :latitude => "9.99",
      :longitude => "9.99",
      :parcel_id => "MyString",
      :mixed_use => false,
      :point => "",
      :programs => "MyString",
      :forty_b => false,
      :residential => false,
      :commercial => false
    ))
  end

  it "renders new development form" do
    render

    assert_select "form[action=?][method=?]", developments_path, "post" do

      assert_select "input[name=?]", "development[creator_id]"

      assert_select "input[name=?]", "development[rdv]"

      assert_select "input[name=?]", "development[asofright]"

      assert_select "input[name=?]", "development[ovr55]"

      assert_select "input[name=?]", "development[clusteros]"

      assert_select "input[name=?]", "development[phased]"

      assert_select "input[name=?]", "development[stalled]"

      assert_select "input[name=?]", "development[name]"

      assert_select "input[name=?]", "development[status]"

      assert_select "textarea[name=?]", "development[desc]"

      assert_select "input[name=?]", "development[project_url]"

      assert_select "textarea[name=?]", "development[mapc_notes]"

      assert_select "input[name=?]", "development[tagline]"

      assert_select "input[name=?]", "development[address]"

      assert_select "input[name=?]", "development[state]"

      assert_select "input[name=?]", "development[zip_code]"

      assert_select "input[name=?]", "development[height]"

      assert_select "input[name=?]", "development[stories]"

      assert_select "input[name=?]", "development[year_compl]"

      assert_select "input[name=?]", "development[prjarea]"

      assert_select "input[name=?]", "development[singfamhu]"

      assert_select "input[name=?]", "development[twnhsmmult]"

      assert_select "input[name=?]", "development[lgmultifam]"

      assert_select "input[name=?]", "development[tothu]"

      assert_select "input[name=?]", "development[gqpop]"

      assert_select "input[name=?]", "development[rptdemp]"

      assert_select "input[name=?]", "development[emploss]"

      assert_select "input[name=?]", "development[estemp]"

      assert_select "input[name=?]", "development[commsf]"

      assert_select "input[name=?]", "development[hotelrms]"

      assert_select "input[name=?]", "development[onsitepark]"

      assert_select "input[name=?]", "development[total_cost]"

      assert_select "input[name=?]", "development[team_membership_count]"

      assert_select "input[name=?]", "development[cancelled]"

      assert_select "input[name=?]", "development[private]"

      assert_select "input[name=?]", "development[fa_ret]"

      assert_select "input[name=?]", "development[fa_ofcmd]"

      assert_select "input[name=?]", "development[fa_indmf]"

      assert_select "input[name=?]", "development[fa_whs]"

      assert_select "input[name=?]", "development[fa_rnd]"

      assert_select "input[name=?]", "development[fa_edinst]"

      assert_select "input[name=?]", "development[fa_other]"

      assert_select "input[name=?]", "development[fa_hotel]"

      assert_select "input[name=?]", "development[other_rate]"

      assert_select "input[name=?]", "development[affordable]"

      assert_select "input[name=?]", "development[latitude]"

      assert_select "input[name=?]", "development[longitude]"

      assert_select "input[name=?]", "development[parcel_id]"

      assert_select "input[name=?]", "development[mixed_use]"

      assert_select "input[name=?]", "development[point]"

      assert_select "input[name=?]", "development[programs]"

      assert_select "input[name=?]", "development[forty_b]"

      assert_select "input[name=?]", "development[residential]"

      assert_select "input[name=?]", "development[commercial]"
    end
  end
end
