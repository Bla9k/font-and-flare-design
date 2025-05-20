
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[80vh]">
        <h1 className="text-6xl md:text-8xl font-display font-bold text-anime-red glitch-text mb-6">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-display font-medium mb-8">
          Page Not Found
        </h2>
        
        <div className="max-w-md">
          <p className="text-gray-400 mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
        </div>

        <Link to="/">
          <Button className="bg-anime-red hover:bg-anime-red/80 text-white px-8">
            Return Home
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
