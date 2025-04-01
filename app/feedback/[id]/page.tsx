'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Card } from "../../components/ui/card";
import { Loader2, MessageSquare, ThumbsUp, Send, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const FeedbackPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (feedback.trim()) {
      setIsSubmitting(true);
      
      // Simulate sending feedback
      setTimeout(() => {
        toast.success("Thank you for your feedback!");
        router.push('/completed');
      }, 1000);
    } else {
      toast.error("Please enter some feedback or click 'Skip'");
    }
  };
  
  const handleSkip = () => {
    toast.info("Moving to completed assignments");
    router.push('/completed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      {/* Decorative elements */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-20 left-1/4 w-56 h-56 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-md p-6 md:p-8 border-0">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-medium text-sm mb-4">
                <MessageSquare className="h-4 w-4 mr-1.5" />
                Share Your Thoughts
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Feedback
              </h1>
              <p className="text-gray-600 mt-2">
                Help us improve by sharing your experience
              </p>
            </div>
            
            <div className="mt-8">
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <ThumbsUp className="h-5 w-5 mr-2 text-green-600" />
                  Tell us about the quiz and marking
                </h2>
                
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What did you think of the questions? Was the difficulty level appropriate? Any suggestions for improvement?"
                  className="w-full h-48 p-4 rounded-xl border border-green-200 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50 bg-white resize-none"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full sm:w-auto"
                >
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-md flex items-center justify-center transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        <span>Submit Feedback</span>
                      </div>
                    )}
                  </button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full sm:w-auto"
                >
                  <button
                    onClick={handleSkip}
                    className="w-full sm:w-auto px-8 h-12 bg-white border border-green-300 hover:bg-green-50 text-green-700 rounded-xl font-medium shadow-sm flex items-center justify-center transition-colors"
                  >
                    <span>Skip</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Add some custom CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default FeedbackPage;