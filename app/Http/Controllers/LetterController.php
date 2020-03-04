<?php

namespace App\Http\Controllers;

use App\Fax;
use App\Jobs\SendEmailJob;
use Illuminate\Http\Request;

class LetterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function webhook(Request $request)
    {
		$postbode_webhook = $request->json()->all();

        // guard
        if (!$fax = Fax::where(['type_id' => 2, 'postbode_id' => $postbode_webhook['letter']['id']])->first()) {
            return abort(404);
        }

        // set status
        $fax->postbode_status = $postbode_webhook['letter']['status'];

        // save
        $fax->save();

        // if satus is send, send our mails
        if ($fax->postbode_status == 'sent' || $fax->postbode_status == 'cancelled' || $fax->postbode_status == 'undeliverable' ) {
            // send email
            SendEmailJob::dispatch($fax->id);
        }

    }
}

// example response
// {
//     "id": 1,
//     "mailbox_id": 15,
//     "envelope_id": 2,
//     "shipping_method_id": 23,
//     "service": "send",
//     "status": "concept", // "in progress" "printing" "sent" "undeliverable" "sandbox" "cancelled"
//     "color": "full color",
//     "printing": "simplex",
//     "paper_weight": "80g",
//     "paper_size": "A4",
//     "tracking_code": null, //T&T code
//     "formatted_id": "PB10188981",
//     "shipping_id": 23,
//     "weight": 13,
//     "pages": 1,
//     "sheets": 1
// }
