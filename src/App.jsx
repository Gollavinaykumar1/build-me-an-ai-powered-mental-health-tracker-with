import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { Notify } from 'react-hot-toast';
import { FaSmile, FaFrown } from 'react-icons/fa';
import { AiOutlineHeart } from 'react-icons/ai';
import { BASE_URL } from './api';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';

function App() {
  const [mood, setMood] = useState('');
  const [stressLevel, setStressLevel] = useState(0);
  const [wellnessRecommendations, setWellnessRecommendations] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    axios.get(`${BASE_URL}/wellness/recommendations`)
      .then(response => {
        setWellnessRecommendations(response.data);
      })
      .catch(error => {
        Notify.error('Failed to fetch wellness recommendations');
      });
  }, []);

  const handleMoodLog = (data) => {
    axios.post(`${BASE_URL}/mood/log`, data)
      .then(response => {
        Notify.success('Mood logged successfully');
      })
      .catch(error => {
        Notify.error('Failed to log mood');
      });
  };

  const handleStressAnalysis = () => {
    axios.post(`${BASE_URL}/stress/analyze`, { stressLevel })
      .then(response => {
        Notify.success('Stress analysis completed');
      })
      .catch(error => {
        Notify.error('Failed to analyze stress');
      });
  };

  const handleWellnessRecommendation = (recommendation) => {
    axios.post(`${BASE_URL}/wellness/recommendation`, { recommendation })
      .then(response => {
        Notify.success('Wellness recommendation saved');
      })
      .catch(error => {
        Notify.error('Failed to save wellness recommendation');
      });
  };

  return (
    <HashRouter>
      <div className="container mx-auto p-4 mt-4">
        <h1 className="text-3xl font-bold mb-4">Mental Health Tracker</h1>
        <Routes>
          <Route path="/" element={
            <div>
              <h2 className="text-2xl font-bold mb-4">Mood Log</h2>
              <form onSubmit={handleSubmit(handleMoodLog)}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mood">Mood</label>
                  <select {...register('mood')} className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Select Mood</option>
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="angry">Angry</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
                  <input {...register('date')} type="date" className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Log Mood</button>
              </form>
              <h2 className="text-2xl font-bold mb-4 mt-4">Stress Analysis</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stressLevel">Stress Level</label>
                <input type="range" min="0" max="10" value={stressLevel} onChange={(e) => setStressLevel(e.target.value)} className="w-full" />
                <span className="text-sm text-gray-700">{stressLevel}/10</span>
              </div>
              <button onClick={handleStressAnalysis} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Analyze Stress</button>
              <h2 className="text-2xl font-bold mb-4 mt-4">Wellness Recommendations</h2>
              <ul>
                {wellnessRecommendations.map((recommendation, index) => (
                  <li key={index} className="mb-4">
                    <span className="text-gray-700 text-sm">{recommendation}</span>
                    <button onClick={() => handleWellnessRecommendation(recommendation)} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Save</button>
                  </li>
                ))}
              </ul>
            </div>
          } />
        </Routes>
        <ToastContainer />
      </div>
    </HashRouter>
  );
}

export default App;