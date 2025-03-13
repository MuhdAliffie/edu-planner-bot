
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Clock, Calendar, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const features = [
  {
    title: 'Save Hours of Planning',
    description: 'Generate comprehensive lesson plans in seconds, not hours.',
    icon: Clock,
  },
  {
    title: 'Curriculum Aligned',
    description: 'All lesson plans can align with standard educational frameworks.',
    icon: BookOpen,
  },
  {
    title: 'Customizable Templates',
    description: 'Tailor each lesson plan to your specific classroom needs.',
    icon: Layers,
  },
  {
    title: 'Educational Best Practices',
    description: 'Incorporates modern teaching methodologies and best practices.',
    icon: GraduationCap,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-education-50 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-education-900 mb-6">
              Create Perfect Lesson Plans with AI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Save time and improve your teaching with our AI-powered lesson plan generator.
              Create detailed, engaging lesson plans for any subject in seconds.
            </p>
            <Link to="/generate">
              <Button size="lg" className="bg-education-600 hover:bg-education-700 text-white px-8 py-6 text-lg">
                Generate Your First Lesson Plan
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-education-800 mb-12">
              Why Use LessonGenius?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-education-50 rounded-full mb-4">
                        <feature.icon className="h-6 w-6 text-education-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-education-800">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-education-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-education-900 mb-6">
              Ready to Transform Your Lesson Planning?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of educators who save time and create better learning experiences.
            </p>
            <Link to="/generate">
              <Button size="lg" className="bg-education-600 hover:bg-education-700 text-white px-8">
                Start Creating Lesson Plans
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2023 LessonGenius. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
