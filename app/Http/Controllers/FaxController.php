<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Fax;
use App\Government;
use App\Helpers\FaxApi;
use App\Helpers\Postal;
use App\Helpers\PostBode;
use App\IpList;
use App\Jobs\SendFax;
use App\ManualRequest;
use App\Subscription;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Session;
use App\Helpers\PdfGenerator;
use App\Mail\FaxSent;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\DB;

class FaxController extends Controller
{

    public function index()
    {
//        $fax = Fax::findOrFail('4');
//        $fax_pdf = $fax->gen_pdf;
//        $file = Storage::disk('admin')->get($fax_pdf);
//        $content = base64_encode($file);
//        // send the letter and receive output
//        $postbode_output = PostBode::SendLetter($fax_pdf, $content);
//        dd($postbode_output);
//        dd(Storage::disk('admin'));
//        PdfGenerator::generate('18', '18', '18');
//        $date = new \DateTime("now", new \DateTimeZone('Europe/Amsterdam') );
//        echo $date->format('d-m-Y, H:i');
//        dd(date('d-m-Y, H:i'));
        return view('index');
    }

    public function thanks()
    {

        return view('thank');
    }

    public function upload()
    {
        if ( !Session::has('first_name') ) {
            return redirect('../');
        } else
            return Response::view('upload')->header('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'customer_postal' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'gender' => 'required',
            'phone' => 'required',
            'home_num' => 'required',
            'customer_email' => 'required',
            'customer_address' => 'required',
            'customer_city' => 'required',
            'bank_account' => 'required',
            'name' => 'required',
            'department' => 'required',
            'email' => 'required',
            'fax' => 'required',
            'address' => 'required',
            'postal' => 'required',
            'city' => 'required',
            'date' => 'required',
            'letter_received' => 'required',
            'applied_for' => 'required',
        ]);

        $fax_number = $request->fax;
        if (strlen($fax_number) == 10) {
            $fax_number = substr($fax_number, 1);
            $fax_number = "31" . $fax_number;
        }

        Session::put([
            'customer_postal' => $request->customer_postal,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'gender' => $request->gender,
            'phone' => $request->phone,
            'home_num' => $request->home_num,
            'customer_email' => $request->customer_email,
            'customer_address' => $request->customer_address,
            'customer_city' => $request->customer_city,
            'notes' => $request->notes,
            'bank_account' => $request->bank_account,
            'name' => $request->name,
            'department' => $request->department,
            'email' => $request->email,
            'fax' => $fax_number,
            'address' => $request->address,
            'postal' => $request->postal,
            'city' => $request->city,
            'date' => $request->date,
            'letter_received' => $request->letter_received,
            'applied_for' => $request->applied_for,
        ]);

        return redirect('../upload');
    }

    public function signature( Request $request )
    {
        ini_set('memory_limit', '256M');
        $sigPresent = 0;
        $customer = new Customer();
        if ( $request->has('jsignature') && $request->filled('jsignature') ) {

            $jsignature = $request['jsignature'];
            $signature = base64_decode(str_replace("data:image/png;base64,", "", $jsignature));
            //gemerate signature file.
            $sign_file = (string) rand(1, 1000000) . ".png";
            //create it.
            Storage::disk('admin')->put($sign_file, $signature);
            session()->put([ 'customer_sign' => $sign_file ]);
            $customer->sign = session('customer_sign');
            $sigPresent = 1;
        }

        if ( $request->has('imgName') && $request->has('imgPath') ) {
            $customer->sign_name = $request['imgName'];
            $customer->sign_path = $request['imgPath'];
            if ( $sigPresent == 0 ) {
                $customer->sign_image = 1;
            }
        }

        $customer->first_name = session('first_name');
        $customer->last_name = session('last_name');
        $customer->gender = session('gender');
        //post
        $customer->postal = session('customer_postal');
        //home
        $customer->home_num = session('home_num');
        $customer->phone = session('phone');
        $customer->email = session('customer_email');
        $customer->address = session('customer_address');
        $customer->city = session('customer_city');
        $customer->notes = session('notes');
        $customer->bank_account = session('bank_account');

        $customer->save();

        $government = new Government();
        $government->name = session('name');
        $government->department = session('department');
        $government->email = session('email');
        $government->fax = session('fax');
        $government->address = session('address');
        $government->postal = session('postal');
        $government->city = session('city');
        $government->save();

        // create new fax
        $fax = new Fax();
        $fax->date = session('date');
        $fax->letter_received = session('letter_received');
        $fax->applied_for = session('applied_for');
        $fax->government_id = $government->id;
        $fax->customer_id = $customer->id;

        // set fax type
        if ( $government->fax == "Geen faxnummer bekend" ) {

            // set letter
            $fax->type_id = 2;
        } else {

            // set fax
            $fax->type_id = 1;
        }

        // save the fax
        $fax->save();

        $gen_faxcode = "IGB" . (string) $fax->id;
        $fax->gen_faxcode = $gen_faxcode;

        $fax->Save();

        session()->put([
            'gen_faxcode' => $gen_faxcode,
            'fax_id'      => $fax->id,
        ]);

        SendFax::dispatch($fax->id, $government->id, $customer->id, $customer->email);

        PdfGenerator::generate($fax->id, $government->id, $customer->id);

        return redirect('../thanks');
    }

    public function ValidatePostal( Request $request )
    {
        return Postal::Validate($request);

    }

    public function Polling()
    {
        $fax = Fax::FindOrFail(250);
        $mail = $fax->customer->email;
        $status = $fax->status;
        $first_name = $fax->customer->first_name;
        $last_name = $fax->customer->last_name;
        $gender = $fax->customer->gender;
        $report = $fax->new_trans;

        Mail::to($mail)->send(new FaxSent($status, $last_name, $gender, $first_name, $report));
    }


    public function processImage( Request $request )
    {

        if ( $file = $request->file('dzfile') ) {

            ini_set('memory_limit', '256M');

            $this->validate($request, [
                'dzfile' => 'required|mimes:jpeg,jpg,png|max:2000',
            ]);

            $name = time() . $file->getClientOriginalName();
            $path = public_path() . '/assets/signatures/' . $name;
            $file->move('assets/signatures/', $name);
            $img = Image::make($path)->greyscale()->contrast(50)->brightness(40);
            $img->save($path);
            $rt = new \stdClass();
            $rt->name = $name;
            $rt->path = $path;
            $rt->url = 'https://fax.beslisapp.nl/assets/signatures/' . $name;

            return response()->json($rt);
        } else {
            return "File Not Found";
        }
    }

    public function getToken($token){
        $request_ip = Request::ip();
        $ip = IpList::where('ip', '=', $request_ip)->first();
        if( $ip != null && $ip->status != 'allow'){
            if($ip->status == 'disallow') {
                $date = new \DateTime();
                $date->modify('-1 day');
                $formatted_date = $date->format('Y-m-d H:i:s');

                $count = Customer::where([['ip', '=', $request_ip], ['created_at', '>',$formatted_date]])->count();
                if($count > 2){
                    return response()->json([
                        "result" => "block",
                        "message" => "U heeft het systeem twee keer gebruikt.<br/>Als u meer procedures wilt starten kunt u een berichtje sturen naar support@beslisapp.nl."
                    ]);
                }
            }
            else if ($ip->status == 'block'){
                return response()->json([
                    "result" => "block",
                    "message" => "U heeft het systeem twee keer gebruikt.<br/>Als u meer procedures wilt starten kunt u een berichtje sturen naar support@beslisapp.nl."
                ]);
            }
        }
        $municipalities = DB::table('municipality')->get();
        $manualRequest = ManualRequest::where('uuid', '=', $token)->first();
        if($manualRequest == null){
            return response()->json([
                'status' => 'fail',
                'message' => 'Token is invalid.',
                'app_type' => Session::get('app_type'),
                'app_data' => Session::get('app_data'),
                'request_date' => Session::get('request_date'),
                'letter_received' => Session::get('letter_received'),
                'subject' => Session::get('subject'),
                'municipality' => Session::get('municipality'),
                'municipalities' => compact('municipalities'),
            ]);
        }
        else{
            $requestDate = Carbon::createFromFormat('Y-m-d', $manualRequest->request_date)->format('d-m-Y');
            Session::put([
                'app_type' => $manualRequest->app_type,
                'app_data' => $manualRequest->app_data,
                'request_date' => $requestDate,
                'letter_received' => $manualRequest->letter_received,
                'subject' => $manualRequest->subject,
                'municipality' => $manualRequest->municipality,
                'gender' => $manualRequest->gender,
                'firstname' => $manualRequest->firstname,
                'lastname' => $manualRequest->lastname,
                'postcode' => $manualRequest->postcode,
                'housenumber' => $manualRequest->housenumber,
                'telephone' => $manualRequest->telephone,
                'banknumber' => $manualRequest->banknumber,
                'email' => $manualRequest->email,
                'address' => $manualRequest->address,
                'city' => $manualRequest->city,
                'manualToken' => $token
            ]);
            return response()->json([
                'status' => 'success',
                'app_type' => Session::get('app_type'),
                'app_data' => Session::get('app_data'),
                'request_date' => Session::get('request_date'),
                'letter_received' => Session::get('letter_received'),
                'subject' => Session::get('subject'),
                'municipality' => Session::get('municipality'),
                'municipalities' => compact('municipalities'),
            ]);
        }
    }

    public function getGeneral()
    {
        $request_ip = request()->ip();
        $ip = IpList::where('ip', '=', $request_ip)->first();
        if( $ip != null && $ip->status != 'allow'){
            if($ip->status == 'disallow') {
                $date = new \DateTime();
                $date->modify('-1 day');
                $formatted_date = $date->format('Y-m-d H:i:s');

                $count = Customer::where([['ip', '=', $request_ip], ['created_at', '>',$formatted_date]])->count();
                if($count > 2){
                    return response()->json([
                        "result" => "block",
                        "message" => "U heeft het systeem twee keer gebruikt.<br/>Als u meer procedures wilt starten kunt u een berichtje sturen naar support@beslisapp.nl."
                    ]);
                }
            }
            else if ($ip->status == 'block'){
                return response()->json([
                    "result" => "block",
                    "message" => "U heeft het systeem twee keer gebruikt.<br/>Als u meer procedures wilt starten kunt u een berichtje sturen naar support@beslisapp.nl."
                ]);
            }
        }
        $municipalities = DB::table('municipality')->get();
        return response()->json([
            'app_type' => Session::get('app_type'),
            'app_data' => Session::get('app_data'),
            'request_date' => Session::get('request_date'),
            'letter_received' => Session::get('letter_received'),
            'subject' => Session::get('subject'),
            'municipality' => Session::get('municipality'),
            'municipalities' => compact('municipalities'),
        ]);
    }

    public function saveGeneral(Request $request)
    {
        Session::put([
            'app_type' => $request->app_type,
            'app_data' => $request->app_data,
            'request_date' => $request->request_date,
            'letter_received' => $request->letter_received,
            'subject' => $request->subject,
            'feature' => $request->feature,
            'municipality' => $request->municipality,
        ]);
        return response()->json([
            "result" => "success",
            "message" => "Saved successfully"
        ]);
    }

    public function saveNotifyEmail(Request $request)
    {
        $email_exist =Subscription::where('email', $request->get('notify_email'))->first();
        if($email_exist == null){
            $subscription = new Subscription();
            $subscription->email = $request->get('notify_email');
            $subscription->days = $request->get('days');
            $subscription->save();
            return response()->json([
                "result" => "success",
                "message" => "Uw mailadres is succesvol opgeslagen. U ontvangt een herinnering per mail."
            ]);
        }
        else{
            return response()->json([
                "result" => "fail",
                "message" => "Ons systeem heeft al een herinnering / notificatie geregistreerd. Zodra u deze herinnering heeft ontvangen kunt u een nieuwe herinnering registreren."
            ]);
        }


    }
    public function getClient()
    {
        return response()->json([
            'gender' => Session::get('gender'),
            'firstname' => Session::get('firstname'),
            'lastname' => Session::get('lastname'),
            'postcode' => Session::get('postcode'),
            'housenumber' => Session::get('housenumber'),
            'telephone' => Session::get('telephone'),
            'banknumber' => Session::get('banknumber'),
            'email' => Session::get('email'),
            'address' => Session::get('address'),
            'city' => Session::get('city'),
        ]);
    }

    public function saveClient(Request $request)
    {
        $ip = IpList::where('ip', '=', $request->ip())->first();
        if( $ip != null && $ip->status != 'allow'){
            if($ip->status == 'disallow') {
                $date = new \DateTime();
                $date->modify('-1 day');
                $formatted_date = $date->format('Y-m-d H:i:s');

                $count = Customer::where([['ip', '=', $request->ip()], ['created_at', '>',$formatted_date]])->count();
                if($count > 2){
                    return response()->json([
                        "result" => "fail",
                        "message" => "U heeft het systeem twee keer gebruikt.<br/>Als u meer procedures wilt starten kunt u een berichtje sturen naar support@beslisapp.nl."
                    ]);
                }
            }
            else if ($ip->status == 'block'){
                return response()->json([
                    "result" => "fail",
                    "message" => "U heeft het systeem twee keer gebruikt.<br/>Als u meer procedures wilt starten kunt u een berichtje sturen naar support@beslisapp.nl."
                ]);
            }
        }

        Session::put([
            'gender' => $request->gender,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'postcode' => $request->postcode,
            'housenumber' => $request->housenumber,
            'telephone' => $request->telephone,
            'banknumber' => $request->banknumber,
            'email' => $request->email,
            'address' => $request->address,
            'city' => $request->city,
        ]);

        return response()->json([
            "result" => "success",
            "message" => "Saved successfully"
        ]);
    }

    public function publish(Request $request)
    {
        if(Session::get('app_type') == '' || Session::get('gender') == '' ){
            return response()->json([
                "result" => "fail",
                "message" => "You need to fill all information"
            ]);
        }
//        $ip = IpList::where('ip', '=', $request->ip())->first();
//        if( $ip != null){
//            if($ip->status == 'block'){
//                return response()->json([
//                    "result" => "fail",
//                    "message" => "Your IP address was blocked."
//                ]);
//            }
//            else if($ip->status == 'disallow'){
//                $date = new \DateTime();
//                $date->modify('-1 day');
//                $formatted_date = $date->format('Y-m-d H:i:s');
//                $count = Customer::where([['ip', '=', $request->ip()], ['created_at', '>',$formatted_date]])->count();
//                if($count > 2) {
//                    return response()->json([
//                        "result" => "fail",
//                        "message" => "Your IP address was disallowed."
//                    ]);
//                }
//            }
//        }

        $sigPresent = 0;
        $customer = new Customer();
        if($request->mode == 1){
            if ( $request->has('sign') && $request->filled('sign') ) {
                $jsignature = $request['sign'];
                $signature = base64_decode(str_replace("data:image/png;base64,", "", $jsignature));
                $sign_file = (string) rand(1, 1000000) . ".png";
                Storage::disk('admin')->put($sign_file, $signature);
                session()->put([ 'customer_sign' => $sign_file ]);
                $customer->sign = session('customer_sign');
                $sigPresent = 1;
            }
        } else if($request->mode == 2){
            if ( $file = $request->file('media') ) {
                $extension = $file->getClientOriginalExtension();
                $name = time() . $file->getClientOriginalName();
                $path = public_path() . '/assets/signatures/' . $name;
                $file->move('assets/signatures/', $name);
                $img = Image::make($path)->greyscale()->contrast(50)->brightness(40);
                $img->save($path);
                $rt = new \stdClass();
                $rt->name = $name;
                $rt->path = $path;
                $rt->url = 'https://fax.beslisapp.nl/assets/signatures/' . $name;

                // $customer->sign_name = $request['imgName'];
                // $customer->sign_path = $request['imgPath'];
                $customer->sign_name = $name;
                $customer->sign_path = $path;
                if ( $sigPresent == 0 ) {
                    $customer->sign_image = 1;
                }
            }
        }
        $customer->first_name = session('firstname');
        $customer->last_name = session('lastname');
        $customer->gender = session('gender');
        $customer->postal = session('postcode');
        $customer->home_num = session('housenumber');
        $customer->phone = session('telephone');
        $customer->email = session('email');
        $customer->address = session('address');
        $customer->city = session('city');
        $customer->notes = session('notes');
        $customer->bank_account = session('banknumber');
        $customer->ip = $request->ip();
        $customer->save();

        $government = new Government();
        if(Session::has('municipality'))
        {
            $municipality = DB::table('municipality')->where('name', Session::get('municipality'))->first();
            $address = $municipality->address;
            $email = $municipality->email;
            $postal = $municipality->postal;
            $city = $municipality->city;
            $department = $municipality->department;

            $fax_number = $municipality->faxnumber;
            if (strlen($fax_number) == 10) {
                $fax_number = substr($fax_number, 1);
                $fax_number = "31" . $fax_number;
            }
            $government->name = $municipality->name;
            $government->department = "Burgemeester en wethouders";
            $government->email = $municipality->email;
            $government->fax = $fax_number;
            $government->address = $municipality->address;
            $government->postal = $municipality->postal;
            $government->city = $municipality->city;
            $government->save();
        }

        $fax = new Fax();
        $fax->date = session('request_date');
        $fax->letter_received = session('letter_received');
        $fax->subject = session('subject');
        $fax->applied_for = session('app_type');
        $fax->government_id = $government->id;
        $fax->customer_id = $customer->id;

        // set fax type
        if ( $government->fax == "Geen faxnummer bekend" ) {
            // set letter
            $fax->type_id = 2;
        } else {
            // set fax
            $fax->type_id = 1;
        }
        $fax->save();

        $gen_faxcode = "IGB" . (string) $fax->id;
        $fax->gen_faxcode = $gen_faxcode;

        $fax->Save();

        session()->put([
            'gen_faxcode' => $gen_faxcode,
            'fax_id'      => $fax->id,
        ]);

        SendFax::dispatch($fax->id, $government->id, $customer->id, $customer->email);

        PdfGenerator::generate($fax->id, $government->id, $customer->id);

        // clear all session
        Session::forget('app_type');
        Session::forget('app_data');
        Session::forget('request_date');
        Session::forget('letter_received');
        Session::forget('subject');
        Session::forget('feature');
        Session::forget('municipality');
        Session::forget('gender');
        Session::forget('firstname');
        Session::forget('lastname');
        Session::forget('postcode');
        Session::forget('housenumber');
        Session::forget('telephone');
        Session::forget('banknumber');
        Session::forget('email');
        Session::forget('address');
        Session::forget('city');

        if(session()->has('manualToken')){
            $manualRequest = ManualRequest::where('uuid', '=', session()->get('manualToken'))->first();
            if($manualRequest != null){
                $manualRequest->delete();
            }
            session()->forget('manualToken');
        }

        $ip = IpList::where('ip', '=', $request->ip())->first();
        if( $ip == null){
            $ip = new IpList();
            $ip->ip = $request->ip();
            $ip->status = 'disallow';
            $ip->save();
        }

        return response()->json([
            "result" => "success",
            "message" => "custommer Saved successfully"
        ]);
    }

    public function testFunc(){
        $var = 5;
        return view('test', [
            'var' => $var
        ]);
    }

    public function uploadSign(Request $request){
        if ( $file = $request->file('media') ) {
            $extension = $file->getClientOriginalExtension();
            $name = time() . $file->getClientOriginalName();
            $path = public_path() . '/assets/signatures/' . $name;
            $file->move('assets/signatures/', $name);
            $img = Image::make($path)->greyscale()->contrast(50)->brightness(40);
            $img->save($path);
            $rt = new \stdClass();
            $rt->name = $name;
            $rt->path = $path;
            $rt->url = 'https://fax.beslisapp.nl/assets/signatures/' . $name;
            return response()->json($rt);
        }
    }
}
