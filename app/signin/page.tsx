'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Loader2, User, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUser } from '@/context/UserContext';

export default function SignIn() {
    const router = useRouter();
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
            setApiUrl(window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'http://52.64.209.177:4000');
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
                router.push('/dashboard');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-green-200 opacity-60"></div>
            <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-green-100 opacity-40"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 rounded-full bg-green-200 opacity-50"></div>
            <div className="absolute bottom-20 right-1/3 w-12 h-12 rounded-full bg-green-100 opacity-30"></div>
            
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
                                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
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
                                onClick={() => router.push('/signup')}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}