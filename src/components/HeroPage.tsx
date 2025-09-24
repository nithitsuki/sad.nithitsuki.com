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
            {/* <nav className="relative z-10 flex justify-between items-center p-6">
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
            </nav> */}

            {/* Hero Section */}
            <main className="flex-1 flex  justify-center relative z-10">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent">
                        Track Your Attendance
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        A simple, elegant dashboard to monitor your class attendance,
                        calculate required classes, and never miss your minimum attendance again.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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

                    {/* Compact Amrita Section */}
                    <div className="inline-flex items-center gap-4 p-4 border rounded-lg bg-card/50">
                        <span className="text-sm text-muted-foreground">
                            <span className="text-pink-600 font-semibold">Amrita Student?</span> Get the browser extension!
                        </span>
                        <Link href="/amrita">
                            <Button variant="outline" size="sm">
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
