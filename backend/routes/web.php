<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;
use App\Http\Controllers\WikiAuthController;

Route::get('/api/auth/mediawiki', [WikiAuthController::class, 'redirectToMediaWiki']);
Route::get('/api/auth/mediawiki/callback', [WikiAuthController::class, 'handleMediaWikiCallback']);

// Returns the currently logged-in user based on the Laravel session cookie.
// This is the ONLY trustworthy source of "who is making this request" -
// never trust a username sent in the request body.
Route::get('/api/me', function () {
    $user = Auth::user();
    if (!$user) {
        return response()->json(['authenticated' => false]);
    }
    return response()->json(['authenticated' => true, 'username' => $user->name]);
});

// Edit endpoint - owner or collaborator only.
// Identity comes from the session (Auth::user()), never from client input.
Route::post('/api/get-form-for-edit/{slug}', function ($slug) {
    $user = Auth::user();
    if (!$user) {
        return response()->json(['status' => 'error', 'message' => 'Not logged in'], 401);
    }

    $form = DB::table('forms')->where('slug', $slug)->first();
    if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found'], 404);

    $collaborators = json_decode($form->collaborators ?? '[]', true);
    $isOwner = $user->name === $form->owner_username;
    $isCollaborator = in_array($user->name, $collaborators);

    if (!$isOwner && !$isCollaborator) {
        return response()->json(['status' => 'error', 'message' => 'Permission denied'], 403);
    }

    try {
        $decrypted = Crypt::decryptString($form->questions);
        $questions = json_decode($decrypted, true);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Failed to decrypt form data'], 500);
    }

    return response()->json([
        'id'             => $form->slug,
        'contentType'    => $form->content_type ?? 'form',
        'title'          => $form->title,
        'description'    => $form->description,
        'cover_image'    => $form->cover_image,
        'questions'      => $questions,
        'owner_username' => $form->owner_username,
        'collaborators'  => $collaborators,
    ]);
});

// Add a collaborator - only the owner (verified via session) may do this.
Route::post('/api/add-collaborator', function (Request $request) {
    $user = Auth::user();
    if (!$user) return response()->json(['status' => 'error', 'message' => 'Not logged in'], 401);

    $v = $request->validate([
        'slug'             => 'required|string',
        'new_collaborator' => 'required|string',
    ]);

    $form = DB::table('forms')->where('slug', $v['slug'])->first();
    if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found'], 404);
    if ($form->owner_username !== $user->name) return response()->json(['status' => 'error', 'message' => 'Permission denied'], 403);

    $collaborators = json_decode($form->collaborators ?? '[]', true);
    if (!in_array($v['new_collaborator'], $collaborators)) $collaborators[] = $v['new_collaborator'];
    DB::table('forms')->where('slug', $v['slug'])->update(['collaborators' => json_encode($collaborators)]);

    return response()->json(['status' => 'success', 'collaborators' => $collaborators]);
});

// Remove a collaborator - only the owner (verified via session) may do this.
Route::post('/api/remove-collaborator', function (Request $request) {
    $user = Auth::user();
    if (!$user) return response()->json(['status' => 'error', 'message' => 'Not logged in'], 401);

    $v = $request->validate([
        'slug'         => 'required|string',
        'collaborator' => 'required|string',
    ]);

    $form = DB::table('forms')->where('slug', $v['slug'])->first();
    if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found'], 404);
    if ($form->owner_username !== $user->name) return response()->json(['status' => 'error', 'message' => 'Permission denied'], 403);

    $collaborators = array_values(array_filter(
        json_decode($form->collaborators ?? '[]', true),
        fn($c) => $c !== $v['collaborator']
    ));
    DB::table('forms')->where('slug', $v['slug'])->update(['collaborators' => json_encode($collaborators)]);

    return response()->json(['status' => 'success', 'collaborators' => $collaborators]);
});

Route::get('/', function () {
    return view('welcome');
});

Route::get('/view/{slug}', function () {
    return view('welcome');
});

Route::get('/create', function () {
    return view('welcome');
});
