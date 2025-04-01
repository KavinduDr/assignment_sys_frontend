'use client'

import { useQuiz } from '@/context/QuizContext'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Card } from "../../components/ui/card";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CorrectAnswersPage = () => {
  const { quiz, setQuiz } = useQuiz();
  const { id } = useParams();
  const router = useRouter();

  interface QuizData {
    assignment: {
      title: string;
      questions: [
        {
          questionText: string;
          _id: string;
          options: [
            {
              text: string;
              isCorrect: boolean;
              _id: string;
            }
          ]
        }
      ]
    };
  }

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('id');
    let apiUrl;
    
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
        apiUrl = 'http://localhost:4000';
      } else {
        apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
      }
    }
    
    if (id) {
      setIsLoading(true);
      fetch(`${apiUrl}/api/v1/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setQuizData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching quiz data:', error);
          toast.error("Failed to load correct answers");
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleConfirm = () => {
    toast.success("Loading feedback...");
    router.push(`/feedback/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      {/* Decorative elements */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-20 left-1/4 w-56 h-56 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-md p-6 md:p-8 border-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
                <p className="text-gray-600">Loading correct answers...</p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-medium text-sm mb-4">
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Correct Answers
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {quizData?.assignment.title}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Review the correct answers for each question
                  </p>
                </div>

                <div className="space-y-6 mt-8">
                  {quizData?.assignment.questions.map((question, index) => (
                    <motion.div
                      key={question?._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-green-50 rounded-xl p-6"
                    >
                      <div className="flex items-start mb-3">
                        <div className="flex-shrink-0 bg-green-200 text-green-800 rounded-full h-7 w-7 flex items-center justify-center font-medium text-sm mr-3">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {question?.questionText}
                        </h3>
                      </div>
                      
                      <div className="ml-10">
                        {question?.options
                          .filter((option) => option.isCorrect)
                          .map((correctOption) => (
                            <div 
                              key={correctOption._id}
                              className="flex items-center bg-white border border-green-200 rounded-lg p-4 shadow-sm"
                            >
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-gray-800">
                                {correctOption.text}
                              </span>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center mt-10">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full max-w-xs"
                  >
                    <button
                      onClick={handleConfirm}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-md flex items-center justify-center transition-colors"
                    >
                      <span>View Feedback</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </motion.div>
                </div>
              </div>
            )}
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

export default CorrectAnswersPage;