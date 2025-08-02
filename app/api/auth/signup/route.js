import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectMongoDb } from "@/app/lib/mongodb";


export async function POST(req) {
  try {
    await connectMongoDb(); // Using your existing connection function
    const { firstName, lastName, email, password } = await req.json();
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Create new user according to your User model
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password, // The pre-save hook in your User model will handle hashing
      isEmailVerified: false,
      profileVisibility: 'public',
      activityVisibility: 'public',
      subscription: 'free'
    });

    return NextResponse.json(
      { 
        message: "User registered successfully",
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          profileVisibility: newUser.profileVisibility
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred while registering user" },
      { status: 500 }
    );
  }
}