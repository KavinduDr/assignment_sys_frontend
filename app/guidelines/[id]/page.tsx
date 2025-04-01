'use client';

import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { toast } from "sonner";
import { Card } from "../../components/ui/card";
import { Loader2, CheckCircle, Timer, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface QuizData {
    id: string;
    assignment: {
        title: string;
        guidelines: string[];
        timeLimit?: number;
        questions: {};
    };
}

interface EssayData {
    id: string;
    essayAssignment: {
        title: string;
        guidelines: string[];
        timeLimit?: number;
        questions: {};
    };
}

const Guidelines: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { setQuiz } = useQuiz();
    const { setEssay } = useEssay();

    useEffect(() => {
        let apiUrl;
        // Determine the correct API URL based on the hostname
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                apiUrl = 'http://localhost:4000';
            } else {
                apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
            }
        }
        
        const fetchData = async () => {
            setIsLoading(true);
            
            if (id) {
                try {
                    // Fetch quiz data
                    const quizResponse = await fetch(`${apiUrl}/api/v1/${id}`);
                    const quizData = await quizResponse.json();
                    
                    if (quizData.assignment) {
                        setQuizData(quizData);
                        setQuiz(quizData);
                    }
                    
                    // Fetch essay data
                    const essayResponse = await fetch(`${apiUrl}/api/v1/essay/${id}`);
                    const essayData = await essayResponse.json();
                    
                    if (essayData.essayAssignment) {
                        setEssayData(essayData);
                        setEssay(essayData);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    toast.error('Failed to load guidelines');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [id, setEssay, setQuiz]);

    const handleAccept = () => {
        if (guidelines.length > 0) {
            toast.success("Loading the Assignment... Get Ready!");
            router.push(`/assignment/${id}`);
        } else {
            toast.error("No guidelines available");
        }
    };

    const guidelines = quizData?.assignment.guidelines || essayData?.essayAssignment.guidelines || [];
    const timeLimit = quizData?.assignment.timeLimit || essayData?.essayAssignment.timeLimit || 0;
    const title = quizData?.assignment.title || essayData?.essayAssignment?.title || 'Assignment';
    const moduleType = quizData ? 'Quiz' : essayData ? 'Essay' : 'Assessment';
    
    // Store time limit in local storage
    useEffect(() => {
        if (timeLimit > 0) {
            localStorage.setItem('timeLimit', timeLimit.toString());
        }
    }, [timeLimit]);

    // Format time limit for display
    const formatTimeLimit = (minutes: number) => {
        if (minutes <= 0) return 'No time limit';
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}` : ''}`;
        }
        return `${mins} minute${mins > 1 ? 's' : ''}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4 py-8">
            {/* Decorative elements */}
            <div className="fixed top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="fixed top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="fixed bottom-20 left-1/4 w-56 h-56 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl relative z-10"
            >
                <Card className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-md p-8 border-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
                            <p className="text-gray-600">Loading guidelines...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="mb-2">
                                <div className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-medium text-sm">
                                    {moduleType}
                                </div>
                            </div>
                            
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
                                <p className="text-gray-600">
                                    Please review the guidelines before proceeding
                                </p>
                                
                                {timeLimit > 0 && (
                                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-amber-50 text-amber-800 rounded-lg">
                                        <Timer className="h-5 w-5 mr-2" />
                                        <span>Time Limit: {formatTimeLimit(timeLimit)}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="w-full bg-green-50 rounded-xl p-6 mb-8">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                                    Guidelines
                                </h2>
                                
                                {guidelines.length > 0 ? (
                                    <ul className="space-y-3">
                                        {guidelines.map((line, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                                                <div className="text-gray-700">{line}</div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center justify-center p-4 text-gray-500">
                                        <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                                        <span>No guidelines available</span>
                                    </div>
                                )}
                            </div>
                            
                            {guidelines.length > 0 && (
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full max-w-md"
                                >
                                    <button
                                        onClick={handleAccept}
                                        className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-md flex items-center justify-center transition-colors"
                                    >
                                        <span>Begin {moduleType}</span>
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}
                            
                            {guidelines.length === 0 && (
                                <button
                                    onClick={() => router.back()}
                                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Go Back
                                </button>
                            )}
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

export default Guidelines;