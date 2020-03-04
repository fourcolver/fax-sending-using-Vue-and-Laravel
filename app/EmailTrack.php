<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmailTrack extends Model
{
    protected $table = 'email_track';

    protected $fillable = [
        'track_status',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];
}
