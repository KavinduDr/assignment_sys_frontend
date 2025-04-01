'use client';

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Loader2, User, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUser } from '@/context/UserContext';

export default function SignIn() {
    const router = useRouter();
    const { id } = useParams();
    
    const [formData, setFormData] = useState({
        registrationNumber: '',
        password: '',
    });
    
    const [errors, setErrors] = useState({
        registrationNumber: '',
        password: '',
    });
    
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [apiUrl, setApiUrl] = useState('');
    const { setUser } = useUser();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                setApiUrl('http://localhost:4000');
            } else {
                setApiUrl(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://52.64.209.177:4000'}`);
            }
        }
    }, []);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            registrationNumber: '',
            password: '',
        };

        // Registration number validation
        if (!formData.registrationNumber) {
            newErrors.registrationNumber = 'Index number is required';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        
        // Clear error when user starts typing
        if (errors[id]) {
            setErrors({ ...errors, [id]: '' });
        }
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignIn = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/api/v1/login-user`, {
                registrationNumber: formData.registrationNumber,
                password: formData.password,
            });

            if (response.status === 200 || response.data.success) {
                const token = response.data.accessToken;
                sessionStorage.setItem('name', response.data.user.name);
                
                if (rememberMe) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
                
                setUser(response.data.user);
                toast.success('Logged in successfully!');
                
                // Check if there's an ID parameter to redirect to waiting page
                if (id) {
                    router.push(`/waiting/${id}`);
                } else {
                    router.push('/dashboard');
                }
            } else {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
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
                className="w-full max-w-[500px] relative z-10"
            >
                <Card className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-md p-8 border-0">
                    <div className="flex flex-col items-center">
                        <div className="mb-6">
                            <Image
                                src="/SignIn.png"
                                alt="Sign in illustration"
                                width={180}
                                height={180}
                                priority
                                className="rounded-2xl"
                            />
                        </div>
                        
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
                            <p className="text-gray-600">
                                Sign in to your account
                            </p>
                        </div>
                        
                        <div className="space-y-5 w-full">
                            {/* Registration Number Input */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <Input
                                        id="registrationNumber"
                                        type="text"
                                        placeholder="Index Number (EG/XXXX/XXXX)"
                                        value={formData.registrationNumber}
                                        onChange={handleChange}
                                        className={`h-12 pl-12 rounded-xl bg-green-50/80 border-0 ${errors.registrationNumber ? 'ring-2 ring-red-500' : 'focus:ring-green-300'}`}
                                    />
                                </div>
                                {errors.registrationNumber && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-500 mt-1 pl-2"
                                    >
                                        {errors.registrationNumber}
                                    </motion.p>
                                )}
                            </div>
                            
                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`h-12 pl-12 pr-12 rounded-xl bg-green-50/80 border-0 ${errors.password ? 'ring-2 ring-red-500' : 'focus:ring-green-300'}`}
                                    />
                                    <button 
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-500 mt-1 pl-2"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </div>
                            
                            {/* Remember Me and Forgot Password */}
                            <div className="flex justify-between items-center w-full pt-2">
                                <div className="flex items-center">
                                    <input 
                                        id="rememberMe" 
                                        type="checkbox"
                                        checked={rememberMe} 
                                        onChange={handleRememberMeChange}
                                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-600">
                                        Remember Me
                                    </label>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-green-600 hover:text-green-800 text-sm font-medium p-0"
                                    onClick={() => router.push('/forgot-password')}
                                >
                                    Forgot Password?
                                </Button>
                            </div>
                            
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="mt-6"
                            >
                                <Button
                                    className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-md"
                                    onClick={handleSignIn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </motion.div>
                        </div>

                        <div className="text-center mt-8">
                            <span className="text-gray-500 text-sm">Don't have an account?</span>
                            <Button
                                variant="link"
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                                onClick={() => router.push(id ? `/signup/${id}` : '/signup')}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
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
}