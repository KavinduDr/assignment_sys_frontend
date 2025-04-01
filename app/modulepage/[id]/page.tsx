'use client'

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useEssay } from '@/context/EssayContext';
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface QuizData {
    id: string;
    assignment: {
        password: string;
        title: string;
    };
}

interface EssayData {
    id: string;
    essayAssignment: {
        password: string;
        title: string;
    };
}

const ModulePage: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const { id } = useParams();
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [essayData, setEssayData] = useState<EssayData | null>(null);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setEssay } = useEssay();
    const { setQuiz } = useQuiz();

    if (typeof id === 'string') {
        localStorage.setItem('id', id);
    }

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
                    toast.error('Failed to load module information');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [id, setEssay, setQuiz]);

    const handleEnter = () => {
        const correctPassword = quizData?.assignment.password || essayData?.essayAssignment.password;
        
        setIsSubmitting(true);
        
        if (password === correctPassword) {
            toast.success('Access Granted');
            setTimeout(() => {
                router.push(`/guidelines/${id}`);
            }, 800);
        } else {
            toast.error('Incorrect Password');
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleEnter();
        }
    };

    const title = quizData?.assignment.title || essayData?.essayAssignment?.title || 'Module';
    const moduleType = quizData ? 'Quiz' : essayData ? 'Essay' : 'Assessment';

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
                className="w-full max-w-[500px] relative z-10"
            >
                <Card className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-md p-8 border-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
                            <p className="text-gray-600">Loading module information...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="mb-6 relative">
                                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                    {moduleType}
                                </div>
                                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center p-1 shadow-md">
                                    <div className="w-full h-full bg-white rounded-full overflow-hidden">
                                        <Image
                                            src="/module.jpg"
                                            alt="Module Logo"
                                            width={380}
                                            height={380}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
                                <p className="text-gray-600">
                                    Please enter the password to access this {moduleType.toLowerCase()}
                                </p>
                            </div>
                            
                            <div className="space-y-6 w-full">
                                <div className="space-y-2">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Lock size={18} />
                                        </div>
                                        <Input
                                            type="password"
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="h-12 pl-12 rounded-xl bg-green-50/80 border-0 focus:ring-green-300"
                                        />
                                    </div>
                                </div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <button
                                        onClick={handleEnter}
                                        disabled={isSubmitting}
                                        className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-md flex items-center justify-center transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                <span>Verifying...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span>Enter Module</span>
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        )}
                                    </button>
                                </motion.div>
                                
                                <div className="text-center text-sm text-gray-500">
                                    If you don't have the password, please contact your instructor
                                </div>
                            </div>
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

export default ModulePage;