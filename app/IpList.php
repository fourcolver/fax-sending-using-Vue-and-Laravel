<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class IpList extends Model
{
    protected $table = 'ip_list';
    protected $fillable = [
        'ip',
        'status'
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];
}
