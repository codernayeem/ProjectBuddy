import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  Users, MessageCircle, ArrowRight, Github, Linkedin, Globe,
  GraduationCap, Lightbulb, Trophy, Rocket, Code, Award,
  BookOpen, CheckCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Lottie from 'lottie-react'
import teamworkAnimation from '@/assets/Teamwork productivy.json'
import achievementsAnimation from '@/assets/achivements (lifting stars).json'
import collaborationAnimation from '@/assets/Two businessmen work in the office collaboration search for solutions.json'

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/logo.svg" alt="ProjectBuddy" className="h-10 w-10 transition-transform group-hover:scale-110" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                  ProjectBuddy
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Build Together, Grow Together</span>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              {isAuthenticated ? (
                <>
                  <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 bg-sky-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                    👋 {user?.firstName || user?.username}
                  </span>
                  <Link to="/dashboard">
                    <Button className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700">
                      Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button variant="ghost" className="hidden sm:inline-flex hover:text-sky-600">Sign In</Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-5rem)] flex items-center py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800">
                <GraduationCap className="w-3 h-3 mr-1" />
                Perfect for University Students & Enthusiasts
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Build Your Dream
                <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent"> Team & Projects</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Connect with talented students and enthusiasts. Collaborate on academic projects, 
                startup ideas, open-source contributions, or hackathons. Your next breakthrough starts here!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 shadow-lg">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/register">
                      <Button size="lg" className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 shadow-lg">
                        Start Building Together <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/auth/login">
                      <Button size="lg" variant="outline" className="border-2 border-sky-600 text-sky-700 hover:bg-sky-50 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-gray-800">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-sky-500 mr-2" />
                  Team Management
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-sky-500 mr-2" />
                  Smart Matching
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-sky-500 mr-2" />
                  Real-time Collaboration
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md lg:max-w-lg">
                <Lottie animationData={teamworkAnimation} loop={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30 rounded-2xl p-6 mb-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Active Students</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-2xl p-6 mb-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  100+
                </div>
                <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Teams Formed</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-2xl p-6 mb-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  250+
                </div>
                <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Projects Built</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 mb-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Universities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed specifically for students and enthusiasts to collaborate effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800">
              <CardHeader>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg w-fit mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-white">Skill-Based Teams</CardTitle>
                <CardDescription className="text-base dark:text-gray-300">
                  Form teams based on complementary skills. Find frontend devs, backend wizards, designers, or project managers easily.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800">
              <CardHeader>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-lg w-fit mb-3">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-white">Academic Projects</CardTitle>
                <CardDescription className="text-base dark:text-gray-300">
                  Perfect for thesis projects, course assignments, or research collaborations. Track milestones and deliverables.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent hover:border-green-200 dark:hover:border-green-700 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800">
              <CardHeader>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-lg w-fit mb-3">
                  <Rocket className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-white">Startup Ideas</CardTitle>
                <CardDescription className="text-base dark:text-gray-300">
                  Turn your ideas into reality. Find co-founders, build MVPs, and launch your startup with the right team.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-700 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800">
              <CardHeader>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-lg w-fit mb-3">
                  <Trophy className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-white">Hackathon Teams</CardTitle>
                <CardDescription className="text-base dark:text-gray-300">
                  Quickly assemble teams for upcoming hackathons. Coordinate schedules, share ideas, and win together.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-700 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800">
              <CardHeader>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-3 rounded-lg w-fit mb-3">
                  <Code className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-white">Open Source</CardTitle>
                <CardDescription className="text-base dark:text-gray-300">
                  Contribute to open-source projects. Build your portfolio, learn from others, and give back to the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-700 shadow-lg hover:shadow-xl transition-all dark:bg-gray-800">
              <CardHeader>
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-3 rounded-lg w-fit mb-3">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-white">Real-Time Chat</CardTitle>
                <CardDescription className="text-base dark:text-gray-300">
                  Stay connected with team messaging, project discussions, and direct messages. Collaborate seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Collaboration Section - Large Animation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="w-full max-w-md lg:max-w-lg">
                <Lottie animationData={collaborationAnimation} loop={true} />
              </div>
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <Badge className="mb-4 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800">
                <MessageCircle className="w-3 h-3 mr-1" />
                Seamless Collaboration
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Work Together,
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Achieve More</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Real-time messaging, project discussions, and file sharing. Everything you need to collaborate 
                effectively, all in one place. Never miss a beat with instant notifications.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Team Chat Rooms</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Dedicated channels for each project and team</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Direct Messaging</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Connect one-on-one with team members</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Progress Updates</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Share achievements and keep everyone in the loop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Section - Large Animation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800">
                <Trophy className="w-3 h-3 mr-1" />
                Track Your Success
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Celebrate Every
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Milestone</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Set goals, track progress, and celebrate achievements with your team. From small wins to major 
                breakthroughs, every step forward deserves recognition!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-sm text-gray-700 font-medium">Project Completion Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
                  <div className="text-sm text-gray-700 font-medium">Average Team Rating</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Milestone tracking & deadlines</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Team achievement badges</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Portfolio building for members</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md lg:max-w-lg">
                <Lottie animationData={achievementsAnimation} loop={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases with Animation Backgrounds */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Perfect For Every
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Student Journey</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you're starting your first project or building the next big thing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Academic Projects</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Perfect for final year projects, course assignments, or research collaborations. 
                      Find teammates from your university or across Bangladesh!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">Thesis Work</Badge>
                      <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">Group Assignments</Badge>
                      <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">Research</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
                    <Lightbulb className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Startup Ideas</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Turn your ideas into reality. Find co-founders, build MVPs, and launch your startup 
                      with passionate entrepreneurs.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">Co-founders</Badge>
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">MVP Development</Badge>
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">Business Ideas</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Hackathons</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Quickly assemble dream teams for hackathons. Coordinate schedules, brainstorm ideas, 
                      and win competitions together!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">Team Building</Badge>
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">24h Sprints</Badge>
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">Competitions</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg">
                    <Code className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Open Source</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Contribute to open-source projects. Build your portfolio, learn from experienced 
                      developers, and give back to the community.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300">GitHub Projects</Badge>
                      <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300">Learning</Badge>
                      <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300">Portfolio</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

  {/* CTA Section with Animation */}
  <section className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600 dark:from-sky-800 dark:via-cyan-900 dark:to-teal-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Rocket className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">Join 500+ Active Students</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-sky-100 mb-8">
                Join hundreds of students and enthusiasts who are turning ideas into reality. 
                Your next great collaboration is one click away.
              </p>
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-sky-700 hover:bg-gray-100 shadow-2xl text-lg px-8 py-6">
                      Go to Your Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link to="/auth/register">
                      <Button size="lg" className="bg-white text-sky-700 hover:bg-gray-100 shadow-2xl text-lg px-8 py-6">
                        Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/auth/login">
                      <Button size="lg" className="bg-transparent text-white border-2 border-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>No signup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Join growing community</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <div className="bg-white p-3 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">500+ Students</div>
                      <div className="text-blue-100 text-sm">Active members</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <div className="bg-white p-3 rounded-lg">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">100+ Teams</div>
                      <div className="text-blue-100 text-sm">Actively collaborating</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <div className="bg-white p-3 rounded-lg">
                      <Rocket className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">250+ Projects</div>
                      <div className="text-blue-100 text-sm">Successfully completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4 group">
                <img src="/logo.svg" alt="ProjectBuddy" className="h-10 w-10 transition-transform group-hover:scale-110" />
                <span className="text-2xl font-bold">ProjectBuddy</span>
              </Link>
              <p className="text-gray-400 dark:text-gray-500 max-w-md mb-4">
                Empowering university students and enthusiasts to collaborate on amazing projects. 
                Build your dream team, learn together, and create something extraordinary.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400 dark:text-gray-500">
                <GraduationCap className="h-4 w-4" />
                <span>Made for students, by students</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><Link to="/auth/register" className="hover:text-white dark:hover:text-gray-200 transition-colors">Get Started</Link></li>
                <li><Link to="/auth/login" className="hover:text-white dark:hover:text-gray-200 transition-colors">Sign In</Link></li>
                {isAuthenticated && (
                  <li><Link to="/dashboard" className="hover:text-white dark:hover:text-gray-200 transition-colors">Dashboard</Link></li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-3 mb-4">
                <a 
                  href="https://github.com/codernayeem" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 dark:bg-gray-900 p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all hover:scale-110 group"
                >
                  <Github className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-white dark:group-hover:text-gray-200 transition-colors" />
                </a>
                <a 
                  href="https://linkedin.com/in/codernayeem" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 dark:bg-gray-900 p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all hover:scale-110 group"
                >
                  <Linkedin className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-white dark:group-hover:text-gray-200 transition-colors" />
                </a>
                <a 
                  href="https://codernayeem.github.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 dark:bg-gray-900 p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all hover:scale-110 group"
                >
                  <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-white dark:group-hover:text-gray-200 transition-colors" />
                </a>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                Join our community and stay updated!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-600">
                GitHub: <a href="https://github.com/codernayeem" target="_blank" rel="noopener noreferrer" className="text-blue-400 dark:text-blue-500 hover:text-blue-300 dark:hover:text-blue-400">@codernayeem</a>
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 dark:text-gray-500">
              <p>&copy; 2025 ProjectBuddy. All rights reserved.</p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Award className="h-4 w-4 text-blue-500" />
                <span>Free for all students</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}