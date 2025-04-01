'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useEssay } from '@/context/EssayContext';
import { useQuiz } from '@/context/QuizContext';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Send, CheckCircle, Loader2, FileText, BookOpen, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SubmissionPage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const { user } = useUser();
    const { essay } = useEssay();
    const { quiz } = useQuiz();

    const [quizData, setQuizData] = useState(null);
    const [essayData, setEssayData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isQuiz, setIsQuiz] = useState(false);
    const [isEssay, setIsEssay] = useState(false);
    const [savedAnswers, setSavedAnswers] = useState([]);
    const [submissionInProgress, setSubmissionInProgress] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        const savedProgress = sessionStorage.getItem('quizProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setSavedAnswers(progress.userAnswers || {});
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:4000'
                : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;

            setIsLoading(true);
            try {
                // Fetch quiz data
                const quizResponse = await fetch(`${apiUrl}/api/v1/${id}`);
                const quizData = await quizResponse.json();
                if (quizData.assignment) {
                    setQuizData(quizData);
                    setIsQuiz(true);
                }

                // Fetch essay data
                const essayResponse = await fetch(`${apiUrl}/api/v1/essay/${id}`);
                const essayData = await essayResponse.json();
                if (essayData.essayAssignment) {
                    setEssayData(essayData);
                    setIsEssay(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error("Failed to load submission information");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleGoBack = () => {
        // Save current progress before going back
        const currentProgress = {
            userAnswers: savedAnswers,
            currentQuestionIndex: (quizData?.assignment?.questions?.length || essayData?.essayAssignment?.questions?.length || 0) - 1
        };
        sessionStorage.setItem('quizProgress', JSON.stringify(currentProgress));
        router.push(`/assignment/${id}`);
    };

    const initiateSubmission = () => {
        setShowConfirmDialog(true);
    };

    const cancelSubmission = () => {
        setShowConfirmDialog(false);
    };

    const confirmSubmission = async () => {
        setShowConfirmDialog(false);
        setSubmissionInProgress(true);
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:4000'
            : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;

        try {
            try {
                await fetch(`${apiUrl}/api/v1/quiz-session/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        quizId: id,
                        studentId: user?._id,
                        timestamp: new Date().toISOString()
                    })
                });
                console.log('Quiz session completed successfully');
            } catch (error) {
                console.error('Error completing quiz session:', error);
            }
            
            if (isQuiz) {
                const answers = JSON.parse(sessionStorage.getItem('selectedAnswerId') || '[]');
                const submissionData = {
                    userId: user?._id,
                    answers: answers,
                    startTime: new Date().toISOString()
                };

                const response = await axios.post(
                    `${apiUrl}/api/v1/${id}/submit`,
                    submissionData,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.data.success) {
                    sessionStorage.setItem('score', String(response.data.submission?.score));
                    toast.success("Quiz submitted successfully!");
                    router.push(`/scorepage/${id}`);
                }
            } else if (isEssay) {
                const essayAnswer = sessionStorage.getItem('EssayAnswer');
                const submissionData = {
                    assignmentId: essayData?.essayAssignment._id,
                    userId: user?._id,
                    registrationNumber: user?.registrationNumber,
                    answers: [{
                        questionId: essayData?.essayAssignment?.questions[0]?._id,
                        modelAnswer: essayData?.essayAssignment?.questions[0]?.answer,
                        studentAnswer: essayAnswer
                    }],
                    startTime: new Date().toISOString()
                };

                const response = await axios.post(
                    `${apiUrl}/api/v1/essay/${id}/submit`,
                    submissionData,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.data.success) {
                    sessionStorage.setItem('score', String(response.data.submission?.score));
                    toast.success("Essay submitted successfully!");
                    router.push(`/scorepage/${id}`);
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('An error occurred during submission. Please try again.');
        } finally {
            setSubmissionInProgress(false);
        }
    };

    const totalQuestions = quizData?.assignment?.questions?.length ||
        essayData?.essayAssignment?.questions?.length || 0;
    const answeredQuestions = Object.keys(savedAnswers).length;
    const completionPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    const title = quizData?.assignment?.title || essayData?.essayAssignment?.title || "Assignment";

    // Simplified Confirmation Dialog Component
    const ConfirmationDialog = () => (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={cancelSubmission}></div>
            
            {/* Dialog */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div 
                    className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl relative z-10"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center text-amber-500 mb-4">
                        <AlertTriangle className="h-6 w-6 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Confirm Submission</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to submit your {isQuiz ? 'quiz' : 'essay'}? This action cannot be undone.
                    </p>
                    
                    {answeredQuestions < totalQuestions && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <p className="text-amber-800 text-sm">
                                You have only answered {answeredQuestions} out of {totalQuestions} questions. Unanswered questions will be marked as incorrect.
                            </p>
                        </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={cancelSubmission}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                        >
                            Cancel
                        </Button>
                        
                        <Button
                            onClick={confirmSubmission}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        >
                            Yes, Submit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
            {/* Decorative elements */}
            <div className="fixed top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="fixed top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="fixed bottom-20 left-1/4 w-56 h-56 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            
            <div className="container mx-auto max-w-4xl relative z-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <Loader2 className="h-12 w-12 animate-spin text-green-500 mb-4" />
                        <p className="text-gray-600">Loading submission information...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-md border-0 overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                            <CardContent className="p-6 md:p-8">
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-800 rounded-full font-medium text-sm mb-4">
                                        {isQuiz ? (
                                            <><FileText className="h-4 w-4 mr-1.5" /> Quiz</>
                                        ) : (
                                            <><BookOpen className="h-4 w-4 mr-1.5" /> Essay</>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                        Ready to Submit
                                    </h1>
                                    <p className="text-gray-600">
                                        {title}
                                    </p>
                                </div>

                                <div className="bg-green-50 rounded-xl p-6 mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-medium text-gray-800">
                                            Completion Status
                                        </h2>
                                        <span className={`text-sm font-medium rounded-full px-3 py-1 ${
                                            completionPercentage === 100 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {answeredQuestions} of {totalQuestions} questions
                                        </span>
                                    </div>

                                    <div className="w-full bg-white rounded-full h-2.5 mb-4">
                                        <div 
                                            className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" 
                                            style={{ width: `${completionPercentage}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-6">
                                        {Array.from({ length: totalQuestions }, (_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                                className={`aspect-square flex flex-col items-center justify-center rounded-lg ${
                                                    savedAnswers[i] !== undefined
                                                        ? 'bg-green-100 border border-green-300 shadow-sm'
                                                        : 'bg-gray-100 border border-gray-200'
                                                }`}
                                            >
                                                <span className="text-sm font-semibold">
                                                    {i + 1}
                                                </span>
                                                {savedAnswers[i] !== undefined && (
                                                    <CheckCircle className="w-4 h-4 mt-1 text-green-600" />
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={handleGoBack}
                                            className="w-full sm:w-auto flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> 
                                            Return to Questions
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Button
                                            onClick={initiateSubmission}
                                            disabled={submissionInProgress}
                                            className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md"
                                        >
                                            {submissionInProgress ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit {isQuiz ? 'Quiz' : 'Essay'}
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
            
            {/* Confirmation Dialog - Rendered without AnimatePresence for simplicity */}
            {showConfirmDialog && <ConfirmationDialog />}
            
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

export default SubmissionPage;