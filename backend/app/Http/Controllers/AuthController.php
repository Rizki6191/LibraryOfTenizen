<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $rules = [
        'name' => 'required|string',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        'role' => 'required|string|in:admin,member',
        ];

        if ($request->role === 'member') {
            $rules['nis'] = 'required|string|unique:users,nis';
            $rules['major'] = 'required|string';
            $rules['grade'] = 'required|string';
        }

        $validated = $request->validate($rules);

        $user = new User();
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->password = Hash::make($validated['password']);
        $user->role = $validated['role'];
        $user->nis = $validated['nis'] ?? null;
        $user->major = $validated['major'] ?? null;
        $user->grade = $validated['grade'] ?? null;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil membuat akun!',
            'data' => $user,
        ]);
    }

    public function login(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('email', $validate['email'])->first();

        //nambahin validasi password
        if(!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Anda berhasil login',
            'data' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'berhasil logout',
        ]);
    }
}
