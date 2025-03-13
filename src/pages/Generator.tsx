
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { LessonPlanParams, LessonPlanResponse, generateLessonPlan } from '@/lib/openai';
import Navbar from '@/components/Navbar';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  gradeLevel: z.string().min(1, { message: "Please select a grade level." }),
  duration: z.string().min(1, { message: "Please select a duration." }),
  learningObjectives: z.string().min(10, { message: "Learning objectives must be at least 10 characters." }),
  additionalInstructions: z.string().optional(),
});

const Generator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlanResponse | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      gradeLevel: "",
      duration: "",
      learningObjectives: "",
      additionalInstructions: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    try {
      const params: LessonPlanParams = {
        subject: values.subject,
        gradeLevel: values.gradeLevel,
        duration: values.duration,
        learningObjectives: values.learningObjectives,
        additionalInstructions: values.additionalInstructions,
      };
      
      const result = await generateLessonPlan(params);
      setLessonPlan(result);
      toast({
        title: "Lesson plan generated successfully!",
        description: "Scroll down to view your lesson plan.",
      });
    } catch (error) {
      toast({
        title: "Error generating lesson plan",
        description: "Please try again or check your inputs.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!lessonPlan) return;

    // Format the lesson plan as text
    const planText = `
# ${lessonPlan.title}

## Overview
${lessonPlan.overview}

## Learning Objectives
${lessonPlan.objectives.map(obj => `- ${obj}`).join('\n')}

## Materials Needed
${lessonPlan.materials.map(mat => `- ${mat}`).join('\n')}

## Procedure

### Introduction
${lessonPlan.procedure.introduction}

### Main Activity
${lessonPlan.procedure.mainActivity}

### Conclusion
${lessonPlan.procedure.conclusion}

## Assessment
${lessonPlan.assessment}

## Extensions/Homework
${lessonPlan.extensions.map(ext => `- ${ext}`).join('\n')}

## Teacher Notes
${lessonPlan.notes}
    `;

    // Create a blob and download it
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Lesson plan exported!",
      description: "Your lesson plan has been downloaded as a text file.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-education-800 mb-6">Create Your Lesson Plan</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Mathematics, Science, History" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gradeLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="K-2">K-2 (Ages 5-7)</SelectItem>
                                <SelectItem value="3-5">3-5 (Ages 8-10)</SelectItem>
                                <SelectItem value="6-8">6-8 (Ages 11-13)</SelectItem>
                                <SelectItem value="9-10">9-10 (Ages 14-15)</SelectItem>
                                <SelectItem value="11-12">11-12 (Ages 16-18)</SelectItem>
                                <SelectItem value="college">College</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lesson Duration</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="30 minutes">30 minutes</SelectItem>
                                <SelectItem value="45 minutes">45 minutes</SelectItem>
                                <SelectItem value="60 minutes">60 minutes</SelectItem>
                                <SelectItem value="90 minutes">90 minutes</SelectItem>
                                <SelectItem value="2 hours">2 hours</SelectItem>
                                <SelectItem value="multiple days">Multiple days</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="learningObjectives"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Objectives</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What should students learn by the end of this lesson?"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any specific requirements, teaching approaches, or student needs?"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-education-600 hover:bg-education-700"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : "Generate Lesson Plan"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Result Section */}
          <div>
            {lessonPlan ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-education-800">{lessonPlan.title}</h2>
                  <Button 
                    onClick={handleExport} 
                    variant="outline"
                    className="text-education-700 border-education-300 hover:bg-education-50"
                  >
                    Export
                  </Button>
                </div>
                
                <div className="prose max-w-none">
                  <div className="lesson-plan-container">
                    <h3 className="section-title">Overview</h3>
                    <p className="mb-4">{lessonPlan.overview}</p>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="section-title">Learning Objectives</h3>
                    <ul className="list-disc pl-5 mb-4">
                      {lessonPlan.objectives.map((objective, i) => (
                        <li key={i} className="mb-1">{objective}</li>
                      ))}
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="section-title">Materials Needed</h3>
                    <ul className="list-disc pl-5 mb-4">
                      {lessonPlan.materials.map((material, i) => (
                        <li key={i}>{material}</li>
                      ))}
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="section-title">Procedure</h3>
                    <div className="mb-2">
                      <h4 className="font-semibold text-education-600">Introduction</h4>
                      <p className="mb-3">{lessonPlan.procedure.introduction}</p>
                    </div>
                    <div className="mb-2">
                      <h4 className="font-semibold text-education-600">Main Activity</h4>
                      <p className="mb-3">{lessonPlan.procedure.mainActivity}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-education-600">Conclusion</h4>
                      <p>{lessonPlan.procedure.conclusion}</p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="section-title">Assessment</h3>
                    <p className="mb-4">{lessonPlan.assessment}</p>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="section-title">Extensions/Homework</h3>
                    <ul className="list-disc pl-5 mb-4">
                      {lessonPlan.extensions.map((extension, i) => (
                        <li key={i}>{extension}</li>
                      ))}
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="section-title">Teacher Notes</h3>
                    <p>{lessonPlan.notes}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-education-50 rounded-lg p-8 flex flex-col items-center justify-center h-full text-center">
                <div className="text-education-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-education-800 mb-2">
                  Your lesson plan will appear here
                </h3>
                <p className="text-gray-600 max-w-md">
                  Fill out the form with your lesson details and click "Generate Lesson Plan" to create your AI-generated lesson plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generator;
