<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateManualRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('manual_requests', function (Blueprint $table) {
            $table->increments('id');
            $table->string('uuid');
            $table->string('app_type');
            $table->smallInteger('app_data');
            $table->string('request_date');
            $table->string('letter_received');
            $table->string('subject');
            $table->string('municipality');
            $table->string('gender');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('postcode');
            $table->string('housenumber');
            $table->string('telephone');
            $table->string('email');
            $table->string('banknumber');
            $table->string('address');
            $table->string('city');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('manual_requests');
    }
}
