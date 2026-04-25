import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SHA256, enc } from 'crypto-js';

// Pre-computed hashed passwords - using SHA256 with hex encoding
const EDITOR_HASH = SHA256("VCadmin2025%").toString(enc.Hex);
const PUBLISHER_HASH = SHA256("webAdmin2025&").toString(enc.Hex);

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const hashedPassword = SHA256(password).toString(enc.Hex);
    
    if (hashedPassword === EDITOR_HASH || hashedPassword === PUBLISHER_HASH) {
      localStorage.setItem("adminAccess", "true");
      localStorage.setItem("accessLevel", hashedPassword === PUBLISHER_HASH ? "publisher" : "editor");
      // Store the password for checking Webadmin prefix
      localStorage.setItem("adminPassword", password);
      
      toast({
        title: "Login successful",
        description: `Logged in as ${hashedPassword === PUBLISHER_HASH ? "Publisher" : "Editor"}`,
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 100);
    } else {
      toast({
        title: "Authentication failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">
            Enter your password to access the program management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Checking..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
