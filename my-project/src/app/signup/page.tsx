"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchemaType, UserSignupSchema } from "@/validation/user";
import { Input } from "@/components/ui/input";
import { Eye, EyeSlash } from "phosphor-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    // setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSignupSchema),
    mode: "onBlur",
  });

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignup = async (signupData: UserSchemaType) => {
    setLoading(true);
    console.log(process.env.BACKEND_URL);
    const res: any = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      }
    );
    const resData = await res.json();
    if (!res.ok) {
      toast(resData.message);
    } else {
      router.push("login");
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} placeholder="Name" />
              {errors.name && (
                <p className="text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} placeholder="Email" />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye size={20} /> : <EyeSlash size={20} />}
                </button>

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register("password")}
                  className="pr-10"
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye size={20} /> : <EyeSlash size={20} />}
                </button>
                <Input
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <Button
          type="submit"
          onClick={() => {
            router.push("/login");
          }}
          className="mx-5"
        >
          login
        </Button>
      </Card>
    </div>
  );
}
