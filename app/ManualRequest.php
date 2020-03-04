<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ManualRequest extends Model
{
    protected $table = 'manual_requests';
    protected $fillable = [
        'uuid',
        'app_type',
        'app_data',
        'request_date',
        'letter_received',
        "subject",
        "municipality",
        'gender',
        "firstname",
        "lastname",
        "email",
        "postcode",
        "housenumber",
        "telephone",
        "banknumber",
        "address",
        "city",
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function government()
    {
        return $this->belongsTo(Government::class, 'municipality');
    }
}
