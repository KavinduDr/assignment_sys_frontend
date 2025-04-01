'use client';

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Loader2, Mail, Lock, User, Eye, EyeOff, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SignUp() {
    const router = useRouter();
    const { id } = useParams();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        password: '',
        confirmPassword: '',
    });
    
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        password: '',
        confirmPassword: '',
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiUrl, setApiUrl] = useState('');

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
            name: '',
            email: '',
            registrationNumber: '',
            password: '',
            confirmPassword: '',
        };

        // Registration number validation
        if (!formData.registrationNumber) {
            newErrors.registrationNumber = 'Index number is required';
            isValid = false;
        } else if (!/^EG\/\d{4}\/\d{4}$/.test(formData.registrationNumber)) {
            newErrors.registrationNumber = 'Please enter a valid format (EG/XXXX/XXXX)';
            isValid = false;
        }

        // Name validation
        if (!formData.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/api/v1/registration`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                registrationNumber: formData.registrationNumber,
            });

            if (response.status === 201 || response.data.success) {
                toast.success('Registration successful!');
                
                if (response.data.activationToken) {
                    const token = response.data.activationToken;
                    toast.info('Please check your email to activate your account.');
                    router.push(`/activate?token=${token}`);
                } else {
                    // If ID exists, redirect to signin page with ID, otherwise to dashboard
                    router.push(id ? `/signin/${id}` : '/signin');
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
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
                className="w-full max-w-[500px] relative z-10"
            >
                <Card className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-md p-8 border-0">
                    <div className="flex flex-col items-center">
                        <div className="mb-5">
                            <Image
                                src="/SignIn.png"
                                alt="Sign up illustration"
                                width={150}
                                height={150}
                                priority
                                className="rounded-2xl"
                            />
                        </div>
                        
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Create an account</h1>
                            <p className="text-gray-600">
                                Join us today for free
                            </p>
                        </div>
                        
                        <div className="space-y-4 w-full">
                            {/* Registration Number Input */}
                            <div className="space-y-1">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <CreditCard size={18} />
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
                            
                            {/* Name Input */}
                            <div className="space-y-1">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`h-12 pl-12 rounded-xl bg-green-50/80 border-0 ${errors.name ? 'ring-2 ring-red-500' : 'focus:ring-green-300'}`}
                                    />
                                </div>
                                {errors.name && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-500 mt-1 pl-2"
                                    >
                                        {errors.name}
                                    </motion.p>
                                )}
                            </div>
                            
                            {/* Email Input */}
                            <div className="space-y-1">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`h-12 pl-12 rounded-xl bg-green-50/80 border-0 ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-green-300'}`}
                                    />
                                </div>
                                {errors.email && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-500 mt-1 pl-2"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </div>
                            
                            {/* Password Input */}
                            <div className="space-y-1">
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
                            
                            {/* Confirm Password Input */}
                            <div className="space-y-1">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`h-12 pl-12 pr-12 rounded-xl bg-green-50/80 border-0 ${errors.confirmPassword ? 'ring-2 ring-red-500' : 'focus:ring-green-300'}`}
                                    />
                                    <button 
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-500 mt-1 pl-2"
                                    >
                                        {errors.confirmPassword}
                                    </motion.p>
                                )}
                            </div>
                            
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="mt-6"
                            >
                                <Button
                                    className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-md"
                                    onClick={handleSignUp}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span>Creating your account...</span>
                                        </div>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </Button>
                            </motion.div>
                        </div>

                        <div className="text-center mt-6">
                            <span className="text-gray-500 text-sm">Already have an account?</span>
                            <Button
                                variant="link"
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                                onClick={() => router.push(id ? `/signin/${id}` : '/signin')}
                            >
                                Sign In
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