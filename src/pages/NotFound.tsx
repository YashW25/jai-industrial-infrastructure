import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002d2a] via-[#004643] to-[#0a5f58] p-4">
      <Helmet>
        <title>Page Not Found | Jai Industrial Infrastructure</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="The page you are looking for does not exist. Return to Jai Industrial Infrastructure homepage." />
      </Helmet>
      <div className="text-center max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <Building2 className="h-16 w-16 text-white/30" />
        </div>
        <div className="text-9xl font-display font-bold text-white/20 mb-4">
          404
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-white/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/">
            <Button size="lg" className="bg-white text-[#004643] hover:bg-white/90 font-bold">
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}
            className="border-white/30 text-white hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
