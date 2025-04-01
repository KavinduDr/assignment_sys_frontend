'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { Card } from "../../components/ui/card";
import { Loader2, Award, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ScorePage: React.FC = () => {
    const router = useRouter();
    const id_temp = localStorage.getItem('id');

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

    interface EssayData {
        essayAssignment: {
            title: string;
            _id: string;
            questions: [
                {
                    questionText: string;
                    _id: string;
                    answer: string;
                }
            ]
        }
    }

    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [length, setLength] = useState<number | null>(null);
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const { setEssay } = useEssay();
    const { setQuiz } = useQuiz();
    const [isLoading, setIsLoading] = useState(true);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isEssay, setIsEssay] = useState(false);
    const [score, setScore] = useState(sessionStorage.getItem('score') || '0');

    useEffect(() => {
        let apiUrl;
        if (typeof window !== 'undefined') {
            apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
        }

        if (id_temp) {
            setIsLoading(true);
            
            // Fetch quiz data
            fetch(`${apiUrl}/api/v1/${id_temp}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.assignment) {
                        setQuizData(data);
                        setQuiz(data);
                        setIsQuiz(true);
                        setLength(data.assignment.questions.length);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching quiz data:', error);
                    setIsLoading(false);
                });

            // Fetch essay data
            fetch(`${apiUrl}/api/v1/essay/${id_temp}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.essayAssignment) {
                        setEssayData(data);
                        setEssay(data);
                        setIsEssay(true);
                        setLength(data.essayAssignment.questions.length);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching essay data:', error);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [id_temp, setQuiz, setEssay]);

    const handleConfirm = () => {
        if (isQuiz) {
            toast.success("Loading correct answers...");
            router.push(`/correct_answers/${id_temp}`);
        } else {
            toast.success("Loading feedback...");
            router.push(`/feedback/${id_temp}`);
        }
    };

    // Calculate percentage if possible
    const calculatePercentage = () => {
        if (!score || !length) return null;
        
        const numericalScore = parseFloat(score);
        if (isNaN(numericalScore)) return null;
        
        const percentage = Math.round((numericalScore / length) * 100);
        return percentage;
    };

    const percentage = calculatePercentage();
    
    // Determine message based on percentage
    const getMessage = () => {
        if (percentage === null) return "Thank you for completing the assessment!";
        
        if (percentage >= 90) return "Excellent work! Outstanding performance!";
        if (percentage >= 80) return "Great job! Very well done!";
        if (percentage >= 70) return "Good work! You've done well!";
        if (percentage >= 60) return "Nice effort! Keep it up!";
        return "Thanks for completing the assessment!";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
            {/* Decorative elements */}
            <div className="fixed top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="fixed top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="fixed bottom-20 left-1/4 w-56 h-56 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl relative z-10"
            >
                <Card className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-md p-8 border-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
                            <p className="text-gray-600">Loading results...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="mb-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ 
                                        duration: 0.6,
                                        delay: 0.2,
                                        type: "spring",
                                        stiffness: 200
                                    }}
                                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <Award className="h-14 w-14 text-green-600" />
                                </motion.div>
                            </div>
                            
                            <div className="text-center mb-4">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    {isQuiz ? "Quiz Completed!" : "Assignment Submitted!"}
                                </h1>
                                <p className="text-gray-600">
                                    {getMessage()}
                                </p>
                            </div>
                            
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="w-full max-w-xs bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 mb-6 shadow-inner"
                            >
                                <div className="text-center">
                                    <p className="text-sm text-green-700 font-medium mb-1">Your Score</p>
                                    <div className="flex items-center justify-center">
                                        <span className="text-5xl font-bold text-green-600">{score}</span>
                                        {length && (
                                            <span className="text-xl font-medium text-green-600 ml-1 mt-3">/{length}</span>
                                        )}
                                    </div>
                                    
                                    {percentage !== null && (
                                        <div className="mt-3">
                                            <div className="w-full bg-white rounded-full h-2.5 mb-1">
                                                <div 
                                                    className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" 
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-green-700">{percentage}% Correct</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                            
                            <div className="mb-6">
                                <Image 
                                    src="/score.jpg" 
                                    alt="Score illustration" 
                                    width={200} 
                                    height={200}
                                    className="rounded-xl shadow-md"
                                />
                            </div>
                            
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full max-w-xs"
                            >
                                <button
                                    onClick={handleConfirm}
                                    className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-md flex items-center justify-center transition-colors"
                                >
                                    <span>{isQuiz ? "View Correct Answers" : "View Feedback"}</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </motion.div>
                        </div>
                    )}
                </Card>
            </motion.div>
            
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
};

export default ScorePage;