import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[9rem] sm:text-[12rem] font-bold text-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-8 bg-card rounded-full border shadow-lg">
              <Search className="w-16 h-16 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-15 sm:text-xl text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page may have been moved,
            deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>

        {/* Help Section */}
        <div className="pt-6 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>Need help? Check our</span>
              <Link to="/support" className="text-primary hover:underline">
                Support Center
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Or</span>
              <Link to="/contact" className="text-primary hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-8 bg-muted/30 border-dashed">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-mono">
                Dev Info: Current URL - {window.location.pathname}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
