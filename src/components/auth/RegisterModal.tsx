import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  User,
  Mail,
  Lock,
} from "lucide-react";
import {
  registerUser,
  isUsernameAvailable,
  isEmailAvailable,
  type RegisterData,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({
  open,
  onOpenChange,
  onSuccess,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Real-time validation
  const validateField = (field: keyof RegisterData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "username":
        if (value.length < 3) {
          newErrors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username =
            "Username can only contain letters, numbers, and underscores";
        } else if (!isUsernameAvailable(value)) {
          newErrors.username = "Username is already taken";
        } else {
          delete newErrors.username;
        }
        break;
      case "displayName":
        if (value.length < 2) {
          newErrors.displayName = "Display name must be at least 2 characters";
        } else {
          delete newErrors.displayName;
        }
        break;
      case "email":
        if (!value.includes("@") || !value.includes(".")) {
          newErrors.email = "Please enter a valid email address";
        } else if (!isEmailAvailable(value)) {
          newErrors.email = "Email is already registered";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        } else {
          delete newErrors.password;
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      validateField(
        key as keyof RegisterData,
        formData[key as keyof RegisterData],
      );
    });

    if (Object.keys(errors).length > 0) {
      setMessage({ type: "error", text: "Please fix the errors above" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = registerUser(formData);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
          resetForm();
        }, 1000);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(formData).every((value) => value.trim() !== "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-trading-primary" />
            <span>Create Account</span>
          </DialogTitle>
          <DialogDescription>
            Join TradeHub and start trading with other players
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Username</span>
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={cn(errors.username && "border-destructive")}
            />
            {errors.username && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.username}</span>
              </p>
            )}
            {formData.username && !errors.username && (
              <p className="text-sm text-trading-success flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Username is available globally</span>
              </p>
            )}
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Enter your display name"
              value={formData.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              className={cn(errors.displayName && "border-destructive")}
            />
            {errors.displayName && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.displayName}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={cn(errors.password && "border-destructive", "pr-10")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={cn(
                  errors.confirmPassword && "border-destructive",
                  "pr-10",
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <Alert
              className={
                message.type === "error"
                  ? "border-destructive"
                  : "border-trading-success"
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-trading-gradient hover:opacity-90"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </>
            )}
          </Button>

          <Separator />

          {/* Switch to Login */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-trading-primary"
                onClick={onSwitchToLogin}
              >
                Sign in here
              </Button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
