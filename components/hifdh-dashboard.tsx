'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  BookMarked,
  BookText,
  BarChart3,
  Star,
  StarHalf,
  Plus,
  CheckCircle,
  Calendar as CalendarIcon,
  Clock,
  Award,
  Bookmark,
  Flame,
  Users
} from 'lucide-react';

// Define types
type MemorizationStatus = 'not-started' | 'in-progress' | 'completed';

interface MemorizationItem {
  id: string;
  surah: number;
  surahName: string;
  startVerse: number;
  endVerse: number;
  date: Date;
  qualityRating: number; // 1-5
  notes?: string;
  completionStatus: MemorizationStatus;
}

interface SabakItem extends MemorizationItem {
  targetDate: Date;
}

interface SabkiItem extends MemorizationItem {
  lastReviewDate?: Date;
  daysInSabki: number;
  reviewCount: number;
}

interface ManzilItem extends MemorizationItem {
  reviewFrequency: number; // days
  lastReviewDate?: Date;
  nextReviewDate: Date;
}

// Sample data
const sabakData: SabakItem[] = [
  {
    id: '1',
    surah: 2,
    surahName: 'Al-Baqarah',
    startVerse: 1,
    endVerse: 5,
    date: new Date(),
    targetDate: new Date(Date.now() + 86400000), // tomorrow
    qualityRating: 3,
    notes: 'Focus on verse 3 pronunciation',
    completionStatus: 'in-progress',
  },
  {
    id: '2',
    surah: 2,
    surahName: 'Al-Baqarah',
    startVerse: 6,
    endVerse: 10,
    date: new Date(),
    targetDate: new Date(Date.now() + 172800000), // day after tomorrow
    qualityRating: 0,
    completionStatus: 'not-started',
  },
];

const sabkiData: SabkiItem[] = [
  {
    id: '3',
    surah: 1,
    surahName: 'Al-Fatihah',
    startVerse: 1,
    endVerse: 7,
    date: new Date(Date.now() - 172800000), // 2 days ago
    lastReviewDate: new Date(Date.now() - 86400000), // yesterday
    qualityRating: 5,
    daysInSabki: 4,
    reviewCount: 2,
    completionStatus: 'completed',
  },
  {
    id: '4',
    surah: 2,
    surahName: 'Al-Baqarah',
    startVerse: 1,
    endVerse: 5,
    date: new Date(Date.now() - 86400000), // yesterday
    qualityRating: 4,
    daysInSabki: 1,
    reviewCount: 0,
    completionStatus: 'in-progress',
  },
];

const manzilData: ManzilItem[] = [
  {
    id: '5',
    surah: 1,
    surahName: 'Al-Fatihah',
    startVerse: 1,
    endVerse: 7,
    date: new Date(Date.now() - 1209600000), // 14 days ago
    lastReviewDate: new Date(Date.now() - 259200000), // 3 days ago
    nextReviewDate: new Date(Date.now() + 345600000), // 4 days from now
    qualityRating: 5,
    reviewFrequency: 7, // weekly
    completionStatus: 'completed',
  },
  {
    id: '6',
    surah: 114,
    surahName: 'An-Nas',
    startVerse: 1,
    endVerse: 6,
    date: new Date(Date.now() - 2592000000), // 30 days ago
    lastReviewDate: new Date(Date.now() - 86400000), // yesterday
    nextReviewDate: new Date(Date.now() + 518400000), // 6 days from now
    qualityRating: 4,
    reviewFrequency: 7, // weekly
    completionStatus: 'completed',
  },
  {
    id: '7',
    surah: 113,
    surahName: 'Al-Falaq',
    startVerse: 1,
    endVerse: 5,
    date: new Date(Date.now() - 2592000000), // 30 days ago
    lastReviewDate: new Date(Date.now() - 172800000), // 2 days ago
    nextReviewDate: new Date(), // today
    qualityRating: 3,
    reviewFrequency: 5,
    completionStatus: 'completed',
  },
];

// Stats data
const userStats = {
  totalVersesMemorized: 23,
  currentStreak: 7,
  longestStreak: 12,
  averageQuality: 4.2,
  versesPerDay: 1.5,
  completionPercentage: 0.37, // Out of 6236 verses in the Quran
};

const HifdhDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter items due for today
  const todayManzilItems = manzilData.filter(item =>
    new Date(item.nextReviewDate).toDateString() === new Date().toDateString()
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="py-6 px-6 sm:px-10 bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Hifdh Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Memorized</p>
                      <h3 className="text-2xl font-bold text-gray-900">{userStats.totalVersesMemorized} verses</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <BookMarked className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <Progress className="h-2 mt-4" value={userStats.completionPercentage * 100} />
                  <p className="text-xs text-gray-500 mt-2">{(userStats.completionPercentage * 100).toFixed(1)}% of Quran completed</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Daily Streak</p>
                      <h3 className="text-2xl font-bold text-gray-900">{userStats.currentStreak} days</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Flame className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Longest: {userStats.longestStreak} days</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Average Quality</p>
                      <h3 className="text-2xl font-bold text-gray-900">{userStats.averageQuality.toFixed(1)}/5</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex">
                    {[1, 2, 3, 4, 5].map(rating => {
                      const fullStars = Math.floor(userStats.averageQuality);
                      const hasHalfStar = userStats.averageQuality - fullStars >= 0.5;

                      if (rating <= fullStars) {
                        return <Star key={rating} className="h-4 w-4 text-yellow-500" fill="currentColor" />;
                      } else if (rating === fullStars + 1 && hasHalfStar) {
                        return <StarHalf key={rating} className="h-4 w-4 text-yellow-500" fill="currentColor" />;
                      } else {
                        return <Star key={rating} className="h-4 w-4 text-gray-300" />;
                      }
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Daily Average</p>
                      <h3 className="text-2xl font-bold text-gray-900">{userStats.versesPerDay} verses</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">↑ 12% from last week</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Main Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="sabak" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <BookText className="h-4 w-4 mr-2" />
                Sabak
              </TabsTrigger>
              <TabsTrigger value="sabki" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <BookMarked className="h-4 w-4 mr-2" />
                Sabki
              </TabsTrigger>
              <TabsTrigger value="manzil" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <Bookmark className="h-4 w-4 mr-2" />
                Manzil
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Plan */}
                <div className="lg:col-span-2">
                  <Card className="shadow-lg border-none overflow-hidden">
                    <CardHeader className=" text-black">
                      <CardTitle className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        Today's Hifdh Plan
                      </CardTitle>
                      <CardDescription className="text-indigo-100">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center text-indigo-700">
                            <BookText className="h-5 w-5 mr-2" />
                            Sabak (New Lesson)
                          </h3>
                          <Separator className="my-2" />
                          {sabakData.filter(item => item.completionStatus !== 'completed').length > 0 ? (
                            <div className="space-y-3 mt-3">
                              {sabakData
                                .filter(item => item.completionStatus !== 'completed')
                                .map(item => (
                                  <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                    <div>
                                      <p className="font-medium">Surah {item.surahName} ({item.startVerse}-{item.endVerse})</p>
                                      <p className="text-sm text-gray-500">Target: {item.targetDate.toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                      {item.completionStatus === 'in-progress' && (
                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>
                                      )}
                                      {item.completionStatus === 'not-started' && (
                                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Started</Badge>
                                      )}
                                      <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                        Update
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">No new lessons scheduled for today</p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold flex items-center text-indigo-700">
                            <BookMarked className="h-5 w-5 mr-2" />
                            Sabki (Recent Lessons)
                          </h3>
                          <Separator className="my-2" />
                          {sabkiData.length > 0 ? (
                            <div className="space-y-3 mt-3">
                              {sabkiData.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                  <div>
                                    <p className="font-medium">Surah {item.surahName} ({item.startVerse}-{item.endVerse})</p>
                                    <p className="text-sm text-gray-500">Day {item.daysInSabki} of 7 • {item.reviewCount} reviews completed</p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                      Mark Reviewed
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">No recent lessons to review</p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold flex items-center text-indigo-700">
                            <Bookmark className="h-5 w-5 mr-2" />
                            Manzil (Review)
                          </h3>
                          <Separator className="my-2" />
                          {todayManzilItems.length > 0 ? (
                            <div className="space-y-3 mt-3">
                              {todayManzilItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                  <div>
                                    <p className="font-medium">Surah {item.surahName} ({item.startVerse}-{item.endVerse})</p>
                                    <p className="text-sm text-gray-500">
                                      Last reviewed: {item.lastReviewDate ? new Date(item.lastReviewDate).toLocaleDateString() : 'Never'}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star
                                          key={idx}
                                          className={`h-4 w-4 ${idx < item.qualityRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                        />
                                      ))}
                                    </div>
                                    <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                      Mark Reviewed
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">No Manzil sections due for review today</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Calendar and Upcoming */}
                <div className="space-y-6">
                  <Card className="shadow-lg border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-indigo-700">Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="mx-auto"
                      />
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-indigo-700 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Upcoming Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-72">
                        <div className="space-y-4">
                          {manzilData
                            .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
                            .map(item => (
                              <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">Surah {item.surahName}</p>
                                  <Badge
                                    className={
                                      new Date(item.nextReviewDate).toDateString() === new Date().toDateString()
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }
                                  >
                                    {new Date(item.nextReviewDate).toDateString() === new Date().toDateString()
                                      ? 'Today'
                                      : new Date(item.nextReviewDate).toLocaleDateString()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500">Verses {item.startVerse}-{item.endVerse}</p>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Memorization Progress */}
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="text-indigo-700">Overall Memorization Progress</CardTitle>
                  <CardDescription>Track your journey through the Quran</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      style={{ width: `${userStats.completionPercentage * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(juz => (
                      <Card key={juz} className="border border-indigo-100">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium">Juz {juz}</p>
                          <Progress className="h-2 mt-2" value={juz === 1 ? 70 : juz === 2 ? 30 : 0} />
                          <p className="text-xs text-gray-500 mt-2">
                            {juz === 1 ? '70%' : juz === 2 ? '30%' : '0%'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sabak Tab */}
            <TabsContent value="sabak" className="space-y-6">
              <Card className="shadow-lg border-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-indigo-700">Current Lessons (Sabak)</CardTitle>
                    <CardDescription>Track your new memorization</CardDescription>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Add New Lesson
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sabakData.length > 0 ? (
                      sabakData.map(item => (
                        <div
                          key={item.id}
                          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">Surah {item.surahName} ({item.startVerse}-{item.endVerse})</h3>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Added on {new Date(item.date).toLocaleDateString()}
                                <span className="mx-2">•</span>
                                <Clock className="h-4 w-4 mr-1" />
                                Target: {new Date(item.targetDate).toLocaleDateString()}
                              </div>

                              {item.notes && (
                                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                  <span className="font-medium">Notes:</span> {item.notes}
                                </p>
                              )}
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                              <div className="flex space-x-1 mb-2">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={`h-5 w-5 ${idx < item.qualityRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>

                              <div className="flex space-x-2">
                                <Badge
                                  className={
                                    item.completionStatus === 'completed'
                                      ? "bg-green-100 text-green-800"
                                      : item.completionStatus === 'in-progress'
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {item.completionStatus === 'completed'
                                    ? 'Completed'
                                    : item.completionStatus === 'in-progress'
                                      ? 'In Progress'
                                      : 'Not Started'}
                                </Badge>
                                <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                  Update
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No lessons yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Start adding your current memorization assignments.</p>
                        <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                          <Plus className="mr-2 h-4 w-4" /> Add First Lesson
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sabki Tab */}
            <TabsContent value="sabki" className="space-y-6">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="text-indigo-700">Recent Lessons (Sabki)</CardTitle>
                  <CardDescription>Lessons that need frequent review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sabkiData.length > 0 ? (
                      sabkiData.map(item => (
                        <div
                          key={item.id}
                          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">Surah {item.surahName} ({item.startVerse}-{item.endVerse})</h3>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Added {new Date(item.date).toLocaleDateString()}
                                {item.lastReviewDate && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <Clock className="h-4 w-4 mr-1" />
                                    Last reviewed: {new Date(item.lastReviewDate).toLocaleDateString()}
                                  </>
                                )}
                              </div>

                              <div className="mt-2">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-700 mr-2">Review progress:</p>
                                  <p className="text-sm text-gray-500">Day {item.daysInSabki} of 7</p>
                                </div>
                                <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${(item.daysInSabki / 7) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                              <div className="flex space-x-1 mb-2">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={`h-5 w-5 ${idx < item.qualityRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>

                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                  Mark Reviewed Today
                                </Button>
                                <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <BookMarked className="h-12 w-12 mx-auto text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No recent lessons</h3>
                        <p className="mt-1 text-sm text-gray-500">Completed Sabak lessons will appear here for daily review.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manzil Tab */}
            <TabsContent value="manzil" className="space-y-6">
              <Card className="shadow-lg border-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-indigo-700">Review Schedule (Manzil)</CardTitle>
                    <CardDescription>Long-term memorization maintenance</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                      <CalendarIcon className="mr-2 h-4 w-4" /> Schedule View
                    </Button>
                    <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                      <BookText className="mr-2 h-4 w-4" /> List View
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {manzilData.length > 0 ? (
                      manzilData
                        .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
                        .map(item => (
                          <div
                            key={item.id}
                            className={`p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow ${new Date(item.nextReviewDate).toDateString() === new Date().toDateString()
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200'
                              }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-lg font-semibold">Surah {item.surahName} ({item.startVerse}-{item.endVerse})</h3>
                                  {new Date(item.nextReviewDate).toDateString() === new Date().toDateString() && (
                                    <Badge className="ml-2 bg-green-100 text-green-800">Due Today</Badge>
                                  )}
                                </div>
                                <div className="flex items-center flex-wrap mt-1 text-sm text-gray-500">
                                  <div className="flex items-center mr-3">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    Originally memorized: {new Date(item.date).toLocaleDateString()}
                                  </div>
                                  {item.lastReviewDate && (
                                    <div className="flex items-center mr-3">
                                      <Clock className="h-4 w-4 mr-1" />
                                      Last reviewed: {new Date(item.lastReviewDate).toLocaleDateString()}
                                    </div>
                                  )}
                                  <div className="flex items-center mt-1 md:mt-0">
                                    <Award className="h-4 w-4 mr-1" />
                                    Review frequency: Every {item.reviewFrequency} days
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                                <div className="flex space-x-1 mb-2">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <Star
                                      key={idx}
                                      className={`h-5 w-5 ${idx < item.qualityRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>

                                <div className="flex items-center space-x-3">
                                  <p className="text-sm text-gray-500">
                                    Next review: <span className="font-medium">{new Date(item.nextReviewDate).toLocaleDateString()}</span>
                                  </p>
                                  <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                    Mark Reviewed
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <Bookmark className="h-12 w-12 mx-auto text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No review schedule yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Completed portions will move here for long-term review.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-lg border-none">
                  <CardHeader>
                    <CardTitle className="text-indigo-700">Memorization Pace</CardTitle>
                    <CardDescription>Verses memorized over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="h-full flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto text-indigo-200" />
                        <p className="mt-2">Bar chart visualization will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-none">
                  <CardHeader>
                    <CardTitle className="text-indigo-700">Quality Trends</CardTitle>
                    <CardDescription>Retention quality over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="h-full flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto text-indigo-200" />
                        <p className="mt-2">Line chart visualization will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-none">
                  <CardHeader>
                    <CardTitle className="text-indigo-700">Quran Heat Map</CardTitle>
                    <CardDescription>Strength of memorization across all surahs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-1">
                      {Array.from({ length: 30 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`aspect-square rounded ${idx < 1 ? 'bg-indigo-600' :
                            idx < 2 ? 'bg-indigo-500' :
                              idx < 5 ? 'bg-indigo-400' :
                                idx < 7 ? 'bg-indigo-300' :
                                  idx < 10 ? 'bg-indigo-200' :
                                    idx < 15 ? 'bg-indigo-100' : 'bg-gray-100'
                            }`}
                          title={`Juz ${Math.floor(idx / 6) + 1}, Section ${idx % 6 + 1}`}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-gray-100 mr-1" />
                        <span className="text-xs text-gray-500">Not started</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-indigo-300 mr-1" />
                        <span className="text-xs text-gray-500">In progress</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-indigo-600 mr-1" />
                        <span className="text-xs text-gray-500">Strong</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-none">
                  <CardHeader>
                    <CardTitle className="text-indigo-700">Consistency Calendar</CardTitle>
                    <CardDescription>Your daily activity over the past month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 28 }).map((_, idx) => {
                        // Random activity level for demo purposes
                        const activityLevel = Math.floor(Math.random() * 5);
                        return (
                          <div
                            key={idx}
                            className={`aspect-square rounded ${activityLevel === 4 ? 'bg-green-600' :
                              activityLevel === 3 ? 'bg-green-500' :
                                activityLevel === 2 ? 'bg-green-400' :
                                  activityLevel === 1 ? 'bg-green-300' :
                                    'bg-gray-100'
                              }`}
                            title={`${new Date(Date.now() - (28 - idx) * 86400000).toLocaleDateString()}: ${activityLevel === 0 ? 'No activity' :
                              activityLevel === 1 ? 'Light activity' :
                                activityLevel === 2 ? 'Moderate activity' :
                                  activityLevel === 3 ? 'High activity' :
                                    'Very high activity'
                              }`}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-gray-100 mr-1" />
                        <span className="text-xs text-gray-500">No activity</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-green-300 mr-1" />
                        <span className="text-xs text-gray-500">Light</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-green-600 mr-1" />
                        <span className="text-xs text-gray-500">High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="text-indigo-700">Detailed Statistics</CardTitle>
                  <CardDescription>Breakdown of your memorization journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-white border border-indigo-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Total Memorized</p>
                      <p className="mt-1 text-2xl font-bold text-indigo-700">{userStats.totalVersesMemorized} verses</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {(userStats.completionPercentage * 100).toFixed(1)}% of Quran completed
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-indigo-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Average Daily</p>
                      <p className="mt-1 text-2xl font-bold text-indigo-700">{userStats.versesPerDay} verses</p>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="text-green-600">↑ 12%</span> from previous month
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-indigo-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Current Streak</p>
                      <p className="mt-1 text-2xl font-bold text-indigo-700">{userStats.currentStreak} days</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Longest: {userStats.longestStreak} days
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-indigo-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Estimated Completion</p>
                      <p className="mt-1 text-2xl font-bold text-indigo-700">2.5 years</p>
                      <p className="mt-1 text-sm text-gray-500">
                        At current pace
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 sm:px-10 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <p className="text-sm text-gray-600">Hifdh Dashboard</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600">
                <Users className="h-4 w-4 mr-2" /> Community
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600">
                <Award className="h-4 w-4 mr-2" /> Achievements
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600">
                <Clock className="h-4 w-4 mr-2" /> History
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HifdhDashboard;