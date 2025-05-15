import Link from "next/link"
import { ArrowRight, Brain, LineChart, Microscope, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-accent/10 to-primary/5">
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-xl font-bold animate-in slide-in-from-left duration-500">
            <Microscope className="h-6 w-6 text-primary animate-pulse" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 font-extrabold">
              Detectly
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-6">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:scale-105 transform duration-200 relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="#diseases"
                className="text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:scale-105 transform duration-200 relative group"
              >
                Diseases
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:scale-105 transform duration-200 relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="default"
                  className="animate-in zoom-in duration-300 hover:scale-105 transform transition bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />

        <section id="features" className="container py-20 md:py-28 scroll-m-20">
          <div className="text-center mb-16 space-y-4 animate-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
              Advanced Medical Analysis Features
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Detectly provides cutting-edge AI-powered analysis for medical professionals
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="animate-in slide-in-from-bottom-2 duration-500 hover:scale-105 transition-transform">
              <FeatureCard
                icon={<Brain className="h-12 w-12 text-primary group-hover:text-white transition-colors" />}
                title="Multiple Disease Detection"
                description="Support for various medical conditions with specialized models"
              />
            </div>
            <div className="animate-in slide-in-from-bottom-3 duration-700 hover:scale-105 transition-transform">
              <FeatureCard
                icon={<LineChart className="h-12 w-12 text-primary group-hover:text-white transition-colors" />}
                title="AI-Powered Analysis"
                description="Utilizes machine learning models for accurate detection and diagnosis"
              />
            </div>
            <div className="animate-in slide-in-from-bottom-4 duration-900 hover:scale-105 transition-transform">
              <FeatureCard
                icon={<Microscope className="h-12 w-12 text-primary group-hover:text-white transition-colors" />}
                title="Medical Consultation"
                description="AI-generated medical explanations and recommendations"
              />
            </div>
            <div className="animate-in slide-in-from-bottom-5 duration-1000 hover:scale-105 transition-transform">
              <FeatureCard
                icon={<ArrowRight className="h-12 w-12 text-primary group-hover:text-white transition-colors" />}
                title="RESTful API"
                description="Easy integration with other healthcare applications and systems"
              />
            </div>
          </div>
        </section>

        <section id="diseases" className="py-20 md:py-28 bg-gradient-to-br from-accent/10 via-primary/5 to-purple-500/5 scroll-m-20">
          <div className="container">
            <div className="text-center mb-16 space-y-4 animate-in slide-in-from-bottom duration-700">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Supported Medical Conditions
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Our AI models are trained to detect and analyze these conditions with high accuracy
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="group animate-in slide-in-from-left-4 duration-700">
                <Card className="transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/10 border-primary/10">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors text-2xl">Alzheimer's Disease</CardTitle>
                    <CardDescription className="text-base">MRI-based detection and classification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our model analyzes brain MRI images to detect signs of Alzheimer's disease and classify the severity
                      from Non-Dementia to Moderate Dementia with detailed explanations.
                    </p>
                    <div className="mt-6">
                      <Link href="/dashboard/alzheimer">
                        <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 border-primary/20">
                          Try Detection
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="group animate-in slide-in-from-right-4 duration-700">
                <Card className="transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/10 border-primary/10">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors text-2xl">Brain Tumor</CardTitle>
                    <CardDescription className="text-base">MRI-based tumor detection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Detectly can identify the presence of brain tumors from MRI scans with high confidence, providing
                      detailed analysis of the findings to assist medical professionals.
                    </p>
                    <div className="mt-6">
                      <Link href="/dashboard/brain-tumor">
                        <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 border-primary/20">
                          Try Detection
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="group animate-in slide-in-from-left-4 duration-900">
                <Card className="transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/10 border-primary/10">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors text-2xl">Diabetic Retinopathy</CardTitle>
                    <CardDescription className="text-base">Retinal image analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our system analyzes retinal images to detect and classify diabetic retinopathy from mild to severe
                      stages, helping with early intervention and treatment planning.
                    </p>
                    <div className="mt-6">
                      <Link href="/dashboard/diabetic-retinopathy">
                        <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 border-primary/20">
                          Try Detection
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="group animate-in slide-in-from-right-4 duration-900">
                <Card className="transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/10 border-primary/10">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors text-2xl">Heart Disease Risk</CardTitle>
                    <CardDescription className="text-base">Patient data analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      By analyzing patient data including age, blood pressure, cholesterol levels and more, our model can
                      assess the risk of heart disease with personalized explanations.
                    </p>
                    <div className="mt-6">
                      <Link href="/dashboard/heart-disease">
                        <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 border-primary/20">
                          Try Assessment
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="container py-20 md:py-28 scroll-m-20">
          <div className="text-center mb-16 space-y-4 animate-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
              How Detectly Works
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Simple integration with your existing healthcare systems
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center group animate-in slide-in-from-left duration-700">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 mb-6 transition-transform group-hover:scale-110 duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">1</span>
              </div>
              <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">Upload Medical Images</h3>
              <p className="mt-3 text-muted-foreground">
                Submit medical images or patient data through our secure API endpoints
              </p>
            </div>

            <div className="flex flex-col items-center text-center group animate-in slide-in-from-bottom duration-700">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 mb-6 transition-transform group-hover:scale-110 duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">2</span>
              </div>
              <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">AI Analysis</h3>
              <p className="mt-3 text-muted-foreground">
                Our specialized machine learning models analyze the data with high precision
              </p>
            </div>

            <div className="flex flex-col items-center text-center group animate-in slide-in-from-right duration-700">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 mb-6 transition-transform group-hover:scale-110 duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">3</span>
              </div>
              <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">Receive Results</h3>
              <p className="mt-3 text-muted-foreground">
                Get detailed analysis with confidence scores and medical explanations
              </p>
            </div>
          </div>

          <div className="mt-16 text-center animate-in fade-in duration-1000">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 hover:scale-105 transform transition-all duration-300 shadow-lg shadow-primary/20">
                Try Detectly Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
