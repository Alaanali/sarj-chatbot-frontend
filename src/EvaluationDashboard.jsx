import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import apiClient from './api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_BASE = 'http://localhost:5000/api';

const EvaluationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [conversations, setConversations] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await apiClient.get(`/dashboard/stats`);
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await apiClient.get(`/dashboard/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadEvaluations = async () => {
    try {
      const response =await apiClient.get(`/dashboard/evaluations`);
      setEvaluations(response.data);
    } catch (error) {
      console.error('Error loading evaluations:', error);
    }
  };

  const runEvaluation = async () => {
    setIsEvaluating(true);
    try {
      await apiClient.post(`/evaluation/run`);
      setTimeout(() => {
        loadDashboardData();
        setIsEvaluating(false);
      }, 2000);
    } catch (error) {
      console.error('Error running evaluation:', error);
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  // Chart configurations
  const performanceChartData = {
    labels: ['Helpfulness', 'Correctness', 'Politeness', 'Accuracy', 'Scope'],
    datasets: [{
      label: 'Average Scores',
      data: [
        stats.helpfulnessScore || 0,
        stats.correctnessScore || 0,
        stats.politenessScore || 0,
        stats.accuracyScore || 0,
        stats.scopeScore || 0
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderColor: [
        'rgb(16, 185, 129)',
        'rgb(59, 130, 246)',
        'rgb(245, 158, 11)',
        'rgb(139, 92, 246)',
        'rgb(236, 72, 153)'
      ],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🌤️ Weather Chatbot Evaluation Dashboard
          </h1>
          <p className="text-blue-100 text-lg">
            Real-time monitoring and evaluation of chatbot performance
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Conversations</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalConversations || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Messages</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalMessages || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Evaluations</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalEvaluations || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Response Time</p>
                <p className="text-3xl font-bold text-orange-600">{stats.avgResponseTime || 0}ms</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Evaluation Scores</h3>
            <div className="space-y-3">
              {[
                { label: 'Overall Score', value: stats.overallScore, color: 'blue' },
                { label: 'Helpfulness', value: stats.helpfulnessScore, color: 'green' },
                { label: 'Correctness', value: stats.correctnessScore, color: 'blue' },
                { label: 'Politeness', value: stats.politenessScore, color: 'purple' },
                { label: 'Accuracy', value: stats.accuracyScore, color: 'orange' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className={`px-3 py-1 rounded-full text-white font-semibold ${getScoreColor(item.value)}`}>
                    {(item.value || 0).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">🤖 Actions</h3>
              <button
                onClick={runEvaluation}
                disabled={isEvaluating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEvaluating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running...
                  </>
                ) : (
                  '🔄 Run Evaluation'
                )}
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">GPT-5 Nano Score</span>
                <span className="text-lg font-bold text-blue-600">{(stats.gptScore || 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Gemini Flash Lite Score</span>
                <span className="text-lg font-bold text-green-600">{(stats.geminiScore || 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Tool Success Rate</span>
                <span className="text-lg font-bold text-purple-600">{(stats.toolSuccessRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-lg mb-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'conversations', label: '💬 Conversations', icon: '💬' },
              { id: 'evaluations', label: '📋 Evaluations', icon: '📋' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'conversations') loadConversations();
                  if (tab.id === 'evaluations') loadEvaluations();
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Overview</h3>
              <div className="h-80">
                <Bar data={performanceChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Conversations</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No conversations found</p>
                ) : (
                  conversations.map((conv, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-blue-600">#{conv.session_id?.substring(0, 8)}</span>
                        <span className="text-sm text-gray-500">{formatDate(conv.created_at)}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{conv.last_message || 'No messages yet'}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Messages: {conv.message_count || 0}</span>
                        <span>Score: {(conv.avg_score || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'evaluations' && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Evaluation Details</h3>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {evaluations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No evaluations found</p>
                ) : (
                  evaluations.map((e, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-semibold text-blue-600">Evaluation #{e.id}</span>
                        <span className="text-sm text-gray-500">{formatDate(e.timestamp)}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        {[
                          { label: 'Helpfulness', score: e.helpfulness_score },
                          { label: 'Correctness', score: e.correctness_score },
                          { label: 'Politeness', score: e.politeness_score },
                          { label: 'Accuracy', score: e.accuracy_score },
                          { label: 'Scope', score: e.scope_adherence_score }
                        ].map((item, idx) => (
                          <div key={idx} className="text-center">
                            <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                            <p className="text-xl font-bold text-blue-600">{item.score}/10</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <strong>Overall Feedback:</strong> {e.overall_feedback}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Analytics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Score Distribution</h4>
                  <div className="h-64">
                    <Bar data={performanceChartData} options={chartOptions} />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Key Metrics</h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">Average Overall Score</p>
                      <p className="text-2xl font-bold text-blue-700">{(stats.overallScore || 0).toFixed(1)}/10</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600 font-medium">Total Interactions</p>
                      <p className="text-2xl font-bold text-green-700">{stats.totalMessages || 0}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-600 font-medium">Evaluation Coverage</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {stats.totalMessages > 0 ? ((stats.totalEvaluations / stats.totalMessages) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationDashboard;