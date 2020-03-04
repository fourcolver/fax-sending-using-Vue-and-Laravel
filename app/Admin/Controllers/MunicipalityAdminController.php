<?php

namespace App\Admin\Controllers;

use App\EmailTrack;
use App\Http\Controllers\Controller;
use App\Municipality;
use Encore\Admin\Facades\Admin;
use Encore\Admin\Form;
use Encore\Admin\Layout\Column;
use Encore\Admin\Layout\Content;
use Encore\Admin\Layout\Row;
use Encore\Admin\Widgets\Box;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class MunicipalityAdminController extends Controller
{
    /**
     * Index interface.
     *
     * @param Content $content
     * @return Content
     */
    public function index(Content $content)
    {
        return $content
            ->header('Mail Track')
            ->description('description');
    }

    public function update(Request $request){
        if($request->has('track_status')){
            $emailTrack = EmailTrack::find(1);
            if($emailTrack != null){
                if($request->get('track_status') == '1'){
                    $municipalities = Municipality::where('email', 'regexp', '^[^@]+@[^@]+\.[^@]{2,}$')->get();
                    foreach ($municipalities as $municipality){
                        $municipality->email = $municipality->email . '.rpost.biz';
                        $municipality->timestamps = false;
                        $municipality->save();
                    }
                } else {
                    $municipalities = Municipality::where('email', 'regexp', '^[^@]+@[^@]+\.[^@]{2,}$')->get();
                    foreach ($municipalities as $municipality){
                        if(strpos($municipality->email, '.rpost.biz') !== false){
                            $municipality->email = str_replace('.rpost.biz', '', $municipality->email);
                        }
                        $municipality->timestamps = false;
                        $municipality->save();
                    }
                }
                $emailTrack->track_status = $request->get('track_status');
                $emailTrack->save();
                admin_toastr('Email track status updated!');
            }
            else{
                admin_error('Record does not exist!');
            }
        }
        else {
            admin_error('Invalid request');
        }
        return Redirect::back();
    }

    public function mailtrack()
    {
        return Admin::content(function (Content $content) {

            $content->header('Email Track')
                    ->description('description')
                    ->body($this->form());

//            $content->row( function ( Row $row ) {
//                $row->column( 12, function ( Column $column ) {
//                    $box = new Box('Email Track', $this->form());
//                    $column->append( $box );
//                } );
//            } );
        });
    }

    protected function form()
    {
        $emailTrack = EmailTrack::find(1);
        $form = new Form(new EmailTrack);
        $form->setTitle('Email Track');
        $form->disableReset();
        $form->disableViewCheck();
        $form->disableEditingCheck();
        $form->disableCreatingCheck();
        $form->setAction('/admin/track_update');
        $form->select('track_status', 'Track Status')->options(['0' => 'Disable', '1' => 'Enable'])->fill(['track_status' => $emailTrack->track_status]);
        return $form;
    }
}
