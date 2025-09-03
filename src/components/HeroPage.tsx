import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import Footer from '@/components/Footer';

export default function HeroPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundGrid />

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center p-6">
                <div className="text-2xl font-bold">
                    Attendance Dashboard
                </div>
                <div className="space-x-4">
                    <Link href="/dashboard">
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                    <Link href="/amrita">
                        <Button variant="outline">Amrita Extension</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center relative z-10">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Track Your Attendance
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        A simple, elegant dashboard to monitor your class attendance,
                        calculate required classes, and never miss your minimum attendance again.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/dashboard">
                            <Button size="lg" className="text-lg px-8 py-4">
                                Open Dashboard
                            </Button>
                        </Link>

                        <Link href="/dashboard/demo">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                Try Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Smart Tracking</h3>
                            <p className="text-muted-foreground">
                                Automatically calculate attendance percentages and required classes
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                            <p className="text-muted-foreground">
                                Built with Next.js for optimal performance and user experience
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 32 32">
                                    <path d="M29.000,13.858 L29.000,31.000 C29.000,31.553 28.553,32.000 28.000,32.000 C27.447,32.000 27.000,31.553 27.000,31.000 L27.000,13.858 C25.279,13.411 24.000,11.859 24.000,10.000 C24.000,8.141 25.279,6.589 27.000,6.142 L27.000,1.000 C27.000,0.447 27.447,0.000 28.000,0.000 C28.553,0.000 29.000,0.447 29.000,1.000 L29.000,6.142 C30.721,6.589 32.000,8.141 32.000,10.000 C32.000,11.859 30.721,13.411 29.000,13.858 ZM28.000,8.000 C26.898,8.000 26.000,8.897 26.000,10.000 C26.000,11.103 26.898,12.000 28.000,12.000 C29.103,12.000 30.000,11.103 30.000,10.000 C30.000,8.897 29.103,8.000 28.000,8.000 ZM17.000,25.858 L17.000,31.000 C17.000,31.553 16.553,32.000 16.000,32.000 C15.447,32.000 15.000,31.553 15.000,31.000 L15.000,25.858 C13.279,25.411 12.000,23.859 12.000,22.000 C12.000,20.141 13.279,18.589 15.000,18.142 L15.000,1.000 C15.000,0.447 15.447,0.000 16.000,0.000 C16.553,0.000 17.000,0.447 17.000,1.000 L17.000,18.142 C18.721,18.589 20.000,20.141 20.000,22.000 C20.000,23.859 18.721,25.411 17.000,25.858 ZM16.000,20.000 C14.897,20.000 14.000,20.898 14.000,22.000 C14.000,23.102 14.897,24.000 16.000,24.000 C17.103,24.000 18.000,23.102 18.000,22.000 C18.000,20.898 17.103,20.000 16.000,20.000 ZM5.000,19.858 L5.000,31.000 C5.000,31.553 4.553,32.000 4.000,32.000 C3.447,32.000 3.000,31.553 3.000,31.000 L3.000,19.858 C1.279,19.411 0.000,17.859 0.000,16.000 C0.000,14.141 1.279,12.589 3.000,12.142 L3.000,1.000 C3.000,0.447 3.447,0.000 4.000,0.000 C4.553,0.000 5.000,0.447 5.000,1.000 L5.000,12.142 C6.721,12.589 8.000,14.141 8.000,16.000 C8.000,17.859 6.721,19.411 5.000,19.858 ZM4.000,14.000 C2.898,14.000 2.000,14.898 2.000,16.000 C2.000,17.103 2.898,18.000 4.000,18.000 C5.102,18.000 6.000,17.103 6.000,16.000 C6.000,14.898 5.102,14.000 4.000,14.000 Z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Fully Customizable</h3>
                            <p className="text-muted-foreground">
                                Set your own attendance thresholds and track multiple subjects
                            </p>
                        </div>
                    </div>

                    {/* Special Section for Amrita Students */}
                    <div className="mt-16 p-8 border rounded-lg bg-card">
                        <h2 className="text-2xl font-bold mb-4">
                            <span className="text-pink-600">Amrita Student?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-4">
                            Check out our browser extension that automatically syncs your attendance data!
                        </p>
                        <Link href="/amrita">
                            <Button variant="outline" size="lg">
                                Get Extension
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
