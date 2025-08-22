import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth, type UserRole } from '@/hooks/useAuth'
import { toast } from 'sonner'

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('123456Aa')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('Manager')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          name,
          role,
          is_active: true
        })
        
        if (error) {
          toast.error(error.message)
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.')
        }
      } else {
        const { error } = await signIn(email, password)
        
        if (error) {
          toast.error(error.message)
        } else {
          toast.success('Successfully signed in!')
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Create a new account to get started' 
              : 'Enter your credentials to access your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Provider">Provider</SelectItem>
                      <SelectItem value="HR Manager">HR Manager</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading 
                ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
          
          {!isSignUp && (
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">Demo accounts (password: 123456Aa):</p>
              <div className="space-y-1">
                <p><strong>Super Admin:</strong> superadmin@olahealth.com</p>
                <p><strong>Provider:</strong> provider@olahealth.com</p>
                <p><strong>HR Manager:</strong> hr@olahealth.com</p>
                <p><strong>Admin:</strong> admin@olahealth.com</p>
                <p><strong>Provider-Admin:</strong> provideradmin@olahealth.com</p>
                <p><strong>Manager:</strong> manager@olahealth.com</p>
                <p><strong>Patient:</strong> patient@hilton.com</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}