import Link from "next/link"
import { ArrowRight, Brain, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/5 to-transparent" />

      <div className="container px-4 md:px-6 relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-8 animate-in slide-in-from-left duration-700">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium gap-2 animate-in fade-in duration-1000 hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  AI-Powered Medical Analysis
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Advanced Medical Image Analysis Powered by AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                Detectly provides automated detection and analysis of various medical conditions using state-of-the-art
                machine learning models.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 hover:scale-105 transform transition-all duration-300 shadow-lg shadow-primary/20 h-12 px-8">
                  Try the Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 border-primary/20 hover:bg-primary/5 transition-colors">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end animate-in slide-in-from-right duration-700">
            <div className="relative h-[450px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-background to-accent/10 border border-primary/10 shadow-2xl shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="grid grid-cols-2 gap-6 w-full max-w-[500px]">
                    <div className="aspect-square rounded-xl bg-background/95 p-4 shadow-xl backdrop-blur-sm border border-primary/10 hover:scale-105 transition-transform duration-300 group">
                      <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-3 group-hover:scale-110 transition-transform duration-300">
                          <Brain className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-base font-semibold">Alzheimer's</div>
                        <div className="text-sm text-muted-foreground font-medium">95% Accuracy</div>
                      </div>
                    </div>
                    <div className="aspect-square rounded-xl bg-background/95 p-4 shadow-xl backdrop-blur-sm border border-primary/10 hover:scale-105 transition-transform duration-300 group">
                      <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-3 group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="h-8 w-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="m4.9 4.9 14.2 14.2" />
                          </svg>
                        </div>
                        <div className="text-base font-semibold">Brain Tumor</div>
                        <div className="text-sm text-muted-foreground font-medium">97% Accuracy</div>
                      </div>
                    </div>
                    <div className="aspect-square rounded-xl bg-background/95 p-4 shadow-xl backdrop-blur-sm border border-primary/10 hover:scale-105 transition-transform duration-300 group">
                      <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-3 group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="h-8 w-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <div className="text-base font-semibold">Retinopathy</div>
                        <div className="text-sm text-muted-foreground font-medium">93% Accuracy</div>
                      </div>
                    </div>
                    <div className="aspect-square rounded-xl bg-background/95 p-4 shadow-xl backdrop-blur-sm border border-primary/10 hover:scale-105 transition-transform duration-300 group">
                      <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-3 group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="h-8 w-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </div>
                        <div className="text-base font-semibold">Heart Disease</div>
                        <div className="text-sm text-muted-foreground font-medium">91% Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
