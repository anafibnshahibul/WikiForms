<?php

namespace App\Policies;

use App\Models\Form;

class FormPolicy
{
    /**
     * $user here is a plain username string (this app authenticates via
     * session/X-WF-Token resolved to a Wikipedia username, not an
     * Eloquent User model) — see resolveUser() in routes/api.php.
     */
    public function isOwner(?string $username, Form $form): bool
    {
        return $username !== null && $username !== '' && $username === $form->owner_username;
    }

    public function isCollaborator(?string $username, Form $form): bool
    {
        if ($username === null || $username === '') return false;
        return in_array($username, $form->collaborators_list, true);
    }

    /** Owner or collaborator can view full (owner-only) data — e.g. correct answers, responses. */
    public function view(?string $username, Form $form): bool
    {
        return $this->isOwner($username, $form) || $this->isCollaborator($username, $form);
    }

    /** Only owner or collaborator can edit/save changes to a form. */
    public function update(?string $username, Form $form): bool
    {
        return $this->isOwner($username, $form) || $this->isCollaborator($username, $form);
    }

    /** Only the owner can delete a form or manage collaborators. */
    public function delete(?string $username, Form $form): bool
    {
        return $this->isOwner($username, $form);
    }

    public function manageCollaborators(?string $username, Form $form): bool
    {
        return $this->isOwner($username, $form);
    }
}
