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
  LogIn,
  Eye,
  EyeOff,
  AlertTriangle,
  User,
  Lock,
  UserPlus,
} from "lucide-react";
import { loginUser, type LoginData } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({
  open,
  onOpenChange,
  onSuccess,
  onSwitchToRegister,
}: LoginModalProps) {
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setMessage({
        type: "error",
        text: "Please enter both username and password",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const result = loginUser(formData);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
          resetForm();
        }, 500);
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
      password: "",
    });
    setMessage(null);
    setShowPassword(false);
  };

  const isFormValid =
    formData.username.trim() !== "" && formData.password.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LogIn className="h-5 w-5 text-trading-primary" />
            <span>Welcome Back</span>
          </DialogTitle>
          <DialogDescription>
            Sign in to your TradeHub account to continue trading
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
              autoComplete="username"
            />
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
                autoComplete="current-password"
                className="pr-10"
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
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </Button>

          <Separator />

          {/* Switch to Register */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-trading-primary"
                onClick={onSwitchToRegister}
              >
                Create one here
              </Button>
            </p>
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-xs text-muted-foreground"
              onClick={() =>
                setMessage({
                  type: "error",
                  text: "Password reset not implemented in demo",
                })
              }
            >
              Forgot your password?
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
