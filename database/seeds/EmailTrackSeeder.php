<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmailTrackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('email_track')->delete();
        DB::table('email_track')->insert(
            array (
                0 => array (
                    'id' => 1,
                    'track_status' => '0',
                    'created_at' => DB::raw('CURRENT_TIMESTAMP'),
                    'updated_at' => DB::raw('CURRENT_TIMESTAMP')
                )
            )
        );
    }
}
