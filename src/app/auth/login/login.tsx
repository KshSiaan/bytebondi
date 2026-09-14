"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccessIcon,
  EyeClosedIcon,
  EyeIcon,
  Mail02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = form.watch("email");
  const password = form.watch("password");

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: data.email.split("@")[0],
        email: data.email,
        password: data.password,
        callbackURL: new URL("/files", window.location.origin).toString(),
      });

      if (error) {
        toast.error(error.message || "An error occurred during sign-up.");
        return;
      }

      toast.success("Sign-up successful! Please check your email.");
      window.location.href = "/files";
    } catch {
      toast.error("An error occurred during sign-up.");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = z.email().safeParse(email).success;
  const isValidPassword = z.string().min(6).safeParse(password).success;

  const showPasswordField = isValidEmail;
  const showButton = isValidEmail && isValidPassword;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        {/* Email */}
        <Field>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={Mail02Icon} />
            </InputGroupAddon>

            <InputGroupInput
              {...form.register("email")}
              placeholder="Enter your email..."
              type="email"
              autoComplete="email"
            />
          </InputGroup>
        </Field>

        {/* Password */}
        <Field
          className={cn(
            "transition-all duration-300",
            !showPasswordField && "hidden",
          )}
        >
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={AccessIcon} />
            </InputGroupAddon>

            <InputGroupInput
              {...form.register("password")}
              placeholder="Enter your password..."
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
            />

            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <HugeiconsIcon icon={showPassword ? EyeClosedIcon : EyeIcon} />
            </InputGroupAddon>
          </InputGroup>
        </Field>

        {/* Submit */}
        <Button
          type="submit"
          className={cn("mx-auto w-min px-6", !showButton && "hidden")}
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </Button>
      </FieldGroup>
    </form>
  );
}
