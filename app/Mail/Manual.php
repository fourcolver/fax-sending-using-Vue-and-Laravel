<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Manual extends Mailable
{
    use Queueable, SerializesModels;
    protected $gender, $first_name, $last_name, $government, $link;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct( $gender, $first_name, $last_name, $government, $link)
    {
        $this->gender = $gender;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->government = $government;
        $this->link = $link;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('De brief naar de gemeente staat')
            ->view('mail.manual')
            ->with([
                'last_name' => $this->last_name,
                'first_name' => $this->first_name,
                'gender'    => $this->gender,
                'government'=> $this->government,
                'link'    => $this->link
            ]);
    }
}
