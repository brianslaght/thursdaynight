<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public channel for presentation - anyone can listen
Broadcast::channel('presentation.{weekId}', function () {
    return true;
});
