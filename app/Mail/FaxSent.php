<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class FaxSent extends Mailable
{
    use Queueable, SerializesModels;
    protected $fax_num, $status, $last_name, $gender, $first_name, $government, $date, $gen_faxcode;
    /**
     * Create a new message instance.
     *
     * @return void
     */

    public function __construct($fax_num, $status, $last_name, $gender, $first_name, $government, $date, $gen_faxcode)
    {
        $this->fax_num = $fax_num;
        $this->status = $status;
        $this->last_name = $last_name;
        $this->gender = $gender;
        $this->first_name = $first_name;
        $this->government = $government;
        $this->date = $date;
        $this->gen_faxcode = $gen_faxcode;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if($this->status == "failure")
        {
            return $this->subject('De brief is niet succesvol verzonden.')
            ->view('faxfailed')
            ->with([
                'last_name' => $this->last_name,
                'first_name' => $this->first_name,
                'gender'    => $this->gender,
                'government'=> $this->government,
                'fax_num'    => $this->fax_num,
                'date'      => $this->date,
                'gen_faxcode' => $this->gen_faxcode,
            ]);
        }
        else
        {
            return $this->subject('De brief is succesvol verzonden.')
            ->view('faxsent')
            ->with([
                'last_name' => $this->last_name,
                'first_name' => $this->first_name,
                'gender'    => $this->gender,
                'government'=> $this->government,
                'fax_num'    => $this->fax_num,
                'date'      => $this->date,
                'gen_faxcode' => $this->gen_faxcode,
            ]);
        }
   }
}
