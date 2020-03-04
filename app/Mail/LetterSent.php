<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class LetterSent extends Mailable
{
    use Queueable, SerializesModels;
    protected $status, $last_name, $gender, $first_name, $government, $address, $date, $gen_faxcode;
    /**
     * Create a new message instance.
     *
     * @return void
     */

    public function __construct($status, $last_name, $gender, $first_name, $government, $address, $date, $gen_faxcode)
    {

        $this->status = $status;
        $this->last_name = $last_name;
        $this->gender = $gender;
        $this->first_name = $first_name;
        $this->government = $government;
        $this->address = $address;
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
        if($this->status == "sent")
        {
            return $this->subject('De brief is succesvol verzonden.')
            ->view('lettersent')
            ->with([
                'last_name' => $this->last_name,
                'first_name' => $this->first_name,
                'gender'    => $this->gender,
                'government'=> $this->government,
                'address'    => $this->address,
                'date'      => $this->date,
                'gen_faxcode' => $this->gen_faxcode,
            ]);
        }
        else
        {
            return $this->subject('De brief is niet succesvol verzonden.')
            ->view('letterfailed')
            ->with([
                'last_name' => $this->last_name,
                'first_name' => $this->first_name,
                'gender'    => $this->gender,
                'government'=> $this->government,
                'address'    => $this->address,
                'date'      => $this->date,
                'gen_faxcode' => $this->gen_faxcode,
            ]);
        }
   }
}
