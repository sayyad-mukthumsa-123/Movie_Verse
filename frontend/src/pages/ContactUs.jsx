import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import axios from '../axios/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgImage from '../assets/home.jpg';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useParams } from 'react-router-dom';

const ContactUs = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    from_name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/profile/${id}`);

        if (response.status === 200) {
          const data = response.data;
          setFormData({ from_name: data.username, email: data.email, message: '' });
        } else {
          toast.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('An error occurred while fetching user details');
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const to_name = "MovieVerse Team";

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const templateParams = {
      from_name: formData.from_name,
      email: formData.email,
      message: formData.message,
      to_name: to_name,
    };

    emailjs
      .send('service_suvydbj', 'template_nwe46e4', templateParams, '25Cl43Yt9RTzSXdil')
      .then(() => {
        toast.success('Message Sent Successfully!', { position: 'top-right' });
        setFormData({ ...formData, message: '' });
      })
      .catch(() => {
        toast.error('Error sending message, please try again.', { position: 'top-right' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
      <div className="relative z-10 w-full max-w-md sm:max-w-md md:max-w-md lg:max-w-md xl:max-w-md bg-white bg-opacity-90 rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-800 text-center mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="from_name" className="block text-lg sm:text-xl mb-2 font-medium text-cyan-800">Username</label>
            <Tippy content={<span className="text-red-600 text-lg sm:text-xl p-2 font-semibold">!!! Username is read-only</span>} theme="light" placement="bottom">
              <input
                type="text"
                id="from_name"
                name="from_name"
                value={formData.from_name}
                readOnly
                className="w-full px-4 py-2 border rounded-lg cursor-not-allowed text-lg sm:text-xl"
              />
            </Tippy>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg sm:text-xl mb-2 font-medium text-cyan-800">Email</label>
            <Tippy content={<span className="text-red-600 text-lg sm:text-xl p-2 font-semibold">!!! Email is read-only</span>} theme="light" placement="bottom">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 border rounded-lg cursor-not-allowed text-lg sm:text-xl"
              />
            </Tippy>
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-lg sm:text-xl mb-2 font-medium text-cyan-800">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline text-lg sm:text-xl"
              placeholder="Enter your message"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full text-lg sm:text-xl font-medium outline text-green-800 py-2 px-4 rounded-lg hover:bg-green-700 hover:text-white transition-all flex justify-center items-center"
              disabled={loading}
            >
              {loading ? 'Sending Message ...' : 'Send Message'}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ContactUs;