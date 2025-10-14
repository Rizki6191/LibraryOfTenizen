<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private function isAdmin(Request $request)
    {
        $user = $request->user();
        return $user && $user->role === 'admin';
    }

    public function index(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['success'=>false,'message'=>'Akses ditolak, hanya admin'],403);
        }

        return response()->json(['success'=>true,'data'=>User::all()]);
    }

    public function store(Request $request)
    {
        // if (!$this->isAdmin($request)) {
        //     return response()->json(['success'=>false,'message'=>'Akses ditolak, hanya admin'],403);
        // }

        $validated = $request->validate([
            'name' => 'required|max:50',
            'nis' => 'nullable|unique:users,nis',
            'major' => 'required|in:BR,BD,MP,ML,AKL1,AKL2,RPL',
            'grade' => 'required|in:10,11,12',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|min:4',
            'role' => 'sometimes|in:admin,member',
        ]);

        $user = User::create($validated);

        return response()->json([
            'success'=> true,
            'message'=> 'Berhasil Menambahkan data user',
            'data'=> $user
        ], 201);
    }

    public function show(Request $request, User $user)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['success'=>false,'message'=>'Akses ditolak, hanya admin'],403);
        }

        return response()->json(['success'=>true,'data'=>$user]);
    }

    public function update(Request $request, User $user)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['success'=>false,'message'=>'Akses ditolak, hanya admin'],403);
        }

        $validated = $request->validate([
            'name' => 'nullable|max:50',
            'nis' => ['nullable', Rule::unique('users','nis')->ignore($user->id)],
            'major' => 'nullable|in:BR,BD,MP,ML,AKL1,AKL2,RPL',
            'grade' => 'nullable|in:10,11,12',
            'email' => ['nullable','email', Rule::unique('users','email')->ignore($user->id)],
            'password' => 'nullable|min:4',
            'role' => 'sometimes|in:admin,member',
        ]);

        if(isset($validated['password']) && $validated['password'] === null){
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success'=> true,
            'message'=> 'Berhasil mengubah data user',
            'data'=> $user
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['success'=>false,'message'=>'Akses ditolak, hanya admin'],403);
        }

        $user->delete();

        return response()->json([
            'success'=> true,
            'message'=> 'Berhasil menghapus data'
        ]);
    }
}
