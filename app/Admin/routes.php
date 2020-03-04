<?php

use Illuminate\Routing\Router;

Admin::registerAuthRoutes();

Route::group([
    'prefix'        => config('admin.route.prefix'),
    'namespace'     => config('admin.route.namespace'),
    'middleware'    => config('admin.route.middleware'),
], function (Router $router) {

    $router->get('/', 'HomeController@index');
    $router->get('/manual', 'HomeController@manual');
    $router->post('/manualSubmit', 'HomeController@manualSubmit');
    $router->resources([ 'fax' => 'FaxAdminController']);
    $router->resources([ 'customer' => 'CustomerAdminController']);
    $router->resources([ 'government' => 'GovernmentAdminController']);
    $router->resources([ 'iplist' => 'IpListAdminController']);
    $router->get('/mailtrack','MunicipalityAdminController@mailtrack');
    $router->post('/track_update', 'MunicipalityAdminController@update');
});
