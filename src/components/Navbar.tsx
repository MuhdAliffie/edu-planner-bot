
import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 py-4 px-6 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-education-600" />
          <span className="text-xl font-semibold text-education-800">LessonGenius</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/generate">
            <Button variant="default" className="bg-education-600 hover:bg-education-700">
              Create Lesson Plan
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
