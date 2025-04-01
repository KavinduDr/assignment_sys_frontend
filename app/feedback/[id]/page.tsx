'use client'
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const page = () => {
    const { id } = useParams();
    const [ feedback, setFeedback ] = useState('');
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const router = useRouter();
    let apiUrl: string;
    useEffect(() => {
        // Determine the correct API URL based on the hostname
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                apiUrl = 'http://localhost:4000';
            } else {
                apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || '';
                console.log('Deployment URL:', apiUrl);
            }
        }
    }, [id])

    const handleSubmit = async () => {
      if(!feedback.trim()) {
        alert('Please enter your feedback');
        return;
      }
      setIsSubmitting(true);
      const submissionData = {
        assignmentId: id,
        feedback: feedback,
      }
      console.log(submissionData);

      try {
        const response = await axios.post(
          `http://localhost:4000/api/v1/feedback/create`,
          submissionData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if(response.status === 201 || response.data.success) {
          toast.success('Feedback submitted successfully!');
          router.push('/completed');
        }
      } catch (error) {
        toast.error('An error occurred while submitting feedback. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }

  return (
    <div className='container mx-auto p-4 flex flex-col justify-center items-center w-full'>
        <h1 className='text-2xl md:text-3xl font-bold mb-4 mt-5'>Feedback Page</h1>
        <div className='w-full mt-10 flex flex-col items-center gap-4'>
            <label className='text-lg font-bold'>Tell us about the quiz and markings</label>
            <textarea value={feedback}
             onChange={(e) => setFeedback(e.target.value)}
             placeholder='Your feedback here...'
             className='p-2 border w-full border-black my-2 h-60 rounded-lg ' />
        </div>
        <div className='w-full mt-10 flex flex-col md:flex-row md:justify-between md:w-1/2 items-center gap-4'>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110">{isSubmitting ? 'Submitting' : 'Submit'}</button>
            <button className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-transform duration-300 hover:scale-x-110" onClick={() => router.push('/completed')}>Nah I&apos;m fine</button>
        </div>
    </div>
  )
}

export default page