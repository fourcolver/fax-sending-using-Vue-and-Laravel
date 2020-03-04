<?php

namespace App\Admin\Controllers;

use App\Government;
use App\Http\Controllers\Controller;
use App\IpList;
use App\Mail\Manual;
use App\ManualRequest;
use Encore\Admin\Controllers\Dashboard;
use Encore\Admin\Form;
use Encore\Admin\Layout\Column;
use Encore\Admin\Layout\Content;
use Encore\Admin\Layout\Row;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Widgets\Box;
use Encore\Admin\Widgets\InfoBox;
use App\Fax;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class HomeController extends Controller
{
    public function index()
    {
        return Admin::content(function (Content $content) {

            // optional
            $content->header('Faxes');

            // optional
            // $content->description('page description');

            // add breadcrumb since v1.5.7


            $content->row( function ( Row $row ) {


				$row->column( 4, function ( Column $column ) {
					$faxes   = Fax::count();
					$infoBox = new InfoBox( 'Faxes', 'fax', 'green', '/admin/fax', $faxes );
					$column->append( $infoBox->render() );
				} );
            } );

            $content->row(function (Row $row) {
                $row->column(12, function (Column $column) {
                    $faxes = Fax::get([ 'created_at', 'id'])->groupBy(function ( $date) {
                        return Carbon::parse($date->created_at)->format('m'); // grouping by years
                    })->all();
                    $y = [];
                    $x = [];
                    foreach ($faxes as $key => $value) {
                        $y[] = $value->count();
                        $x[] = date("F", mktime(0, 0, 0, intval($key) - 1, 10));
                    }

                    $column->append(view('vendor.charts.report', [
                        'x_axis' => json_encode($x),
                        'y_axis' => json_encode($y),
                        'label' => 'Faxes',
                        'type' => 'line',
                        'id' => 2,
                    ])->render());
                });
            });
        });
    }

    public function manualSubmit(Request $request){
        $request->validate([
            'app_type' => 'required',
            'app_data' => 'required',
            'request_date' => 'required',
            'letter_received' => 'required',
            "subject" => 'required',
            "municipality" => 'required',
            "gender" => 'required',
            "firstname" => 'required',
            "lastname" => 'required',
            "email" => 'required|email',
            "postcode" => 'required',
            "housenumber" => 'required',
            "telephone" => 'required|max:10',
            "banknumber" => 'required',
            "address" => 'required',
            "city" => 'required',
        ]);
        $requestDate = $request->get('request_date');
        $appType = $request->get('app_type');
        $appData = $request->get('app_data');
        $unit = 0;

        if($appType == 'Aanvraag') $unit = 7;
        else if($appType == 'Bezwaarschrift') $unit = 10;

        $requiredDiff = $unit * $appData;
        $today = \Carbon\Carbon::createFromFormat('Y-m-d', date("Y-m-d"));
        $selectedDate = \Carbon\Carbon::createFromFormat('Y-m-d', $requestDate);
        $diff_in_days = $today->diffInDays($selectedDate);
        if($diff_in_days <= $requiredDiff){
            return Redirect::back()->withInput($request->all())->withErrors(['request_date' => 'Day difference should be over ' . $requiredDiff]);
        }

        $manualRequest = new ManualRequest($request->except(['_token', '_previous_']));
        $manualRequest->uuid = Str::uuid();
        $manualRequest->save();

        $link = URL::to('/') . '/token/' . $manualRequest->uuid;
        \Mail::to($manualRequest->email)->send(new Manual($manualRequest->gender, $manualRequest->firstname, $manualRequest->lastname, $manualRequest->municipality, $link));
        admin_toastr('Email Sent!');
        return Redirect::back();
    }

    public function manual(){
        return Admin::content(function (Content $content) {
            Admin::script($this->script());
            $content
                ->header('Manual')
                ->description('description')
                ->body($this->form());
        });
    }

    protected function script(){
        return "$(document).ready(function () {
                    function getAddress() {
                        var postcode =  $('#postcode').val(); 
                        var houseNo = $('#housenumber').val();
                        if(postcode != '' && houseNo != ''){
                            $.ajax({
                              url: '/api/fax/post',
                              type: 'POST',
                              dataType:'json',
                              data : {postal : postcode, house: houseNo}
                            }).done(function ( data ) {
                                if(data.status == 1){
                                    $('#address').val(data.data.address);
                                    $('#city').val(data.data.city);
                                }
                            });
                        }
                    }
                    $('#postcode').change(function(){   
                        getAddress();
                    });
                    $('#housenumber').change(function(){   
                        getAddress();
                    });
                });";
    }

    protected function form()
    {
        $municipalities = DB::table('municipality')->pluck('name', 'name');
        $form = new Form(new ManualRequest());
        $form->setAction('/admin/manualSubmit');
        $form->disableViewCheck();
        $form->disableEditingCheck();
        $form->disableCreatingCheck();
        $form->select('app_type', 'App Type')->options(['Aanvraag' => 'Aanvraag', 'Bezwaarschrift' => 'Bezwaarschrift']);
        $form->select('app_data', 'App Data')->options(['1' => 'Option 1', '2' => 'Option 2', '3' => 'Option 3', '4' => 'Option 4' ]);
        $form->date('request_date', 'Request Date');
        $form->radio('letter_received', 'Letter Received')->options(['yes' => 'Ja', 'no' => 'Nee']);
        $form->text('subject', 'Subject');
        $form->select('municipality', 'Municipality')->options($municipalities);
        $form->divider();
        $form->radio('gender', 'Gender')->options(['meneer' => 'Meneer', 'mevrouw' => 'Mevrouw']);
        $form->text('firstname', 'FirstName');
        $form->text('lastname', 'LastName');
        $form->text('email', 'Email');
        $form->text('postcode', 'Postcode');
        $form->text('housenumber', 'House Number');
        $form->text('telephone', 'Telephone')->rules('min:3|max:10')->pattern('([0-9]{10}$)');
        $form->text('banknumber', 'Bank Number')->pattern('([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{4}[0-9]{10}$)');
        $form->text('address', 'Address');
        $form->text('city', 'City');
//        $form->divide();
//        $form->image('media', 'Sign Image Upload');
        return $form;
    }
}
