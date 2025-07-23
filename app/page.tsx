"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Brain,
  Lightbulb,
  Award,
  LineChart,
} from "lucide-react";
import Link from "next/link";

const SmartMCQLanding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const learningSteps = [
    {
      icon: Target,
      title: "Attempt",
      description: "Students tackle MCQ questions at their own pace",
      color: "bg-blue-500",
    },
    {
      icon: Lightbulb,
      title: "Learn",
      description: "Immediate feedback and explanations for incorrect answers",
      color: "bg-yellow-500",
    },
    {
      icon: BarChart3,
      title: "Analyze",
      description: "Deep insights into mistakes and learning patterns",
      color: "bg-purple-500",
    },
    {
      icon: Award,
      title: "Master",
      description: "Progress only after demonstrating true understanding",
      color: "bg-green-500",
    },
  ];

  const analytics = [
    {
      title: "Question Analysis",
      description:
        "Difficulty levels, success rates, and time complexity analysis",
      metrics: [
        "First Attempt Success",
        "Learning Required",
        "Time Complexity",
      ],
      icon: BarChart3,
    },
    {
      title: "Learning Analysis",
      description: "Track student progress and concept mastery over time",
      metrics: ["Progress Tracking", "Concept Mastery", "Learning Velocity"],
      icon: TrendingUp,
    },
    {
      title: "Student Performance",
      description:
        "Individual and cohort performance insights and recommendations",
      metrics: ["Individual Progress", "Cohort Comparison", "Recommendations"],
      icon: Users,
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "Adaptive Learning Engine",
      description:
        "No progression without mastery - students learn through trial and error until they truly understand.",
    },
    {
      icon: Shield,
      title: "Advanced Anti-Cheating",
      description:
        "Fullscreen mode, mouse tracking, keyboard monitoring, and automatic termination for malpractices.",
    },
    {
      icon: LineChart,
      title: "Comprehensive Analytics",
      description:
        "Deep insights into question difficulty, learning patterns, and student performance metrics.",
    },
    {
      icon: Clock,
      title: "Time & Attempt Tracking",
      description:
        "Monitor time spent, attempts made, and learning velocity for each student and question.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                SmartMCQ
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all font-semibold"
              >
                Features
              </a>
              <a
                href="#analytics"
                className="text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all font-semibold"
              >
                Analytics
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all font-semibold"
              >
                How It Works
              </a>
              <Link href="/login">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:scale-105 hover:cursor-pointer">
                  Try it
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section*/}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50  pb-12 overflow-hidden h-screen flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6">
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Transform MCQ Testing into
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
                    Adaptive Learning
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 mb-6 leading-relaxed">
                  Where mistakes become stepping stones to mastery. Our adaptive
                  platform ensures students truly understand concepts before
                  progressing.
                </p>

                {/* Proven Results Card */}
                <div className="bg-white rounded-xl p-6 shadow-xl border mb-6 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-gray-900 block">
                        Proven Results
                      </span>
                      <span className="text-green-600 text-sm font-semibold">
                        Real Impact on Learning
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    <span className="font-bold text-blue-600 text-lg">
                      1000+ students
                    </span>{" "}
                    showed measurable improvement in concept understanding and
                    problem-solving skills.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl">
                    Get Started for Your College
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </button>
                  <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105">
                    View Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Right Analytics Cards */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Question Analytics - Large Card */}
                <div className="col-span-2 bg-white rounded-2xl shadow-xl p-6 transform hover:rotate-0 rotate-1 transition-all duration-500 hover:scale-105">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          Question Analytics
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Real-time insights
                        </p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span className="font-medium">
                            First Attempt Success
                          </span>
                          <span className="font-bold text-green-600">67%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: "67%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span className="font-medium">Learning Required</span>
                          <span className="font-bold text-amber-600">33%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out delay-300"
                            style={{ width: "33%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Performance */}
                <div className="bg-white rounded-2xl shadow-xl p-5 transform hover:rotate-0 -rotate-1 transition-all duration-500 hover:scale-105">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-4 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-purple-100 p-2 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Performance
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Accuracy</span>
                          <span className="font-bold text-purple-600">81%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full"
                            style={{ width: "81%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="pt-1">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Avg Time</span>
                          <span className="font-bold text-gray-800">
                            1.8 min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Insights */}
                <div className="bg-white rounded-2xl shadow-xl p-5 transform hover:rotate-0 rotate-2 transition-all duration-500 hover:scale-105">
                  <div className="bg-gradient-to-br from-green-50 to-blue-100 rounded-xl p-4 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-green-100 p-2 rounded-xl">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Insights
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Mastery</span>
                          <span className="font-bold text-green-600">72%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className="bg-gradient-to-r from-green-400 to-indigo-500 h-2 rounded-full"
                            style={{ width: "72%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Review</span>
                          <span className="font-bold text-red-500">28%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className="bg-gradient-to-r from-red-400 to-pink-500 h-2 rounded-full"
                            style={{ width: "28%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards Row */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">24/7</p>
                        <p className="text-gray-600 text-sm font-medium">
                          Support
                        </p>
                      </div>
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          95%
                        </p>
                        <p className="text-gray-600 text-sm font-medium">
                          Success
                        </p>
                      </div>
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Learning Flow */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Learn Through Mistakes, Master Through Understanding
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our adaptive learning methodology transforms the traditional
              testing approach into a powerful learning experience where every
              mistake is a step toward mastery.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {learningSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;

              return (
                <div
                  key={index}
                  className={`relative p-8 rounded-2xl transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl scale-105"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-16 h-16 ${
                      step.color
                    } rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {index < learningSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden"
      >
        {/* Optional Decorative Background Blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
          <div className="absolute top-48 right-16 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              Built for Academic Excellence
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Comprehensive features designed specifically for colleges to
              enhance learning outcomes and maintain academic integrity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-transparent hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section
        id="analytics"
        className="relative py-24 bg-gradient-to-br from-indigo-50 via-white to-blue-50 overflow-hidden"
      >
        {/* Decorative Animated Background Blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-24 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
          <div className="absolute top-48 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              Three Powerful Analytics Dashboards
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get deep insights into learning patterns, question difficulty, and
              student performance with our comprehensive analytics suite.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {analytics.map((analytic, index) => {
              const IconComponent = analytic.icon;
              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-transparent hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {analytic.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {analytic.description}
                  </p>

                  {/* Metrics List */}
                  <div className="space-y-3">
                    {analytic.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        <span className="text-sm text-gray-800">{metric}</span>
                      </div>
                    ))}
                  </div>

                  {/* Live Metric Progress Bar */}
                  {isMounted && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500">
                            Sample Metric
                          </span>
                          <span className="text-xs font-semibold text-blue-600">
                            Live Data
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${[75, 82, 68][index] || 75}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {[75, 82, 68][index] || 75}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* Decorative Animated Background Blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-16 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Tag */}
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg mb-8">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-semibold text-gray-900">
                Proven Results
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Real Impact on Student Learning
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Our pilot study with 1000+ college students demonstrated
              significant improvement in concept understanding and
              problem-solving abilities through adaptive learning.
            </p>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl transition-all transform hover:scale-105 duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  1000+
                </div>
                <div className="text-gray-700 font-medium">Students Tested</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl transition-all transform hover:scale-105 duration-300">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  85%
                </div>
                <div className="text-gray-700 font-medium">
                  Improvement Rate
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl transition-all transform hover:scale-105 duration-300">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  3x
                </div>
                <div className="text-gray-700 font-medium">
                  Better Retention
                </div>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-xl italic text-gray-800 max-w-4xl mx-auto leading-relaxed">
              “The adaptive learning approach transformed how our students
              engage with complex concepts. Instead of memorizing answers, they
              truly understand the underlying principles through guided trial
              and error.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Learning at Your College?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join forward-thinking educational institutions that are
            revolutionizing how students learn through adaptive MCQ testing.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-blue-600 text-white px-12 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
              Contact Us Today
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <button className="border-2 border-white text-white px-12 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section> */}
      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Glow Blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to Transform Learning at Your College?
          </h2>

          {/* Subheading */}
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join forward-thinking educational institutions that are
            revolutionizing how students learn through adaptive MCQ testing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl">
              Contact Us Today
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <button className="border-2 border-white text-white px-12 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SmartMCQ</span>
            </div>
            <div className="text-gray-400">
              © 2024 SmartMCQ. Transforming education through adaptive learning.
            </div>
          </div>
        </div>
      </footer> */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">SmartMCQ</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming education through adaptive learning. Personalized,
                data-driven, and built for deeper understanding.
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#analytics" className="hover:text-white">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/docs" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white">
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get product updates and insights straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  placeholder="you@college.edu"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <span>© 2024 SmartMCQ. All rights reserved.</span>
            <span>Built for forward-thinking educators.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartMCQLanding;
