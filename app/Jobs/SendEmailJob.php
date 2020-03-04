<?php

namespace App\Jobs;

use App\Mail\LetterSent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Fax;
use App\Customer;
use App\Mail\FaxSent;
use Illuminate\Support\Facades\DB;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $fax_id;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($fax_id)
    {
        $this->fax_id = $fax_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $fax = Fax::FindOrFail($this->fax_id);
        $mail = $fax->customer->email;
        $status = $fax->status;
        $first_name = $fax->customer->first_name;
        $last_name = $fax->customer->last_name;
        $gender = $fax->customer->gender;
        $date =  date('d-m-Y', strtotime($fax->updated_at));
        $gen_faxcode = $fax->gen_faxcode;
        $government = $fax->government->name;

        if($fax->type_id == 2){
            $postbode_status = $fax->postbode_status;
            $address = $fax->government->address . ', '. $fax->government->postal . ' ' . $fax->government->city;
            \Mail::to($mail)->send(new LetterSent($postbode_status, $last_name, $gender, $first_name, $government, $address, $date, $gen_faxcode));
        } else {
            $municipality = DB::table('municipality')->where('name', $government)->first();
            $fax_num = '';
            if( $municipality != null){
                $fax_num = $municipality->faxnumber;
            }

            \Mail::to($mail)->send(new FaxSent($fax_num, $status, $last_name, $gender, $first_name, $government, $date, $gen_faxcode));
        }



    }
}
